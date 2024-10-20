import { sendToOllama } from './content-processor.js';
import { startTabProcessing, onTabProcessed, stopTabProcessing, isProcessingMultipleTabs } from './tab-processor.js';

let socket;

export function connectWebSocket() {
  socket = new WebSocket('ws://localhost:3001');

  socket.onopen = () => {
    console.log('WebSocket 连接已建立');
  };

  socket.onmessage = (event) => {
    console.log('收到消息:', event.data);
    // 处理接收到的消息
  };

  socket.onclose = () => {
    console.log('WebSocket 连接已关闭');
    setTimeout(connectWebSocket, 5000); // 5秒后尝试重连
  };

  socket.onerror = (error) => {
    console.error('WebSocket 错误:', error);
  };
}

export function runOllamaModel(content, obsidianPath, title, url) {
  return new Promise((resolve, reject) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      reject(new Error('WebSocket 未连接'));
      return;
    }

    console.log(`尝试运行 Ollama 模型 qwen2:7b,内容长度: ${content.length}`);
    console.log('传递的 URL:', url || 'https://example.com');

    const message = JSON.stringify({
      model: 'qwen2:7b',
      prompt: content,
      obsidianPath: obsidianPath,
      title: title,
      url: url
    });

    let fullResponse = '';

    socket.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        if (response.error) {
          // 检查是否是 "responseText is not defined" 错误
          if (response.error === "responseText is not defined") {
            console.log('忽略 "responseText is not defined" 错误');
            return; // 直接返回,不做任何处理
          }
          console.error('Ollama 响应错误:', response.error);
          console.error('错误详情:', event.data);
        } else if (response.result) {
          fullResponse += response.result;
          console.log('Ollama 部分响应:', response.result);
        } else if (response.type === 'writeComplete') {
          console.log('文件写入完成:', response.message);
        }
      } catch (error) {
        console.error('解析 WebSocket 消息时出错:', error);
        console.error('原始响应:', event.data);
      }
    };

    socket.send(message);
    console.log(`消息已发送到 WebSocket,长度: ${message.length}`);

    // 设置超时,以防止无限等待
    setTimeout(() => {
      if (fullResponse) {
        console.log('响应超时,返回已收到的内容');
        resolve(fullResponse);
      } else {
        reject(new Error('Ollama 响应超时'));
      }
    }, 30000); // 30秒超时
  });
}

export function injectContentScript(tabId, retry = 0) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ['content/content.js']
  }, () => {
    if (chrome.runtime.lastError) {
      console.error("注入内容脚本时出错:", chrome.runtime.lastError);
      if (retry < 3) {
        console.log(`尝试重新注入内容脚本 (${retry + 1}/3)...`);
        setTimeout(() => injectContentScript(tabId, retry + 1), 1000);
      } else {
        console.error("内容脚本注入失败,跳过此标签页");
        onTabProcessed(tabId); // 跳过此标签页并继续处理下一个
      }
    } else {
      console.log("内容脚本已成功注入");
      testOllamaService(tabId);
    }
  });
}

export function testOllamaService(tabId) {
  console.log("开始测试 Ollama 服务");
  const testPrompt = `
请根据以下内容,按照指定格式回答:

原文标题: 测试标题
文章链接: https://example.com
文章内容: 这是一个测试内容。

请按照以下格式回答:
文章链接：[链接]
文章类型: [类型]
TL;DR: [文章摘要]
标签: [标签1], [标签2], [标签3]
亮点内容:
1. [亮点1]
2. [亮点2]
3. [亮点3]
主要涉及的人物、作品或概念:
1. [概念1]
2. [概念2]
3. [概念3]
思考：
1. [可发散内容1]
2. [可发散内容2]
3. [可发散内容3]
4. [可发散内容4]
`;
  runOllamaModel(testPrompt, "/test/path", "测试标题", "https://example.com")
    .then((response) => {
      console.log("Ollama 服务测试成功");
      console.log("测试响应:", response);
      chrome.tabs.sendMessage(tabId, { action: "processArticle" });
    })
    .catch((error) => {
      console.error("Ollama 服务测试失败:", error);
      chrome.tabs.sendMessage(tabId, { action: "showError", error: "Ollama 服务不可用" });
    });
}

// 件监听器
chrome.runtime.onInstalled.addListener(() => {
  connectWebSocket();
});

chrome.action.onClicked.addListener((tab) => {
  console.log("扩展图标被点击,开始处理当前标签页");
  processCurrentTab();
});

// 修改这个函数
function processCurrentTab() {
  chrome.windows.getLastFocused({populate: true}, (window) => {
    const activeTab = window.tabs.find(tab => tab.active);
    if (activeTab) {
      chrome.storage.sync.get(['obsidianPath'], function(result) {
        const obsidianPath = result.obsidianPath;
        injectContentScript(activeTab.id);
      });
    } else {
      console.error("未找到当前活动标签页");
    }
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "articleContent") {
    chrome.storage.sync.get(['obsidianPath'], function(result) {
      const obsidianPath = result.obsidianPath;
      console.log("接收到的标题:", message.title);
      sendToOllama(message.content, obsidianPath, message.title, message.url)
        .then(response => {
          console.log("Ollama 处理结果:", response);
          // 只在处理单个标签页时显示通知
          if (!isProcessingMultipleTabs()) {
            chrome.notifications.create({
              type: 'basic',
              iconUrl: '/icons/icon128.png',
              title: '智能文章助手',
              message: '文章处理完毕,已写入 Obsidian'
            });
          }
          sendResponse({ success: true, result: response });
          onTabProcessed(sender.tab.id);
        })
        .catch(error => {
          console.error("处理文章内容时出错:", error);
          sendResponse({ success: false, error: error.message });
          onTabProcessed(sender.tab.id);
        });
    });
    return true;
  }
});

// 可以添加一个停止处理的命令
chrome.commands.onCommand.addListener((command) => {
  try {
    if (command === "stop_processing") {
      stopTabProcessing();
    } else if (command === "process_all_tabs") {
      console.log("开始处理所有标签页");
      chrome.windows.getLastFocused({populate: true}, (window) => {
        startTabProcessing(window.tabs);
      });
    }
  } catch (error) {
    console.error("执行命令时发生错误:", error);
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '/icons/icon128.png',
      title: '智能文章助手',
      message: '处理标签页时发生错误,请稍后重试'
    });
  }
});

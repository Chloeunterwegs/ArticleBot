import { sendToOllama } from './content-processor.js';

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
    console.log('传递的 URL:', url || 'https://example.com'); // 提供默认URL

    const message = JSON.stringify({
      model: 'qwen2:7b',
      prompt: content,
      obsidianPath: obsidianPath,
      title: title,
      url: url || 'https://example.com' // 使用默认URL
    });

    socket.send(message);
    console.log(`消息已发送到 WebSocket,长度: ${message.length}`);

    socket.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        if (response.error) {
          console.error('Ollama 响应错误:', response.error);
          reject(new Error(response.error));
        } else {
          console.log('Ollama 完整响应:', response.result);
          resolve(response.result);
        }
      } catch (error) {
        console.error('解析 Ollama 响应时出错:', error);
        reject(error);
      }
    };
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
        console.error("内容脚本注入失败,请检查文件路径和权限设置");
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
文章类型: [类型]
文章总结: [总结]
标签: [标签1], [标签2], [标签3]
亮点内容:
1. [亮点1]
2. [亮点2]
3. [亮点3]
主要涉及的人物、作品或概念:
1. [概念1]
2. [概念2]
3. [概念3]
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
  console.log("扩展图标被点击,开始处理文章");
  injectContentScript(tab.id);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "articleContent") {
    chrome.storage.sync.get(['obsidianPath'], function(result) {
      const obsidianPath = result.obsidianPath;
      console.log("接收到的标题:", message.title);
      sendToOllama(message.content, obsidianPath, message.title, message.url)
        .then(response => {
          console.log("Ollama 处理结果:", response);
          sendResponse({ success: true, result: response });
        })
        .catch(error => {
          console.error("处理文章内容时出错:", error);
          sendResponse({ success: false, error: error.message });
        });
    });
    return true;
  }
});

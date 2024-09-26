import { sendToOllama } from './content-processor.js';

let socket;

export function connectWebSocket() {
  socket = new WebSocket('ws://localhost:3000');

  socket.onopen = () => {
    console.log('WebSocket 连接已建立');
  };

  socket.onmessage = (event) => {
    console.log('收到消息:', event.data);
    // 处理接收到的消息
  };

  socket.onclose = () => {
    console.log('WebSocket 连接已关闭');
    // 可以在这里添加重连逻辑
  };

  socket.onerror = (error) => {
    console.error('WebSocket 错误:', error);
  };
}

export function runOllamaModel(content) {
  return new Promise((resolve, reject) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      reject(new Error('WebSocket 未连接'));
      return;
    }

    console.log(`尝试运行 Ollama 模型 qwen2:7b,内容长度: ${content.length}`);

    const message = JSON.stringify({
      model: 'qwen2:7b',
      prompt: content
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
          console.log('Ollama 响应成功,结果长度:', response.result.length);
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
  runOllamaModel("Hello, Ollama!")
    .then(() => {
      console.log("Ollama 服务测试成功");
      chrome.tabs.sendMessage(tabId, { action: "processArticle" });
    })
    .catch((error) => {
      console.error("Ollama 服务测试失败:", error);
      chrome.tabs.sendMessage(tabId, { action: "showError", error: "Ollama 服务不可用" });
    });
}

// 事件监听器
chrome.runtime.onInstalled.addListener(() => {
  connectWebSocket();
});

chrome.action.onClicked.addListener((tab) => {
  console.log("扩展图标被点击,开始处理文章");
  injectContentScript(tab.id);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "contentScriptLoaded") {
    console.log("内容脚本已加载,来自标签页:", sender.tab.id);
  } else if (message.action === "articleContent") {
    sendToOllama(message.content)
      .then(response => {
        console.log("Ollama 处理结果:", response);
        // 这里可以添加更多处理逻辑,如保存到 Obsidian 等
        sendResponse({ success: true, result: response });
      })
      .catch(error => {
        console.error("处理文章内容时出错:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // 保持消息通道开放
  }
});
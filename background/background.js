let ws;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectInterval = 5000; // 5秒
const HEARTBEAT_INTERVAL = 30000; // 30秒
let heartbeatTimer;
const WS_CHECK_INTERVAL = 60000; // 每60秒检查一次WebSocket状态
let wsCheckTimer;
let currentModel = "qwen2:7b"; // 默认模型

function startHeartbeat() {
  stopHeartbeat();
  heartbeatTimer = setInterval(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'heartbeat' }));
      console.log('发送心跳');
    }
  }, HEARTBEAT_INTERVAL);
}

function stopHeartbeat() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
  }
}

function checkWebSocketStatus() {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.log("WebSocket连接已断开,尝试重新连接");
    connectWebSocket();
  }
}

function startWebSocketCheck() {
  stopWebSocketCheck();
  wsCheckTimer = setInterval(checkWebSocketStatus, WS_CHECK_INTERVAL);
}

function stopWebSocketCheck() {
  if (wsCheckTimer) {
    clearInterval(wsCheckTimer);
  }
}

function connectWebSocket() {
  ws = new WebSocket('ws://localhost:3000');

  ws.onopen = () => {
    console.log('WebSocket 连接已建立');
    reconnectAttempts = 0;
    startHeartbeat();
    startWebSocketCheck();
  };

  ws.onclose = () => {
    console.log('WebSocket 连接已关闭');
    stopHeartbeat();
    stopWebSocketCheck();
    attemptReconnect();
  };

  ws.onerror = (error) => {
    console.error('WebSocket 错误:', error);
    stopHeartbeat();
    stopWebSocketCheck();
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'heartbeat') {
      console.log('收到心跳响应');
    } else {
      console.log('收到消息:', event.data);
      // 处理其他类型的消息
    }
  };
}

function attemptReconnect() {
  if (reconnectAttempts < maxReconnectAttempts) {
    reconnectAttempts++;
    console.log(`尝试重新连接 (${reconnectAttempts}/${maxReconnectAttempts})...`);
    setTimeout(connectWebSocket, reconnectInterval);
  } else {
    console.error('达到最大重连次数,停止尝试');
  }
}

function runOllamaModel(content, timeout = 60000) {
  return new Promise((resolve, reject) => {
    console.log(`尝试运行 Ollama 模型 ${currentModel},内容长度: ${content.length}`);
    const message = JSON.stringify({ model: currentModel, prompt: content });
    
    const timeoutId = setTimeout(() => {
      reject(new Error("Ollama服务响应超时"));
    }, timeout);

    function messageHandler(event) {
      clearTimeout(timeoutId);
      ws.removeEventListener('message', messageHandler);
      
      try {
        const data = JSON.parse(event.data);
        if (data.error) {
          console.error("Ollama 错误:", data.error);
          reject(new Error(data.error));
        } else if (data.result) {
          console.log("Ollama 响应成功,结果长度:", data.result.length);
          resolve(data.result);
        } else {
          throw new Error("未知的响应格式");
        }
      } catch (error) {
        console.error("解析 WebSocket 响应时出错:", error);
        reject(error);
      }
    }

    ws.addEventListener('message', messageHandler);
    ws.send(message);
    console.log("消息已发送到 WebSocket,长度:", message.length);
  });
}

function injectContentScript(tabId, retry = 0) {
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

function testOllamaService(tabId) {
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
  }
});
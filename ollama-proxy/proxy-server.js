import { WebSocketServer } from 'ws';
import fetch from 'node-fetch';
import http from 'http';

const wss = new WebSocketServer({ port: 3000 });

function checkOllamaHealth() {
  http.get('http://localhost:11434/', (res) => {
    if (res.statusCode === 200) {
      console.log('Ollama 服务健康检查通过');
    } else {
      console.error('Ollama 服务健康检查失败:', res.statusCode);
      console.error('请确保 Ollama 服务正在运行,并且可以通过 http://localhost:11434 访问');
    }
  }).on('error', (err) => {
    console.error('Ollama 服务健康检查错误:', err);
    console.error('请检查 Ollama 服务是否正在运行,以及网络连接是否正常');
  });
}

setInterval(checkOllamaHealth, 60000); // 每60秒检查一次

// ... 其他代码保持不变 ...

wss.on('connection', (ws) => {
  console.log('WebSocket 客户端已连接');

  ws.on('message', async (message) => {
    console.log('收到消息:', message.toString());
    
    try {
      const data = JSON.parse(message);
      if (data.type === 'heartbeat') {
        ws.send(JSON.stringify({ type: 'heartbeat' }));
        console.log('响应心跳');
        return;
      }
      
      if (!data.model || !data.prompt || typeof data.prompt !== 'string') {
        throw new Error('无效的消息格式');
      }
      
      const { model, prompt } = data;
      
      console.log(`处理消息: 模型=${model}, 内容长度=${prompt.length}`);

      console.log('开始调用 Ollama API');
      const startTime = Date.now();
      let response;
      try {
        response = await fetch('http://localhost:11434/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: prompt }],
            stream: false
          }),
        });
      } catch (fetchError) {
        console.error('调用 Ollama API 时发生错误:', fetchError);
        ws.send(JSON.stringify({ error: `调用 Ollama API 失败: ${fetchError.message}` }));
        return;
      }
      const endTime = Date.now();
      console.log(`Ollama API 调用耗时: ${endTime - startTime}ms`);

      if (!response.ok) {
        const errorMessage = `HTTP error! status: ${response.status}, statusText: ${response.statusText}`;
        console.error(errorMessage);
        ws.send(JSON.stringify({ error: errorMessage }));
        return;
      }

      let result;
      try {
        result = await response.json();
        console.log('Ollama API 响应:', result);
        
        if (result.message && result.message.content) {
          ws.send(JSON.stringify({ result: result.message.content }));
        } else {
          throw new Error('未知的响应格式');
        }
      } catch (jsonError) {
        console.error('解析 Ollama API 响应时发生错误:', jsonError);
        console.error('原始响应:', await response.text());
        ws.send(JSON.stringify({ error: `解析 Ollama API 响应失败: ${jsonError.message}` }));
      }
    } catch (error) {
      console.error('处理消息时出错:', error);
      ws.send(JSON.stringify({ error: error.message }));
    }
  });

  ws.on('close', () => {
    console.log('WebSocket 客户端已断开连接');
  });
});

console.log('WebSocket 服务器正在监听端口 3000');
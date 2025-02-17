import { WebSocketServer } from 'ws';
import fetch from 'node-fetch';
import http from 'http';
import fs from 'fs/promises';
import path from 'path';

const wss = new WebSocketServer({ port: 3001 });

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
      
      const { model, prompt, obsidianPath, title, url } = data;
      
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
        const responseText = await response.text(); // 先获取响应文本
        result = JSON.parse(responseText); // 然后解析 JSON
        console.log('Ollama API 响应:', result);
        
        if (result.message && result.message.content) {
          const ollamaResponse = result.message.content.trim();
          console.log('Ollama 完整响应:', ollamaResponse);
          
          // 直接使用 Ollama 的响应,不进行额外的修改
          const processedResponse = ollamaResponse;
          
          // 直接发送 Ollama 的原始响应
          ws.send(JSON.stringify({ result: processedResponse }));
          
          // 处理文件名
          const safeTitle = title
            .replace(/[<>:"/\\|?*]/g, '') // 移除不允许的字符
            .replace(/\s+/g, '_')         // 将空格替换为下划线
            .replace(/[^\x00-\x7F]/g, '') // 移除非ASCII字符
            .trim();
          
          // 如果处理后的标题为空，使用时间戳作为文件名
          const fileName = safeTitle || `article_${Date.now()}`;
          
          // 限制文件名长度
          const maxLength = 255; // 大多数文件系统的最大文件名长度
          const truncatedFileName = fileName.length > maxLength ? fileName.slice(0, maxLength) : fileName;
          
          // 将 Ollama 的原始响应写入 Obsidian 文件
          const contentToWrite = `# ${title}\n\n${processedResponse}`;
          const obsidianFilePath = path.join(obsidianPath, `${truncatedFileName}.md`);
          await fs.writeFile(obsidianFilePath, contentToWrite, 'utf8');
          console.log(`内容已写入 Obsidian 文件: ${obsidianFilePath}`);

          // 发送写入完成的通知
          ws.send(JSON.stringify({ type: 'writeComplete', message: '写入完毕', filePath: obsidianFilePath }));
        } else {
          console.warn('Ollama 响应格式不符合预期');
          ws.send(JSON.stringify({ error: 'Ollama 响应格式不符合预期' }));
        }
      } catch (jsonError) {
        console.error('解析 Ollama API 响应时发生错误:', jsonError);
        console.error('原始响应:', responseText); // 使用之前保存的响应文本
        ws.send(JSON.stringify({ error: `解析 Ollama API 响应失败: ${jsonError.message}` }));
      }
    } catch (error) {
      console.error('处理消息时出错:', error);
      ws.send(JSON.stringify({ error: error.message }));
    }
  });
});

console.log('WebSocket 服务器正在监听端口 3001');

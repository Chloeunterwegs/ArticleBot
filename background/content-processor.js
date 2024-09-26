import { runOllamaModel } from './background.js';

// 处理从内容脚本接收到的页面内容
function processPageContent(content) {
  // 这里可以添加更多的内容处理逻辑,如去除广告、格式化等
  return content.trim();
}

// 生成发送给 Ollama 的 prompt
function generatePrompt(content) {
  return `请对以下文章内容进行总结，若内容为非中文先译成中文再进行总结，生成三个关键标签，并根据总结内容生成Markmap的md文档，并提取文章中涉及的3个相关事物:

${content}

请按照以下格式回复:
总结:
[在这里提供300字以内的总结]

标签:
1. [标签1]
2. [标签2]
3. [标签3]

相关事物:
1. [事物1]
2. [事物2]
3. [事物3]

MD文档:
[在这里提供Markmap的md文档]`;
}

// 发送内容到 Ollama 服务
export async function sendToOllama(content, obsidianPath, title) {
  const processedContent = processPageContent(content);
  const prompt = generatePrompt(processedContent);
  
  try {
    const response = await runOllamaModel(prompt, obsidianPath, title);
    return response;
  } catch (error) {
    console.error('发送到 Ollama 服务时出错:', error);
    throw error;
  }
}
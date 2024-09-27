import { runOllamaModel } from './background.js';

/**
 * 处理从内容脚本接收到的页面内容
 * @param {string} content - 原始页面内容
 * @returns {string} 处理后的内容
 */
function processPageContent(content) {
  // 目前只是简单地去除首尾空白，未来可以在这里添加更多处理逻辑
  return content.trim();
}

/**
 * 发送内容到 Ollama 服务并获取响应
 * @param {string} content - 页面内容
 * @param {string} obsidianPath - Obsidian 保存路径
 * @param {string} title - 页面标题
 * @param {string} url - 页面 URL
 * @returns {Promise<string>} Ollama 服务的响应
 */
export async function sendToOllama(content, obsidianPath, title, url) {
  const processedContent = processPageContent(content);
  const prompt = generatePrompt(processedContent, url);
  
  try {
    const response = await runOllamaModel(prompt, obsidianPath, title, url);
    return response;
  } catch (error) {
    console.error('发送到 Ollama 服务时出错:', error);
    throw error;
  }
}

/**
 * 生成发送给 Ollama 的 prompt
 * @param {string} content - 处理后的页面内容
 * @param {string} url - 页面 URL
 * @returns {string} 生成的 prompt
 */
function generatePrompt(content, url) {
  return `请对以下文章进行分析与总结。如果文章不是中文，请先将其翻译成中文。完成以下任务:
a) 对文章进行总结
b) 生成三个标签
c) 提炼三个亮点事件
d) 识别三个涉及的主要人物或物品
e) 将总结内容转化为可生成markmap的markdown格式

文章链接: ${url}
${content}

标签应该能概括文章的主题或关键词。亮点事件是文章中最引人注目或最重要的事件。涉及的人或物应该是文章中频繁提到或起重要作用的实体。

请按以下格式提供你的分析结果:

文章链接: ${url}
文章总结: [在这里插入总结]

标签: 
1. [标签1]
2. [标签2]
3. [标签3]

亮点事件:
1. [事件1]
2. [事件2]
3. [事件3]

主要涉及的人或物:
1. [人或物1]
2. [人或物2]
3. [人或物3]

Markmap格式的总结:
[在这里提供Markmap的md文档]`;
}


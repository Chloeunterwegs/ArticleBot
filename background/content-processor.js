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
  console.log('sendToOllama 接收到的内容:', { title, url, contentLength: content.length });
  const processedContent = processPageContent(content);
  const prompt = generatePrompt(processedContent, url, title);
  
  console.log('生成的 prompt:', prompt);

  try {
    const response = await runOllamaModel(prompt, obsidianPath, title, url);
    console.log('Ollama 返回的原始响应:', response);
    
    // 添加处理逻辑
    const processedResponse = ensureResponseFormat(response, url, title);
    
    return processedResponse;
  } catch (error) {
    console.error('发送到 Ollama 服务时出错:', error);
    throw error;
  }
}

/**
 * 生成发送给 Ollama 的 prompt
 * @param {string} content - 处理后的页面内容
 * @param {string} url - 页面 URL
 * @param {string} title - 页面标题
 * @returns {string} 生成的 prompt
 */
function generatePrompt(content, url, title) {
  const cleanContent = removeHeaderFooter(content);
  
  return `
请根据以下内容,严格按照指定格式用中文回答，务必在指示处添加分割线。确保回答完整,不要省略任何部分,内容必须与原文相符,并且必须包含原文链接:

原文标题: ${title}
原文链接: ${url}

${cleanContent}

请按照以下格式回答,确保包含原文链接:
- **Tags:** #[填写领域标签] #[填写行业标签] #[填写主题标签]

- **Title:** ${title}
- **URL:** ${url}
- **Type:** [填写文章类型1]/[填写文章类型2]

——————
[添加分割线]

### TL;DR
[100字左右的中文精炼摘要，简单但有智慧]

——————
[添加分割线]

### 亮点内容
1. [填写有价值的重点]
2. [填写反直觉的重点]
3. [填写有洞见重点]

### 涉及人物、作品或概念:
1. [填写主要涉及的人物]
2. [填写主要涉及的作品]
3. [填写主要涉及的概念]

### 思考：
1. [填写可发散选题：从反常识的角度]
2. [填写可发散选题：从批判性思考的角度]
3. [填写可发散选题：从创作病毒式传播内容的角度]
4. [填写可发散选题：从科技与文化结合的角度]

——————
[添加分割线]`;
}

function removeHeaderFooter(content) {
  // 这里实现移除 header 和 footer 的逻辑
  // 可以使用正则表达式或其他方法来识别和移除不必要的内容
  // 这里只是一个简单的示例，您可能需要根据实际情况调整
  const lines = content.split('\n');
  const startIndex = lines.findIndex(line => line.trim().length > 0);
  const endIndex = lines.reverse().findIndex(line => line.trim().length > 0);
  return lines.slice(startIndex, -endIndex).join('\n');
}

function ensureResponseFormat(response, url, title) {
  let processedResponse = response;

  // 确保原文链接存在
  if (!processedResponse.includes('原文链接:')) {
    processedResponse = `原文标题: ${title}\n原文链接: ${url}\n\n${processedResponse}`;
  }

  // 如果原文链接不在正确的位置,尝试移动它
  const lines = processedResponse.split('\n');
  const linkIndex = lines.findIndex(line => line.startsWith('原文链接:'));
  if (linkIndex > 1) {
    const linkLine = lines.splice(linkIndex, 1)[0];
    lines.splice(1, 0, linkLine);
    processedResponse = lines.join('\n');
  }

  return processedResponse;
}

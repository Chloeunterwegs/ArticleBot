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
    
    // 直接返回 Ollama 的响应,不进行额外的验证或处理
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
 * @param {string} title - 页面标题
 * @returns {string} 生成的 prompt
 */
function generatePrompt(content, url, title) {
  const cleanContent = removeHeaderFooter(content);
  
  return `${cleanContent}

请根据以上内容，严格按照下面的格式用中文回答。请确保回答完整，不要省略任何部分，并且内容必须与原文相符：

原文标题: ${title}
文章链接: ${url}

文章标题：[填写文章标题]
文章类型: [填写文章类型]

文章总结:
[300字左右的中文总结]

标签: 
1. [标签1：填写领域标签]
2. [标签2：填写行业标签]
3. [标签3：填写主题标签]

亮点内容:
1. [重点1：有价值的，附上原文案例]
2. [重点2：反直觉的，附上原文案例]
3. [重点3：有洞见的，附上原文案例]

主要涉及的人物、作品或概念:
1. [人物、作品或概念1]
2. [人物、作品或概念2]
3. [人物、作品或概念3]

文章可发散内容：
1. [可发散选题1：反常识的角度]
2. [可发散选题2：批判性思考的角度]
3. [可发散选题3：创作病毒式传播内容的角度]
4. [可发散选题4：科技与文化结合的角度]

请严格按照上述格式回答，确保包含所有部分，不要添加任何额外的解释或内容。请再次确认你的回答与原文内容相符。`;
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

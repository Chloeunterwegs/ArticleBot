// 监听来自background script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "processArticle") {
      // 当收到处理文章的请求时,执行以下操作
      processArticle();
    }
  });
  
  // 处理文章的主函数
  function processArticle() {
    // 获取文章内容
    const content = extractArticleContent();
    
    // 获取页面URL
    const url = window.location.href;
    
    // 获取文章标题
    const title = document.title;
  
    // 将提取的信息发送给background script
    chrome.runtime.sendMessage({
      action: "processComplete",
      content: content,
      url: url,
      title: title
    });
  }
  
  // 提取文章内容的函数
  function extractArticleContent() {
    // 这里需要实现文章内容提取的逻辑
    // 可以使用一些启发式方法或者第三方库来提取主要文章内容
    // 以下是一个简单的示例,仅供参考
    
    // 尝试查找文章主体元素
    const articleElement = document.querySelector('article') || 
                           document.querySelector('.post-content') || 
                           document.querySelector('.entry-content');
    
    if (articleElement) {
      // 如果找到了文章主体元素,返回其文本内容
      return articleElement.innerText;
    } else {
      // 如果没有找到特定的文章元素,返回整个body的文本内容
      // 这可能会包含一些无关内容,但总比没有内容好
      return document.body.innerText;
    }
  }
  
  // 可以在这里添加其他辅助函数,比如清理文本,移除广告等
  
  // 在页面加载完成后,可以进行一些初始化操作
  document.addEventListener('DOMContentLoaded', () => {
    console.log('智能文章助手已准备就绪');
    // 这里可以添加一些初始化代码,比如添加自定义样式或元素
  });
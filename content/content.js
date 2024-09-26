console.log('Content script is loaded and running');

function initContentScript() {
  console.log('Content script initialized');
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("收到消息:", request);
    if (request.action === "checkContentScriptReady") {
      console.log("Responding to checkContentScriptReady");
      sendResponse({ready: true});
    } else if (request.action === "processArticle") {
      console.log("Processing article");
      processArticle().then((result) => {
        console.log("Article processing completed", result);
        sendResponse({success: true, result: result});
      }).catch((error) => {
        console.error("Error processing article:", error);
        sendResponse({success: false, error: error.message});
      });
    } else if (request.action === "showError") {
      console.error("Error from background script:", request.error);
      // 在这里可以添加显示错误信息给用户的逻辑
    }
    return true; // 保持消息通道开放
  });
}

function extractPageContent() {
  console.log('开始提取页面内容');
  const article = document.querySelector('article') || document.body;
  const title = document.title;
  const url = window.location.href;
  const content = article.innerText;
  console.log('页面内容提取完成:', { title, url, contentLength: content.length });
  return { title, url, content };
}

function processArticle() {
  const pageContent = extractPageContent();
  // 这里可以添加更多的处理逻辑
  return Promise.resolve(pageContent);
}

// 立即初始化内容脚本
initContentScript();

// 通知background脚本内容脚本已加载
chrome.runtime.sendMessage({action: "contentScriptLoaded"});
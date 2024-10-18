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
  let url = window.location.href;
  
  // 尝试获取 canonical URL
  const canonicalLink = document.querySelector('link[rel="canonical"]');
  if (canonicalLink && canonicalLink.href) {
    url = canonicalLink.href;
  } else {
    // 尝试获取 Open Graph URL
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl && ogUrl.content) {
      url = ogUrl.content;
    } else {
      // 尝试获取 Twitter URL
      const twitterUrl = document.querySelector('meta[name="twitter:url"]');
      if (twitterUrl && twitterUrl.content) {
        url = twitterUrl.content;
      } else {
        // 尝试获取移动版 URL
        const mobileUrl = document.querySelector('meta[http-equiv="mobile-agent"]');
        if (mobileUrl && mobileUrl.content) {
          const match = mobileUrl.content.match(/url=(.*?)$/);
          if (match && match[1]) {
            url = match[1];
          }
        }
      }
    }
  }
  
  // 确保 URL 是有效的
  try {
    url = new URL(url, window.location.origin).href;
  } catch (error) {
    console.error('无效的 URL:', url);
    url = window.location.href;
  }

  console.log('最终提取的 URL:', url);
  
  const content = article.innerText;
  console.log('提取的页面内容:', content); // 新增：输出提取的内容
  console.log('页面内容提取完成:', { title, url, contentLength: content.length });
  return { title, url, content };
}

function processArticle() {
  const { title, url, content } = extractPageContent();
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      action: "articleContent",
      content: content,
      title: title,
      url: url
    }, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        console.log('发送给后台的内容:', { title, url, contentLength: content.length }); // 新增：输出发送给后台的内容
        resolve(response);
      }
    });
  });
}

initContentScript();

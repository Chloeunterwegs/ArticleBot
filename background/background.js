// 动态加载 markmap 库
function loadMarkmapScript(callback) {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('lib/markmap.min.js');
  script.onload = callback;
  document.head.appendChild(script);
}

// 创建右键菜单
function createContextMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "openSettings",
      title: "打开设置",
      contexts: ["action"]
    });
  });
}

// 在扩展安装或更新时创建菜单
chrome.runtime.onInstalled.addListener(createContextMenu);

// 监听右键菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "openSettings") {
    // 打开设置页面
    chrome.runtime.openOptionsPage();
  }
});

// 监听扩展图标点击事件
chrome.action.onClicked.addListener((tab) => {
  // 向当前标签页发送消息,请求处理文章
  chrome.tabs.sendMessage(tab.id, { action: "processArticle" });
});

// 监听来自content script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "processComplete") {
    // 加载 markmap 库并调用处理函数
    loadMarkmapScript(() => {
      processArticle(request.content, request.url, request.title);
    });
  }
});

// 文章处理主函数
async function processArticle(content, url, title) {
  try {
    // 1. 调用本地大模型进行总结
    const summary = await callLocalModel(content, "summarize");

    // 2. 生成标签
    const tags = await callLocalModel(content, "generateTags");

    // 3. 生成Markmap
    const markmap = await generateMarkmap(summary);

    // 4. 创建MD文件
    const mdContent = createMdContent(title, url, tags, markmap, summary);

    // 5. 同步到Obsidian
    await syncToObsidian(mdContent);

    // 处理成功,可以在这里添加一些反馈,比如显示一个通知
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon.svg",
      title: "处理完成",
      message: "文章已成功处理并同步到Obsidian"
    });
  } catch (error) {
    console.error("处理文章时出错:", error);
    // 处理错误,可以显示一个错误通知
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon.svg",
      title: "处理失败",
      message: "文章处理过程中出现错误,请检查设置和日志"
    });
  }
}
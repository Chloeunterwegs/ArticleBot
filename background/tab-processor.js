import { injectContentScript } from './background.js';

let processingTabs = false;
let tabQueue = [];
let isMultipleTabsProcessing = false;

export function startTabProcessing(tabs) {
  if (processingTabs) {
    console.log('标签页处理已在进行中');
    return;
  }

  tabQueue = tabs.filter(tab => {
    return tab && tab.url && (tab.url.startsWith('http') || tab.url.startsWith('https')) && !tab.url.includes('chrome://') && !tab.url.includes('chrome-extension://');
  });

  if (tabQueue.length > 0) {
    processingTabs = true;
    isMultipleTabsProcessing = tabQueue.length > 1;
    processNextTab();
  } else {
    console.log('没有可处理的标签页');
  }
}

function processNextTab() {
  if (tabQueue.length === 0) {
    processingTabs = false;
    isMultipleTabsProcessing = false;
    console.log('所有标签页处理完毕');
    return;
  }

  const currentTab = tabQueue.shift();
  console.log(`开始处理标签页: ${currentTab.url}`);
  
  injectContentScript(currentTab.id);
}

export function onTabProcessed(tabId) {
  console.log(`标签页 ${tabId} 处理完毕`);
  if (isMultipleTabsProcessing) {
    chrome.tabs.remove(tabId, () => {
      console.log(`标签页 ${tabId} 已关闭`);
      setTimeout(processNextTab, 1000); // 等待1秒后处理下一个标签页
    });
  } else {
    processNextTab();
  }
}

export function stopTabProcessing() {
  processingTabs = false;
  isMultipleTabsProcessing = false;
  tabQueue = [];
  console.log('标签页处理已停止');
}

export function isProcessingMultipleTabs() {
  return isMultipleTabsProcessing;
}

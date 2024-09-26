class ObsidianSync {
  static async syncNote(content) {
    console.log("开始同步到Obsidian");
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(['obsidianPath'], function(result) {
        const obsidianPath = result.obsidianPath;
        console.log("Obsidian路径:", obsidianPath);
        if (!obsidianPath) {
          console.error("Obsidian路径未设置");
          reject(new Error('Obsidian path not set'));
          return;
        }

        chrome.runtime.sendNativeMessage(
          'obsidian_sync',
          { action: 'syncNote', content, path: obsidianPath },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("Native messaging错误:", chrome.runtime.lastError);
              reject(chrome.runtime.lastError);
            } else {
              console.log("同步成功,响应:", response);
              resolve(response);
            }
          }
        );
      });
    });
  }
}

export default ObsidianSync;
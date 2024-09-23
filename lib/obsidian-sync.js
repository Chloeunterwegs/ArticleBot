const ObsidianSync = {
    syncNote: async function(content) {
      return new Promise((resolve, reject) => {
        chrome.runtime.sendNativeMessage(
          'obsidian_sync',
          { action: 'syncNote', content },
          (response) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve(response);
            }
          }
        );
      });
    }
  };
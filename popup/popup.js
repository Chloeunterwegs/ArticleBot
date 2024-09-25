document.addEventListener('DOMContentLoaded', function() {
    const settingsForm = document.getElementById('settingsForm');
    const statusMessage = document.getElementById('statusMessage');
    const modelNameSelect = document.getElementById('modelName');
    const obsidianPathInput = document.getElementById('obsidianPath');

    // 加载保存的设置
    chrome.storage.sync.get(['modelName', 'obsidianPath'], function(result) {
        modelNameSelect.value = result.modelName || 'qwen2:7b';
        obsidianPathInput.value = result.obsidianPath || '';
    });

    settingsForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const modelName = modelNameSelect.value;
        const obsidianPath = obsidianPathInput.value.trim();

        if (!modelName || !obsidianPath) {
            showStatus('请填写所有必填字段', 'error');
            return;
        }

        chrome.storage.sync.set({
            modelName: modelName,
            obsidianPath: obsidianPath
        }, function() {
            if (chrome.runtime.lastError) {
                showStatus('保存设置时出错: ' + chrome.runtime.lastError.message, 'error');
            } else {
                showStatus('设置已保存', 'success');
            }
        });
    });

    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = 'status-message ' + type;
    }
});
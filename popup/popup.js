// 等待 DOM 内容加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 获取表单和状态消息元素
    const settingsForm = document.getElementById('settingsForm');
    const statusMessage = document.getElementById('statusMessage');
    const localModelPathInput = document.getElementById('localModelPath');
    const obsidianPathInput = document.getElementById('obsidianPath');

    // 从 Chrome 存储中加载保存的设置
    chrome.storage.sync.get(['localModelPath', 'obsidianPath'], function(result) {
        localModelPathInput.value = result.localModelPath || '';
        obsidianPathInput.value = result.obsidianPath || '';
    });

    // 监听表单提交事件
    settingsForm.addEventListener('submit', function(e) {
        e.preventDefault(); // 阻止表单的默认提交行为

        // 获取输入的值
        const localModelPath = localModelPathInput.value.trim();
        const obsidianPath = obsidianPathInput.value.trim();

        // 验证输入
        if (!localModelPath || !obsidianPath) {
            showStatus('请填写所有必填字段', 'error');
            return;
        }

        // 保存设置到 Chrome 存储
        chrome.storage.sync.set({
            localModelPath: localModelPath,
            obsidianPath: obsidianPath
        }, function() {
            // 检查是否有错误发生
            if (chrome.runtime.lastError) {
                showStatus('保存设置时出错: ' + chrome.runtime.lastError.message, 'error');
            } else {
                showStatus('设置已保存', 'success');
            }
        });
    });

    // 显示状态消息的函数
    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = 'status-message ' + type;
        // 3秒后清除消息
        setTimeout(() => {
            statusMessage.textContent = '';
            statusMessage.className = 'status-message';
        }, 3000);
    }
});
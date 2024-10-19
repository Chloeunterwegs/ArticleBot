# 智能文章助手

一键完成对网页文章内容总结、标签生成，并同步到 Obsidian的浏览器插件。

## 最新更新

1. 优化了多标签页处理功能,现在只处理当前窗口的标签页。
2. 改进了用户界面,更新了快捷键说明。
3. 增强了错误处理和日志记录,提高了扩展的稳定性。
4. 优化了 WebSocket 通信,提高了与代理服务器的连接可靠性。
5. 改进了文件名生成逻辑,确保生成的文件名有效且唯一。
6. 更新了快捷键,避免与常用操作冲突。

## 功能

1. 使用本地大语言模型智能总结文章
2. 自动生成分类标签和亮点内容
3. 一键同步到 Obsidian
4. 支持多种模型选择
5. 自定义 Obsidian 存储路径
6. 支持处理当前窗口的所有标签页

## 安装

1. 克隆仓库到本地
2. 安装并运行 Ollama (`ollama serve`)
3. 在 `ollama-proxy` 目录运行 `npm install` 和 `node proxy-server.js`
4. 在 Chrome 扩展管理页面加载解压的扩展程序

## 使用方法

1. 确保 Ollama 和代理服务器运行中
2. 在目标文章页面点击扩展图标,处理当前标签页
3. 使用快捷键 Ctrl+Shift+Q (Mac: Command+Shift+Q) 处理当前窗口的所有标签页
4. 使用快捷键 Ctrl+Shift+W (Mac: Command+Shift+W) 停止处理标签页
5. 等待处理完成,结果自动同步到 Obsidian

## 配置

1. 安装并配置 Ollama,下载所需模型
2. 正确安装 Obsidian
3. 在扩展设置中配置模型和 Obsidian 路径

## 使用 ollama.bat 文件

为了简化 Ollama 和代理服务器的启动过程,我们提供了一个 `ollama.bat` 文件。使用方法如下:

1. 确保 `ollama.bat` 文件位于项目根目录。
2. 双击运行 `ollama.bat` 文件。
3. 这个批处理文件会自动执行以下操作:
   - 启动 Ollama 服务
   - 启动 WebSocket 代理服务器
   - 在控制台显示启动状态信息

注意: 使用 `ollama.bat` 文件前,请确保已经正确安装了 Ollama 和所有必要的依赖。

## 注意事项

1. 通信: 扩展通过 WebSocket 与本地代理服务器通信
2. 代理服务器: 运行 `node proxy-server.js`
3. 依赖: 在 `ollama-proxy` 目录运行 `npm install`
4. Ollama 运行顺序:
   - 运行 `ollama serve`
   - 启动 WebSocket 代理服务器
   - 加载浏览器扩展
5. 内容脚本: 扩展会自动尝试注入
6. 错误处理: 增强了日志记录,便于调试
7. 权限: 扩展需要 "scripting" 权限
8. 兼容性: 确保 Chrome 支持 Manifest V3
9. 健康检查: 代理服务器会定期检查Ollama服务的健康状态
10. 消息格式: 确保发送给代理服务器的消息格式正确
11. 响应处理: 代理服务器直接使用 Ollama 的原始响应
12. 参数传递: 确保在处理文章内容时正确传递所有必要参数
13. 文章标题: 内容脚本会提取并传递文章标题，用于 Obsidian 文件命名
14. URL 提取: 支持多种 URL 格式,包括 canonical, Open Graph, Twitter 和移动版 URL
15. 多标签页处理: 只处理当前窗口的标签页

## 开发

- 使用 vanilla JavaScript
- 主要文件: manifest.json, popup/, background/, content/, lib/, ollama-proxy/
- 需要了解 Chrome 扩展开发、JavaScript、WebSocket 和 Ollama API

## 测试

1. 确保 Ollama 和默认模型运行中
2. 启动代理服务器
3. 在不同类型网页上测试
4. 验证内容提取、摘要生成和同步功能
5. 测试设置页面和模型选择功能
6. 模拟错误情况和网络中断
7. 测试多标签页处理功能

## 贡献

欢迎提交 Issue 和 Pull Request。

## 许可证

MIT 许可证

## 联系方式

- 邮箱: <unterwegshe@gmail.com>
- GitHub Issues: [提交 Issue](https://github.com/yourusername/smart-article-assistant/issues)

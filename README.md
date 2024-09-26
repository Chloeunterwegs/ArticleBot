# 智能文章助手

自动化处理文章的浏览器扩展,一键完成总结、标签生成、思维导图创建,并同步到 Obsidian。

## 功能

1. 使用本地大语言模型智能总结文章
2. 自动生成分类标签
3. 创建可视化思维导图
4. 整合为 Markdown 文件
5. 一键同步到 Obsidian

## 安装

1. 克隆仓库到本地
2. 安装并运行 Ollama (`ollama serve`)
3. 在 `ollama-proxy` 目录运行 `npm install` 和 `npm start`
4. 在 Chrome 扩展管理页面加载解压的扩展程序

## 使用方法

1. 确保 Ollama 和代理服务器运行中
2. 在目标文章页面点击扩展图标
3. 等待处理完成,结果自动同步到 Obsidian
4. 右键点击图标可打开设置页面

## 配置

1. 安装并配置 Ollama,下载所需模型
2. 正确安装 Obsidian
3. 在扩展设置中配置模型和 Obsidian 路径

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
11. 响应处理: 代理服务器现在能更好地处理Ollama服务的响应
12. 参数传递: 确保在处理文章内容时正确传递 `obsidianPath` 和 `title` 参数
13. 文章标题: 内容脚本现在会提取并传递文章标题，用于 Obsidian 文件命名
14. 错误处理: 增强了错误处理和日志记录，便于调试 Obsidian 同步问题

## 开发

- 使用 vanilla JavaScript
- 主要文件: manifest.json, popup/, background/, content/, lib/, ollama-proxy/
- 需要了解 Chrome 扩展开发、JavaScript、WebSocket 和 Ollama API

## 测试

1. 确保 Ollama 和默认模型运行中
2. 启动代理服务器
3. 在不同类型网页上测试
4. 验证内容提取、摘要生成和同步功能
5. 测试设置页面
6. 模拟错误情况

## 贡献

欢迎提交 Issue 和 Pull Request。

## 文档规范

本项目的所有文档都遵循 [DOCUMENTATION_GUIDELINES.md](./DOCUMENTATION_GUIDELINES.md) 中定义的格式规则。请在创建或编辑文档时参考这些指南。

## 许可证

MIT 许可证

## 联系方式

- 邮箱: <unterwegshe@gmail.com>
- GitHub Issues: [提交 Issue](https://github.com/yourusername/smart-article-assistant/issues)

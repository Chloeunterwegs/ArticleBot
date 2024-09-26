# 更新日志

## [0.0.11] - 2024-09-27

### 修复 011

- 解决了 Obsidian 同步功能无响应的问题
- 修复了 `background.js` 中 `sendToOllama` 函数参数传递不正确的问题
- 更新了 `content.js` 中 `processArticle` 函数，正确传递文章标题

### 更改 011

- 优化了 `background.js` 中的消息处理逻辑
- 改进了 `content-processor.js` 中的参数处理

### 新增 011

- 在 `content.js` 中添加了文章标题的提取和传递功能

## [0.0.10] - 2024-09-26

### 新增 010

- 实现了使用 Ollama 服务处理文章内容的功能
- 添加了生成文章总结、标签和 Markmap MD 文档的功能

### 更改 010

- 优化了 `content-processor.js` 中的 prompt 生成逻辑
- 改进了 `background.js` 中的消息处理逻辑

### 修复 010

- 解决了 WebSocket 连接和消息处理的稳定性问题

## [0.0.9] - 2024-09-26

### 修复 009

- 解决了Ollama服务响应处理错误
- 修复了健康检查失败的问题

### 更改 009

- 优化了代理服务器中的消息处理逻辑
- 更新了健康检查逻辑,使用可用的API端点

### 新增 009

- 在代理服务器中添加了更严格的消息格式验证
- 增加了详细的错误日志记录

## [0.0.8] - 2024-09-26

### 新增 008

- 实现WebSocket心跳机制和状态监控
- 在background.js中添加定期发送心跳消息的功能
- 在proxy-server.js中添加对心跳消息的处理

### 更改 008

- 优化WebSocket连接管理,增加自动重连逻辑
- 更新错误处理文档,增加新的错误类型和解决方法

### 修复 008

- 改进WebSocket连接稳定性

## [0.0.7] - 2024-09-26

### 新增 007

- 在ERROR_HANDLING.md中添加WebSocket消息响应超时的错误处理说明
- 在README.md中增加关于响应超时和日志记录的注意事项

### 更改 007

- 优化background.js和proxy-server.js中的日志记录,以便更好地追踪消息流程
- 更新错误处理文档,增加新的错误类型和解决方法

### 修复 007

- 改进WebSocket消息处理机制,增加超时处理和重试逻辑

## [0.0.6] - 2024-09-26

### 修复 006

- 解决 "Could not establish connection. Receiving end does not exist." 错误
- 改进内容脚本和后台脚本间的通信机制

### 更改 006

- 至内容脚本加载后执行
- 优化错误处理和日志记录

## [0.0.5] - 2024-09-26

### 修复 005

- 修复 "Cannot read properties of undefined (reading 'executeScript')" 错误
- 改进内容脚本注入机制

### 更改 005

- 更新 manifest.json,添加 "scripting" 权限
- 优化 background.js 中的错误处理逻辑

## [0.0.4] - 2024-09-26

### 修复 004

- 修复扩展加载后立即出现的连接错误
- 改进内容脚本的加载和通信机制
- 添加自动注入内容脚本功能

### 更改 004

- 更新 background.js 中的错误处理逻辑
- 优化 content.js 中的消息监听器

## [0.0.3] - 2024-09-26

### 新增 003

- WebSocket 通信功能
- 代理服务器 (proxy-server.js) 实现
- background.js 中添加 WebSocket 连接和通信逻辑
- 测试 Ollama 服务功能

### 更改 003

- 更新 README.md,增加 WebSocket 和代理服务器说明
- 修改 manifest.json,添加 WebSocket 通信所需权限
- 优化错误处理和日志记录

### 修复 003

- 修复 WebSocket 连接断开时的重连逻辑

## [0.0.2] - 2024-09-25

### 新增 002

- 与本地大语言模型 Ollama 的集成
- ollama_wrapper.py 脚本
- lib/obsidian-sync.js 实现 Obsidian 同步功能
- 动态加载 markmap 库功能
- 右键菜单功能,用于打开设置页面

### 更改 002

- 更新 README.md,增加 Ollama 相关说明
- 优化 popup 页面,增加模型选择功能
- 调整 background.js 中的错误处理和通知机制

# 错误处理记录

本文档记录了智能文章助手扩展中可能遇到的常见错误及其处理方法。

## 错误记录格式

每个错误记录应遵循以下格式:

问题：[简要描述问题]
可能原因：

1. [原因1]
2. [原因2]
3. [原因3]
...

尝试1：[描述尝试的解决方案]
状态：[尝试成功/尝试失败/待验证]

尝试2：[描述尝试的解决方案]
状态：[尝试成功/尝试失败/待验证]

尝试3：[描述尝试的解决方案]
状态：[尝试成功/尝试失败/待验证]

这种格式有助于追踪问题解决的进展,提高解决问题的效率。

## 错误列表

## 1. WebSocket 连接错误

错误信息:
```WebSocket connection to 'ws://localhost:3000/' failed```

可能原因和解决方法:

- 代理服务器未运行
  - 确保在`ollama-proxy`目录下运行了`npm start`或`node proxy-server.js`
- 端口被占用或被防火墙阻止
  - 检查3000端口是否被其他程序占用,如果是,可以在`proxy-server.js`中修改端口号
  - 检查防火墙设置,确保允许WebSocket连接

## 2. Ollama 服务错误

错误信息:
```Failed to fetch```
或
```HTTP 错误! 状态: 404```

可能原因和解决方法:

- Ollama服务未运行或API地址配置错误
  - 确保运行了`ollama serve`命令启动Ollama服务
  - 检查`proxy-server.js`中的Ollama API地址是否正确(默认应为`http://localhost:11434/api/chat`)

## 3. 内容脚本通信错误

错误信息:
```Could not establish connection. Receiving end does not exist.```

可能原因和解决方法:

- 内容脚本未正确加载或注册,或在不适当的时机尝试通信
  - 检查`manifest.json`中的content_scripts配置是否正确
  - 在`background.js`中,确保在发送消息前检查标签页和内容脚本的就绪状态
  - 使用`chrome.tabs.executeScript`确保内容脚本被注入

尝试4：检查并修正content.js文件路径
状态：待验证

## 4. 权限错误

错误信息:
```Cannot read properties of undefined (reading 'executeScript')```

可能原因和解决方法:

- manifest.json中缺少必要的权限声明
  - 在`manifest.json`的permissions数组中添加"scripting"权限
  - 确保使用的是Manifest V3,因为chrome.scripting API只在Manifest V3中可用

## 5. WebSocket 消息响应问题

问题：WebSocket 连接已建立,但没有收到 Ollama 服务的响应

可能原因：

1. 内容脚本未正确加载或初始化
2. 代理服务器未正确处理或转发 Ollama 服务的响应
3. Ollama 服务未正确响应或响应格式不符合预期
4. WebSocket 消息处理逻辑存在问题
5. Ollama 服务处理请求时间过长
6. 代理服务器和 Ollama 服务之间的通信问题
7. WebSocket 连接状态不稳定
8. 代理服务器未能正确处理并返回 Ollama 服务的响应

尝试1：在 content.js 中添加就绪状态检查
状态：已验证,但未解决问题

尝试2：改进代理服务器的错误处理和响应机制
状态：已验证,但未解决问题

尝试3：在 background.js 中添加超时处理
状态：已验证,但未解决问题

尝试4：增加 WebSocket 超时时间并添加重试机制
状态：已验证,但未解决问题

尝试5：在代理服务器中添加详细日志
状态：已验证,但未解决问题

尝试6：检查代理服务器和 Ollama 服务之间的通信
状态：已验证,但未解决问题

尝试7：优化内容处理,减少发送到WebSocket的数据量
状态：已验证,但未解决问题

尝试8：实现 WebSocket 心跳机制和状态监控
状态：已验证,但未解决问题

## 7. Ollama 服务响应处理错误

问题：代理服务器返回错误 "Cannot read properties of undefined (reading 'length')"

可能原因：

1. 代理服务器中处理WebSocket消息的逻辑有误
2. 客户端发送的消息格式不正确
3. 代理服务器在解析消息时出现问题

尝试1：检查并修复代理服务器中的消息处理逻辑
状态：已验证,问题解决

尝试2：在代理服务器中添加更严格的消息格式验证
状态：已验证,问题解决

## 8. Ollama 服务健康检查失败

问题：Ollama 服务健康检查返回 404 错误

可能原因：

1. Ollama 服务的健康检查端点 URL 可能不正确
2. Ollama 服务未提供 /api/health 端点

尝试1：检查 Ollama 服务的运行状态和配置
状态：已验证，排除原因

尝试2：验证 Ollama 服务的健康检查端点 URL
状态：已验证，确认问题

尝试3：检查网络连接和防火墙设置
状态：已验证，排除原因

尝试4：修改健康检查逻辑，使用其他可用的 API 端点
状态：已验证,问题解决


## 8. 调试技巧

1. 使用Chrome开发者工具的Console面板查看日志输出
2. 在background.js和content.js中添加详细的日志记录
3. 使用Chrome的扩展管理页面(chrome://extensions)重新加载扩展以应用更改
4. 检查Background页面的控制台输出,可以在扩展管理页面中找到"检查视图 背景页"

如果遇到未在此文档中列出的错误,请按照上述格式记录错误详情并联系开发团队。

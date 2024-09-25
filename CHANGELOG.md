# 更新日志

所有关于智能文章助手的显著变更都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [0.0.2] - 2024-09-25

### 新增

- 与本地大语言模型 Ollama 的集成
- ollama_wrapper.py 脚本用于与 Ollama 通信
- lib/obsidian-sync.js 实现 Obsidian 同步功能
- 动态加载 markmap 库的功能
- 右键菜单功能,用于打开设置页面

### 更改

- 更新了 README.md,增加了 Ollama 相关说明
- 优化了 popup 页面,增加了模型选择功能
- 调整了 background.js 中的错误处理和通知机制

### 修复

- 修复了 manifest.json 中的权限设置

## [0.0.1] - 2024-09-23

### 新增内容

- 初始项目设置
- manifest.json 文件配置
- background.js 实现基本功能
- content.js 实现文章内容提取
- popup 页面用于设置
- README.md 文件创建
- 基本目录结构建立

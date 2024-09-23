# 智能文章助手

智能文章助手是一个自动化处理文章的浏览器扩展，能够一键完成文章总结、标签生成、思维导图创建，并将结果同步到 Obsidian 中。

## 功能特点

- 使用本地大语言模型对当前页面文章进行智能总结
- 自动为文章生成分类标签
- 基于文章总结生成可视化的思维导图
- 将文章链接、标签、总结内容和思维导图整合成 Markdown 文件
- 一键同步Markdown文件到 Obsidian 笔记软件

## 安装说明

1. 克隆或下载此仓库到本地
2. 打开 Chrome 浏览器，进入扩展管理页面 (chrome://extensions/)
3. 启用"开发者模式"
4. 点击"加载已解压的扩展程序"，选择本项目的目录

## 使用方法

1. 在想要处理的文章页面，点击浏览器工具栏中的插件图标
2. 等待处理完成，结果将自动同步到你的 Obsidian 笔记中
3. 右键点击插件图标可以打开设置页面，配置本地模型路径和 Obsidian 路径

## 配置说明

本插件需要配合本地大语言模型和 Obsidian 使用。请确保：

1. 已安装并配置好本地大语言模型
2. Obsidian 已正确安装并设置
3. 在插件的设置页面中正确配置本地模型和 Obsidian 的路径

## 开发说明

本项目使用 vanilla JavaScript 开发，主要文件结构如下：

- `manifest.json`: 插件配置文件
- `popup/`: 包含设置页面相关文件
- `background/`: 包含后台脚本
- `content/`: 包含内容脚本
- `lib/`: 包含第三方库文件

要进行开发，你需要：

1. 了解 Chrome 扩展开发基础
2. 熟悉 JavaScript 编程
3. 了解如何与本地应用程序通信（用于大语言模型和 Obsidian 同步）

## 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个项目。在提交 PR 之前，请确保你的代码符合我们的编码规范并通过了所有测试。

## 许可证

本项目采用 MIT 许可证。详情请见 [LICENSE](LICENSE) 文件。

## 联系方式

如有任何问题或建议，欢迎通过以下方式联系我们：

- 邮箱: <unterwegshe@gmail.com>
- GitHub Issues: [提交 Issue](https://github.com/yourusername/smart-article-assistant/issues)

感谢使用智能文章助手！

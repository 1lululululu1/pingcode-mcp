# PingCode MCP Server

[![npm version](https://badge.fury.io/js/pingcode-mcp.svg)](https://www.npmjs.com/package/pingcode-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

PingCode MCP (Model Context Protocol) 服务器,让 AI 助手能够与 PingCode 项目管理系统交互,支持查询工作项、发布版本管理、更新状态和缺陷字段等操作。

## ✨ 功能特性

- 🔐 **便捷登录** - 支持浏览器登录和飞书等第三方登录
- 🔍 **工作项查询** - 通过编号快速查看工作项详情
- 📋 **发布管理** - 查询发布版本关联的缺陷和需求
- 🔎 **全文搜索** - 搜索项目中的工作项
- 📊 **版本列表** - 列出项目的所有发布版本
- ✏️ **状态更新** - 更新工作项的状态
- 🐛 **缺陷管理** - 更新缺陷的原因分析、解决方案和解决方法

## 📦 安装

### 方式一：全局安装（推荐）

```bash
npm install -g pingcode-mcp
```

安装后需要安装 Chromium 浏览器（用于登录）:

```bash
npx playwright install chromium
```

### 方式二：使用 npx（无需安装）

```bash
npx pingcode-mcp
```

首次使用会自动下载依赖。

## 🚀 快速开始

### 1. 配置 MCP 客户端

在你的 MCP 客户端（如 Windsurf、Cursor、Claude Desktop）配置文件中添加：

#### **全局安装后的配置**

编辑 `~/.cursor/mcp.json` 或 `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "pingcode-mcp": {
      "command": "pingcode-mcp",
      "env": {
        "PINGCODE_DOMAIN": "your-company.pingcode.com"
      }
    }
  }
}
```

#### **使用 npx 的配置**

```json
{
  "mcpServers": {
    "pingcode-mcp": {
      "command": "npx",
      "args": ["-y", "pingcode-mcp"],
      "env": {
        "PINGCODE_DOMAIN": "your-company.pingcode.com"
      }
    }
  }
}
```

> **注意**: 如果不配置 `PINGCODE_DOMAIN`，默认使用 `neuralgalaxy.pingcode.com`。

### 2. 首次登录

重启 MCP 客户端后，让 AI 助手调用 `login` 工具:

```
请帮我登录 PingCode
```

会自动打开浏览器，完成授权后凭证会保存在 `~/.pingcode-mcp/credentials.json`。

### 3. 开始使用

```
查看工作项 LFY-2527 的详情
```

```
列出优点云项目的所有发布版本
```

```
查询发布版本 QxednuAG 的所有缺陷
```

## 🛠️ 可用工具

| 工具名称                 | 说明                       | 参数                                                                         |
| ------------------------ | -------------------------- | ---------------------------------------------------------------------------- |
| `login`                  | 打开浏览器进行登录         | 无                                                                           |
| `logout`                 | 退出登录，清除凭证         | 无                                                                           |
| `check_auth`             | 检查登录状态               | 无                                                                           |
| `get_work_item`          | 获取工作项详情             | `identifier`: 工作项编号（如 LFY-123）                                       |
| `list_projects`          | 列出所有可访问项目         | 无                                                                           |
| `list_releases`          | 列出项目的发布版本         | `project_id`: 项目标识（如 LFY）                                             |
| `get_release_items`      | 获取版本关联的工作项       | `release_id`: 版本ID<br>`project_id`: 项目标识<br>`item_type`: bug/story/all |
| `search_work_items`      | 搜索工作项                 | `query`: 搜索关键词<br>`project_id`: 项目标识（可选）                        |
| `get_selectable_states`  | 查询工作项可流转的状态     | `work_item_id`: 工作项编号                                                   |
| `update_work_item_state` | 更新工作项状态             | `work_item_id`: 工作项编号<br>`state_name`: 目标状态                         |
| `get_bug_field_options`  | 获取缺陷字段可选值         | `work_item_id`: 缺陷工作项编号                                               |
| `update_bug_fields`      | 更新缺陷的分析和解决方案   | `work_item_id`: 工作项编号<br>`reason`: 原因分析（可选）<br>`solution`: 解决方案（可选）<br>`jiejuefangfa`: 解决方法（可选） |
| `update_work_item_properties` | 批量更新工作项基本信息字段 | `work_item_id`: 工作项编号<br>`properties`: `[{key, value}]` 字段列表 |
| `get_work_item_properties` | 查询工作项基本信息字段值 | `work_item_id`: 工作项编号 |
| `update_work_item_assignee` | 变更工作项负责人 | `work_item_id`: 工作项编号<br>`assignee`: 成员姓名或 uid |

## 💡 使用示例

### 查看工作项详情

```
查看 LFY-2527 的详情
```

### 查询发布版本的缺陷

从发布页面 URL 获取参数：

```
https://yourcompany.pingcode.com/pjm/projects/LFY/releases/QxednuAG/workitems
                                                    ↑              ↑
                                              project_id      release_id
```

然后询问 AI:

```
查询项目 LFY 的发布版本 QxednuAG 中的所有缺陷
```

### 搜索工作项

```
在优点云项目中搜索包含"登录"的工作项
```

### 更新工作项状态

```
把 LFY-2527 的状态改为已完成
```

### 更新缺陷分析字段

```
帮我更新 LFY-2527 的原因分析和解决方案
```

## 🔧 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `PINGCODE_DOMAIN` | PingCode 域名 | `neuralgalaxy.pingcode.com` |

## 🔨 本地开发

如果你想修改源码或为项目贡献代码：

```bash
# 克隆仓库
git clone https://github.com/ratatatat1/pingcode-mcp.git
cd pingcode-mcp

# 安装依赖
npm install

# 安装浏览器
npx playwright install chromium

# 开发模式（实时编译）
npm run dev

# 构建
npm run build

# 测试构建产物
npm start
```

### 在 MCP 客户端中使用本地开发版本

```json
{
  "mcpServers": {
    "pingcode-mcp": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/pingcode-mcp/src/index.ts"]
    }
  }
}
```

## 📂 项目结构

```
pingcode-mcp/
├── src/
│   ├── index.ts              # MCP 服务器入口
│   ├── api/
│   │   └── pingcode-client.ts # PingCode API 客户端
│   ├── tools/
│   │   ├── login.ts          # 登录相关工具
│   │   └── work-items.ts     # 工作项相关工具
│   ├── types/
│   │   └── pingcode.ts       # TypeScript 类型定义
│   └── utils/
│       └── credentials.ts    # 凭证管理工具
├── dist/                     # 编译输出目录
├── package.json
├── tsconfig.json
└── README.md
```

## 🔒 隐私与安全

- 登录凭证仅保存在本地 `~/.pingcode-mcp/credentials.json`
- 不会上传任何数据到第三方服务器
- 所有 API 请求直接发送到你的 PingCode 实例

## ❓ 常见问题

**Q: 凭证过期了怎么办？**
A: 重新调用 `login` 工具即可。

**Q: 支持哪些 MCP 客户端？**
A: 支持所有实现了 MCP 协议的客户端，包括 Windsurf、Cursor、Claude Desktop 等。

**Q: 可以在 CI/CD 中使用吗？**
A: 登录需要浏览器交互，不适合 CI/CD 环境。如需自动化，建议使用 PingCode API。

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**作者**: ratat
**关键词**: mcp, pingcode, model-context-protocol, ai, release, bug-tracking, project-management

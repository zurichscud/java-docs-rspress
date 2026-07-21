# Claude.md

CLAUDE.md 是一个放在项目根目录的 Markdown 文件，Claude Code 在每次会话开始时都会自动读取。

````md
# 项目名称

## 项目概述
简述这个项目的目的和功能。

## 技术栈
- Frontend: React + TypeScript
- Backend: Node.js + Express
- Database: PostgreSQL

## 目录结构
- `src/components/` - React 组件
- `src/api/`        - API 层
- `tests/`          - 测试文件

## 常用命令
- 启动开发服务器：`pnpm dev`
- 运行测试：`pnpm test`
- 代码检查：`pnpm lint`

## 开发规范
- 使用 TypeScript strict 模式
- 优先使用 interface 而非 type
- 禁止使用 any，使用 unknown 替代
```

### 文件位置与层级

项目的核心文件结构如下： 
```
your-project/
├── CLAUDE.md                  # 项目主记忆文件（团队共享）
├── .claude/
│   ├── settings.json          # Hooks、权限、环境配置
│   ├── settings.local.json    # 个人配置（建议加入 .gitignore）
│   └── commands/              # 自定义斜杠命令
│       └── my-command.md
└── .mcp.json                  # MCP 服务配置
```
````


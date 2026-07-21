# MCP安装



## MCP transport(分类)

### 添加本地 stdio 服务器

Stdio 服务器作为您机器上的本地进程运行。它们非常适合需要直接系统访问或自定义脚本的工具。

```sh
# 基本语法
claude mcp add [options] <name> -- <command> [args...]

# 真实示例：添加 Airtable 服务器
claude mcp add --transport stdio --env AIRTABLE_API_KEY=YOUR_KEY airtable \
  -- npx -y airtable-mcp-server
```

:::tip  **选项顺序**

所有选项（`--transport`、`--env`、`--scope`、`--header`）必须在服务器名称**之前**。然后 `--`（双破折号）将服务器名称与传递给 MCP 服务器的命令和参数分开。

:::

### 添加远程 HTTP 服务器

HTTP 服务器是连接到远程 MCP 服务器的推荐选项。这是云服务最广泛支持的传输方式。

```sh
# 基本语法
claude mcp add --transport http <name> <url>

# 真实示例：连接到 Notion
claude mcp add --transport http notion https://mcp.notion.com/mcp

# 带有 Bearer 令牌的示例
claude mcp add --transport http secure-api https://api.example.com/mcp \
  --header "Authorization: Bearer your-token"
```

### 添加远程 SSE 服务器

::: danger

SSE (Server-Sent Events) 传输已弃用。请在可用的地方使用 HTTP 服务器。

:::

```sh
# 基本语法
claude mcp add --transport sse <name> <url>

# 真实示例：连接到 Asana
claude mcp add --transport sse asana https://mcp.asana.com/sse

# 带有身份验证标头的示例
claude mcp add --transport sse private-api https://api.company.com/sse \
  --header "X-API-Key: your-key-here"
```



## MCP scope

使用 `--scope` 标志指定配置的存储位置：

- `local`（默认）：仅在当前项目中对您可用
- `project`：MCP配置会存储在 `.mcp.json`， 可以与项目中的每个人共享
- `user`：在所有项目中对您可用

## MCP env

使用 `--env` 标志设置环境变量（例如，`--env KEY=value`）

## .mcp.json

在项目于根目录的 `.mcp.json` 中直接定义 MCP 服务器：

```json
{
  "mcpServers": {
    "shared-server": {
      "command": "/path/to/server",
      "args": [],
      "env": {}
    }
  }
}
```

## 管理MCP

```sh
# 列出所有配置的服务器
claude mcp list

# 获取特定服务器的详细信息
claude mcp get github

# 删除服务器
claude mcp remove github

# （在 Claude Code 中）检查服务器状态
/mcp
```


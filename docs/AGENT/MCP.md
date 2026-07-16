# MCP

MCP 通常指 **Model Context Protocol（模型上下文协议）**，是一个让 AI 模型连接外部工具、数据源和系统的开放协议。它最早由 Anthropic 推出，目标类似“AI 世界的 USB-C 接口”：统一 AI 和外部能力之间的连接方式。

## MCP Server 

本质就是一个“给 AI 调用的服务”。

### Stdio 模式

MCP Client 通过启动一个进程，然后通过标准输入(stdin)和标准输出(stdout)与 MCP Server 通信。它是 MCP 最常见的一种本地通信方式。

### HTTP模式

MCP 协议除了支持 Stdio，还原生支持 **SSE（Server-Sent Events，服务端推送事件）** 传输协议。

- 把 MCP 部署在远程服务器（例如腾讯云、阿里云或 AWS）上。

- 多个开发者在各自的 Cursor 中，通过 `http://your-server-ip:3000/sse` 连接到同一个 MCP 服务，共享公司内部的数据库、API 或工具。



##  MCP Client 配置

通过协议动态暴露给 AI。存在于 Cursor、Claude Desktop 这类 MCP Client 的配置文件中，用来找到 MCP Server。

```json
{
  "mcpServers": {
    "weather-helper": {
      "command": "uv",
      "args": [
        "run",
        "--with",
        "mcp[cli]",
        "weather_server.py"
      ],
      "env": {
        "WEATHER_API_KEY": "your_api_key_here",
        "CUSTOM_PATH": "/usr/local/bin"
      }
    }
  }
}
```



| **字段名**           | **类型** | **是否必填** | **作用与解释**                                               |
| -------------------- | -------- | ------------ | ------------------------------------------------------------ |
| **`weather-helper`** | `Key`    | **是**       | **服务唯一标识符**。这个名字会显示在 AI 客户端（如 Claude、Cursor）的工具列表里。建议使用英文、数字、中划线，避免特殊字符。 |
| **`command`**        | `String` | **是**       | **启动该服务的主执行程序**。例如 `node`、`python`、`uv`、`docker` 或可执行文件路径。客户端会在系统环境变量 `PATH` 中寻找该程序。 |
| **`args`**           | `Array`  | 否           | **传递给启动程序的参数列表**。每一个参数必须是独立的字符串，**不能**把多个参数写在同一个字符串里（例如，要写成 `["run", "main.py"]`，不能写成 `["run main.py"]`）。 |
| **`env`**            | `Object` | 否           | **注入到该服务进程中的环境变量**。非常适合用来存放 **API Key**、数据库连接串或调试开关（如 `MCP_LOG_LEVEL=debug`）。 |



### 场景 A：使用虚拟环境启动 Python MCP

```json
"my-python-mcp": {
  "command": "/Users/username/project/venv/bin/python", // 必须是绝对路径
  "args": [
    "/Users/username/project/server.py" // 脚本也必须是绝对路径
  ],
  "env": {
    "OPENAI_API_KEY": "sk-xxxx"
  }
}
```

### 场景 B：使用 Node.js 启动 JS MCP

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

Agent 会执行如下命令：

```
npx -y chrome-devtools-mcp@latest
```



## 以chrome-devtools 为例

### install

配置Agent客户端

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

::: warning 

需要确保已经安装了`chrome-devtools-mcp@latest`

:::



### check

在Agent中进行测试

```
Check the performance of https://developers.chrome.com
```




# QuickStart

| 目标                         | 先做这步                              | 再做这步                                 |
| ---------------------------- | ------------------------------------- | ---------------------------------------- |
| 只想让 Hermes 在本机跑起来   | `hermes setup`                        | 运行一次真实对话并验证有响应             |
| 已知道要用哪个 provider      | `hermes model`                        | 保存配置，然后开始聊天                   |
| 想搭建机器人或长期运行的服务 | CLI 正常后运行 `hermes gateway setup` | 接入 Telegram、Discord、Slack 或其他平台 |
| 想使用本地或自托管模型       | `hermes model` → 自定义 endpoint      | 验证 endpoint、模型名称和上下文长度      |
| 想要多 provider 故障转移     | 先运行 `hermes model`                 | 基础对话正常后再添加路由和故障转移       |

## 启动

```sh
hermes            # 经典 CLI
hermes --tui      # 现代 TUI（推荐）
```

TUI支持模态覆盖层、鼠标选择和非阻塞输入

- **阻塞输入**：程序停在那里等你输入

- **非阻塞输入**：程序继续运行，同时顺便检查你有没有输入

## 验证会话

```sh
hermes --continue    # 恢复最近的会话
hermes -c            # 简写形式
```



## 中断Agent

如果 agent 响应时间过长，输入新消息并按 Enter——这会中断当前任务并切换到你的新指令。`Ctrl+C` 同样有效。

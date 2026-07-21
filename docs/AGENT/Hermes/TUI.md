# TUI

TUI 是 Hermes 的现代前端——一个终端 UI（用户界面），与 [Classic CLI](https://hermes-agent.nousresearch.com/docs/zh-Hans/user-guide/cli) 共享同一 Python 运行时。相同的 agent、相同的会话、相同的斜杠命令；交互界面更简洁、响应更流畅。

这是以交互方式运行 Hermes 的推荐方式。

## 启动

```sh
# 启动 TUI
hermes --tui

# 恢复最近的 TUI 会话（若无则回退到最近的 classic 会话）
hermes --tui -c
hermes --tui --continue

# 通过 ID 或标题恢复指定会话
hermes --tui -r 20260409_000000_aa11bb
hermes --tui --resume "my t0p session"
```


# Sessions（会话）

Hermes Agent 自动将每次对话保存为一个 session。Session 支持对话恢复、跨 session 搜索以及完整的对话历史管理。

## 工作原理

每次对话——无论来自 CLI、Telegram、Discord、Slack、WhatsApp、Signal、Matrix、Teams 还是其他任何消息平台——都会以完整消息历史的形式存储为一个 session。Session 记录在**SQLite 数据库**

## 会话上下文

Hermes 存储 session 历史以便恢复对话，但不会在每次对话时重新发送所有历史字节。每轮对话中，模型看到的是：所选系统 prompt、当前对话窗口，以及 Hermes 为该轮显式注入的内容。

## Cli Session恢复

使用 `--continue` 或 `--resume` 从 CLI 恢复之前的对话：

### 继续上次 Session

```sh
# 恢复最近的 CLI session
hermes --continue
hermes -c

# 或使用 chat 子命令
hermes chat --continue
hermes chat -c
```

这会从 SQLite 数据库中查找最近的 `cli` session 并加载其完整对话历史。

### 按名称恢复

如果你已为 session 设置了标题（见下方[Session 命名](https://hermes-agent.nousresearch.com/docs/zh-Hans/user-guide/sessions#session-naming)），可以按名称恢复：

```bash
# 恢复一个命名 session
hermes -c "my project"

# 如果存在谱系变体（my project、my project #2、my project #3），
# 会自动恢复最新的一个
hermes -c "my project"   # → 恢复 "my project #3"
```

### 恢复特定 Session

```sh
# 按 ID 恢复特定 session
hermes --resume 20250305_091523_a1b2c3d4
hermes -r 20250305_091523_a1b2c3d4

# 按标题恢复
hermes --resume "refactoring auth"

# 或使用 chat 子命令
hermes chat --resume 20250305_091523_a1b2c3d4
```

Session ID 在退出 CLI session 时显示，也可通过 `hermes sessions list` 查找。

### 对话摘要

恢复 session 时，Hermes 会在输入提示符前以样式化面板显示之前对话的紧凑摘要：

## 跨平台切换

### Cli ->Platform

在 CLI session 中使用 `/handoff <platform>` 将实时对话转移到消息平台的主频道。Agent 会从 CLI 停止的地方精确接续——相同的 session id、完整的角色感知对话记录、工具调用一并保留

```
# 在 CLI session 内
/handoff telegram
```

执行过程：

1. CLI 验证 `<platform>` 已启用且已设置主频道（在目标聊天中运行一次 `/sethome` 即可配置）。

2. CLI 将 session 标记为待处理并**阻塞轮询 gateway**。如果 agent 正在处理轮次，则拒绝操作——请等待当前响应完成后再执行。

3. Gateway 监视器认领切换请求，并向目标适配器请求新线程：

   - **Telegram** — 开启新的论坛话题（如果在聊天中启用了 Bot API 9.4+ Topics 模式则为私信话题，或论坛超级群组话题）。
   - **Discord** — 在主文字频道下创建 1440 分钟自动归档的线程。
   - **Slack** — 发布一条种子消息并使用其 `ts` 作为线程锚点。
   - **WhatsApp / Signal / Matrix / SMS** — 无原生线程，回退到直接使用主频道。

4. Gateway 将目标键重新绑定到你现有的 CLI session id，然后伪造一个合成用户轮次，要求 agent 确认并总结。回复会出现在新线程中。

5. Gateway 确认成功后，CLI 打印 `/resume` 提示并干净退出：

   ```text
   ↻ Handoff complete. The session is now active on telegram.
     Resume it on this CLI later with: /resume my-session-title
   ```

   

6. 从此时起，对话在该平台上继续。在新线程中回复——该频道中任何已授权的用户共享同一 session，之后线程中任何真实用户消息都能无缝加入，因为线程 session 的键不含 `user_id`。

### Platform ->CLI

**恢复到 CLI：** 当你想回到桌面时，只需运行 `/resume <title>`（或在 shell 中运行 `hermes -r "<title>"`），从平台停止的地方继续。

## Session Title

### 自动设置标题

Hermes 在第一次一轮对话交互后自动为每个 session 生成简短的描述性标题（3–7 个词）。

自动命名每个 session 只触发一次，如果你已手动设置标题则跳过。

### 手动设置标题

在任何聊天 session（CLI 或 gateway）中使用 `/title` 斜杠命令：

```text
/title my research project
```

标题立即生效。如果 session 尚未在数据库中创建（例如在发送第一条消息之前运行 `/title`），则会排队等待 session 启动后应用。

也可以从命令行重命名现有 session：

```bash
hermes sessions rename 20250305_091523_a1b2c3d4 "refactoring auth module"
```

### 标题规则

- **唯一**——不能有两个 session 共享同一标题
- **最多 100 个字符**——保持列表输出整洁
- **净化处理**——控制字符、零宽字符和 RTL 覆盖字符会被自动去除
- **普通 Unicode 均可**——emoji、CJK 字符、带重音字符均支持

### 压缩时的自动谱系

当 session 的上下文被压缩（通过 `/compress` 手动或自动触发）时，Hermes 会创建一个新的续接 session。如果原 session 有标题，新 session 会自动获得带编号的标题：

```
"my project" → "my project #2" → "my project #3"
```

按名称恢复时（`hermes -c "my project"`），会自动选取谱系中最新的 session。

### 在消息平台中使用 /title

`/title` 命令在所有 gateway 平台（Telegram、Discord、Slack、WhatsApp）中均可使用：

- `/title My Research` — 设置 session 标题
- `/title` — 显示当前标题

## Session管理命令

Hermes 通过 `hermes sessions` 提供完整的 session 管理命令集：

### 列出 Session

```sh
# 列出最近的 session（默认：最近 20 个）
hermes sessions list

# 按平台过滤
hermes sessions list --source telegram

# 显示更多 session
hermes sessions list --limit 50
```

```
Title                  Preview                                  Last Active   ID
────────────────────────────────────────────────────────────────────────────────────────────────
refactoring auth       Help me refactor the auth module please   2h ago        20250305_091523_a
my project #3          Can you check the test failures?          yesterday     20250304_143022_e
—                      What's the weather in Las Vegas?          3d ago        20250303_101500_f
```


# Profiles：运行多个 Agent

在同一台机器上运行多个独立的 Hermes agent——每个 agent 拥有各自的配置、API 密钥、记忆、会话、技能和 gateway 状态。

## 什么是profile

profile 是一个独立的 Hermes 主目录。每个 profile 拥有自己的目录，其中包含各自的 `config.yaml`、`.env`、`SOUL.md`、记忆、会话、技能、cron 任务和状态数据库。profile 让你可以为不同用途运行独立的 agent——编程助手、个人机器人、研究 agent——而不会混淆 Hermes 状态。

创建 profile 后，它会自动成为独立的命令。创建名为 `coder` 的 profile，你立即就拥有了 `coder chat`、`coder setup`、`coder gateway start` 等命令。

## 快速开始

```sh
hermes profile create coder       # 创建 profile + "coder" 命令别名
coder setup                       # 配置 API 密钥和模型
coder chat                        # 开始对话
```

`coder` 现在是拥有独立配置、记忆和状态的 Hermes profile。

## 创建 profile

### 空白 profile

```bash
hermes profile create mybot
```



创建一个预置了内置技能的全新 profile。运行 `mybot setup` 配置 API 密钥、模型和 gateway token。

如果你计划将此 profile 用作 kanban（看板）工作节点（或希望 kanban 编排器将任务路由到它），在创建时传入 `--description "<角色>"` 以便编排器了解其能力：

```bash
hermes profile create researcher --description "Reads source code and external docs, writes findings."
```



你也可以稍后通过 `hermes profile describe` 设置或自动生成描述——完整路由模型请参阅 [Kanban 指南](https://hermes-agent.nousresearch.com/docs/zh-Hans/user-guide/features/kanban#auto-vs-manual-orchestration)。

### 仅克隆配置（`--clone`）

```bash
hermes profile create work --clone
```



将当前 profile 的 `config.yaml`、`.env` 和 `SOUL.md` 复制到新 profile。API 密钥和模型相同，但会话和记忆是全新的。编辑 `~/.hermes/profiles/work/.env` 可使用不同的 API 密钥，编辑 `~/.hermes/profiles/work/SOUL.md` 可设置不同的人格。

### 克隆全部内容（`--clone-all`）

```bash
hermes profile create backup --clone-all
```



复制**所有内容**——配置、API 密钥、人格、所有记忆、完整会话历史、技能、cron 任务、插件。完整快照。适用于备份或 fork 已有上下文的 agent。

### 从指定 profile 克隆

```bash
hermes profile create work --clone --clone-from coder
```

## 使用 profile

### 命令别名

每个 profile 在 `~/.local/bin/<name>` 自动获得一个命令别名：

```bash
coder chat                    # 与 coder agent 对话
coder setup                   # 配置 coder 的设置
coder gateway start           # 启动 coder 的 gateway
coder doctor                  # 检查 coder 的健康状态
coder skills list             # 列出 coder 的技能
coder config set model.default anthropic/claude-sonnet-4
```



别名支持所有 hermes 子命令——底层实际上是 `hermes -p <name>`。



管理 profile

```sh
hermes profile list           # 显示所有 profile 及其状态
hermes profile show coder     # 显示某个 profile 的详细信息
hermes profile rename coder dev-bot   # 重命名（同步更新别名和服务）
hermes profile export coder   # 导出为 coder.tar.gz
hermes profile import coder.tar.gz   # 从归档文件导入
hermes profile delete coder #删除
```



## 将 profile 作为发行版共享

你在一台机器上构建的 profile 可以打包为 **git 仓库**，并通过一条命令安装到另一台机器——你自己的工作站、团队成员的笔记本，或社区用户的环境。共享包包含 SOUL、配置、技能、cron 任务和 MCP 连接。凭据、记忆和会话保持各机器独立。

```sh
# 从 git 仓库安装完整 agent
hermes profile install github.com/you/research-bot --alias

# 当作者发布新版本时更新（保留你的记忆和 .env）
hermes profile update research-bot
```


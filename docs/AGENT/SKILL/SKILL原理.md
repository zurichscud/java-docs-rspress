# Skills 原理



## 1. 什么是 Skill

Skill 是给 Codex 增加“特定任务能力”的一种封装方式。一个 skill 可以包含：

- 指令
- 参考资料
- 可选脚本
- 可选资源文件

它的目标是让 Codex 在处理某类任务时，能够稳定遵循一套固定工作流。

Skill 更偏“能力定义”和“工作流设计”。

如果你想把 skill 作为可安装、可分发的包给别人使用，官方更推荐使用 plugin 作为分发单位。

## 2. Skill 的基本目录结构

一个 skill 本质上是一个目录，至少要有一个 `SKILL.md` 文件。

```text
my-skill/
├── SKILL.md
├── scripts/        # 可选，放可执行脚本
├── references/     # 可选，放文档资料
├── assets/         # 可选，放模板或资源
└── agents/
    └── openai.yaml # 可选，放 UI 元数据和依赖声明
```

`SKILL.md` 必须包含两项元数据：

```md
---
name: skill-name
description: 说明这个 skill 何时应触发、何时不应触发
---

这里写给 Codex 的技能说明。
```

## 3. Codex 怎么使用 Skill

Codex 使用 skill 有两种方式：

### 3.1 显式调用

你在提示词里直接点名 skill。
在 CLI / IDE 中，也可以用 `/skills` 或输入 `$` 来选择 skill。

### 3.2 隐式调用

如果你的任务和 skill 的 `description` 匹配，Codex 可以自己决定启用这个 skill。

因此 `description` 要尽量写清楚：

- 范围明确
- 触发条件明确
- 关键词靠前
- 同时说明“适用”和“不适用”的场景

## 4. Codex 如何加载 Skill

官方文档说明，Codex 不会在一开始把所有 skill 的完整内容全部塞进上下文。

它采用渐进式加载：

- 先只把 skill 的名称、描述、文件路径放进初始上下文
- 只有在决定使用某个 skill 时，才去读取这个 skill 的完整 `SKILL.md`

这样做是为了节省上下文长度。

另外，初始 skill 列表有预算限制。如果安装的 skill 太多：

- 会先压缩 description
- 再多的话，部分 skill 可能不会出现在初始列表中
- Codex 会给出警告

## 5. Skill 应该放在哪里

### 5.1 仓库级

Codex 会从当前工作目录开始，一路向上扫描到仓库根目录中的 `.agents/skills`。

例如：

- `$CWD/.agents/skills`
- `$CWD/../.agents/skills`
- `$REPO_ROOT/.agents/skills`

适用场景：

- 当前模块专用 skill
- 某个子目录共享 skill
- 整个仓库通用 skill

### 5.2 用户级

- `$HOME/.agents/skills`

适合放你个人在所有项目里都想复用的 skill。

### 5.3 系统级

- `/etc/codex/skills`

适合机器级共享 skill，给多个用户统一提供默认能力。

### 5.4 系统内置

Codex 还会带一些内置 skill。

补充说明：官方文档提到，Codex 支持扫描符号链接的 skill 目录。

## 6. 如何创建 Skill

官方推荐优先使用内置创建器：

```bash
$skill-creator
```

它通常会引导你回答几个问题，比如：

- 这个 skill 是做什么的
- 什么时候触发
- 是纯说明型，还是需要脚本支持，默认通常是“纯说明型 skill”。

如果你不想用创建器，也可以手工建目录，再写 `SKILL.md`。

## 7. Skill 更新后多久生效

官方文档说明：

- Codex 会自动检测 skill 变更
- 如果修改后没有生效，可以重启 Codex

所以一般可以先修改，再观察；如果没有生效，再重启。



## 9. 如何禁用某个 Skill

官方文档给出的方式，不是删除目录，而是在 `~/.codex/config.toml` 中写配置：

```toml
[[skills.config]]
path = "/path/to/skill/SKILL.md"
enabled = false
```

改完后，官方建议重启 Codex。

注意：这属于“启用或禁用已有 skill”，不是“新增任意 skill root”。

## 10. 可选元数据：`agents/openai.yaml`

你还可以给 skill 增加一个 `agents/openai.yaml`，用于：

- 配置 Codex App 中的显示名称和描述
- 设置是否允许隐式调用
- 声明它依赖哪些工具

常见配置项包括：

- `display_name`
- `short_description`
- `icon_small`
- `icon_large`
- `brand_color`
- `default_prompt`
- `policy.allow_implicit_invocation`
- `dependencies.tools`

## 11. 一句话结论

如果你想让 Codex 按官方标准发现自定义 skill，最稳妥的做法是把 skill 放到这些目录之一：

- 项目内：`.agents/skills/...`
- 用户级：`~/.agents/skills/...`
- 系统级：`/etc/codex/skills/...`

官方文档里并没有把“任意自定义 skill root”作为主要配置方式来介绍。

## 12. 实操建议

结合日常使用，通常可以这样落地：

- 当前仓库专用：放到项目根目录的 `.agents/skills/`
- 你个人所有项目通用：放到 `~/.agents/skills/`
- 想做团队共享：由管理员统一放到 `/etc/codex/skills/`

如果你当前环境里还能识别项目下的 `/.codex/skills`，那更可能是你这套 Codex 桌面环境或集成层做了额外注入，而不是官方标准扫描规则本身。

## 13. 参考链接

- Skills 总览：[https://developers.openai.com/codex/skills](https://developers.openai.com/codex/skills)
- Create a skill：[https://developers.openai.com/codex/skills/create-skill](https://developers.openai.com/codex/skills/create-skill)

## 14. Claude Code 兼容性说明

如果你还在使用 Claude Code，需要特别注意：Claude Code 和 Codex 的 skill 扫描目录不是同一套规则。

根据 Claude Code 当前官方文档，Claude Code 相关目录主要是：

- 项目级 skills：`.claude/skills/<skill-name>/SKILL.md`
- 用户级 skills：`~/.claude/skills/<skill-name>/SKILL.md`
- 项目级 subagents：`.claude/agents/*.md`

这意味着：

- `./.agents/skills/xxx/SKILL.md`：是 Codex 官方标准路径，不是 Claude Code 文档声明的标准 skill 路径
- `./.claude/skills/xxx/SKILL.md`：是 Claude Code 的标准项目级 skill 路径
- `~/.claude/skills/xxx/SKILL.md`：是 Claude Code 的标准用户级 skill 路径
- `./.claude/agents/*.md`：是 Claude Code 的 subagent 配置路径，不等同于 skill

### 14.1 双工具兼容建议

如果你希望同一个项目同时兼容 Codex 和 Claude Code，最稳妥的做法是两边各放一份：

- 给 Codex：`.agents/skills/xxx/SKILL.md`
- 给 Claude Code：`.claude/skills/xxx/SKILL.md`

如果内容基本一致，可以自己维护两份同步内容，或者通过符号链接做统一管理。

### 14.2 Claude Code 参考链接

- Skills：[https://code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills)
- Claude Directory：[https://code.claude.com/docs/en/claude-directory](https://code.claude.com/docs/en/claude-directory)
- Sub-agents：[https://code.claude.com/docs/en/sub-agents](https://code.claude.com/docs/en/sub-agents)

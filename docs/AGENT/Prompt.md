# Prompt

在 AI Agent 中，Prompt（提示词） 就是你发给模型的输入文本，模型根据它来生成回复。

模型看到的不只是你一句话，而是完整的上下文窗口，包括系统指令、之前的对话、工具调用结果等。这些全部算作 prompt 的一部分。

## 核心作用

Prompt 的质量直接决定 AI 回复的质量。

```
你的消息 (User Prompt)
    ↓
[System Prompt + 历史对话 + 工具结果 + 你的消息]  ← 全部打包
    ↓
LLM 模型
    ↓
AI 的回复
```



## Hermes Agent

在 Hermes Agent 中，Prompt 分几层

1. System Prompt（系统提示词） — 你没直接看到，但模型始终在读的底层指令，定义了 Agent 的身份、能力、行为规则。比如"你是 Hermes Agent，可以使用终端、文件等工具"。

2. User Prompt（用户提示词） — 你发的消息，比如"帮我写个 Python 脚本"。

3. Tool Output（工具输出） — Agent 执行工具后的结果，也会作为上下文喂回给模型。


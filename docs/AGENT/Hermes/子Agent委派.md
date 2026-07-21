# 子Agent委派

`delegate_task` 工具会生成具有隔离上下文、受限工具集和独立终端会话的子 AIAgent 实例。每个子智能体获得全新的对话并独立运行——只有其最终摘要会进入父智能体的上下文。

```
delegate_task(
    goal="Debug why tests fail",
    context="Error: assertion in test_foo.py line 42",
    toolsets=["terminal", "file"]
)
```



```
delegate_task(tasks=[
    {"goal": "Research topic A", "toolsets": ["web"]},
    {"goal": "Research topic B", "toolsets": ["web"]},
    {"goal": "Fix the build", "toolsets": ["terminal", "file"]}
])
```


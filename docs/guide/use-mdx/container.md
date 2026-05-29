# 容器

你可以使用 `:::` 语法创建自定义容器，并支持自定义标题。

## 示例

:::tip
这是一个 `tip` 类型的 `block`
:::

:::info
这是一个 `info` 类型的 `block`
:::

:::warning
这是一个 `warning` 类型的 `block`
:::

:::danger
这是一个 `danger` 类型的 `block`
:::

::: details
这是一个 `details` 类型的 `block`
:::

:::tip 自定义标题
这是一个 `自定义标题` 的 `block`
:::

:::tip{title="自定义标题"}
这是一个 `自定义标题` 的 `block`
:::

```tree
docs
├── foo
│   ├── bar.md
│   └── index.md
├── zoo.md
└── index.md

```

```tsx title="foo.tsx"
export default () => {
  return <div>foo</div>;
};
```


| 策略     | 默认值              | 说明                           |
| -------- | ------------------- | ------------------------------ |
| 每日重置 | 凌晨 4:00           | 每天在指定时间自动重置会话     |
| 空闲重置 | 1440 分钟（24小时） | 会话空闲超过指定时间后自动重置 |
| 组合模式 | 两者同时生效        | 以最先触发的条件为准           |
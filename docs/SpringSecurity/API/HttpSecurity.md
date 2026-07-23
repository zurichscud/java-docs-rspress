# HttpSecurity

- **`addFilterBefore(filter, class)`**：把自定义过滤器放在某个标准过滤器**之前**（最常用）。
- **`addFilterAfter(filter, class)`**：把自定义过滤器放在某个标准过滤器**之后**。
- **`addFilterAt(filter, class)`**：把自定义过滤器放在和某个标准过滤器**相同的位置**（注意：这并不会替换原过滤器，只是它们俩的顺序变成随机/依赖注册顺序，通常不推荐，除非你手动关闭了原过滤器）。

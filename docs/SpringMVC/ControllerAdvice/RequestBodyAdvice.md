# RequestBodyAdvice

> 请求体拦截钩子

它的设计理念和 ResponseBodyAdvice 完全对称。

## Example

RequestBodyAdvice 同样需要配合 `@ControllerAdvice`（或 `@RestControllerAdvice`）使用。它专门用来拦截使用`@RequestBody `注解的参数。

## Steps

```java
┌─────────────────────────────────────────────────────────────┐
│   解析方法参数（入参）                                      │
│     ↓                                                       │
│     RequestResponseBodyMethodProcessor（处理 @RequestBody）   │
│     ↓                                                       │
│     ├─ RequestBodyAdvice.supports()     ← 判断是否拦截        │
│     ↓                                                       │
│     ├─ RequestBodyAdvice.beforeBodyRead()                   │
│     ↓                                                       │
│     ├─ 【反序列化】HttpMessageConverter.read()                   │
│     │      ↑ 这里！遍历匹配 Converter，调用 Jackson 反序列化   │
│     ↓                                                       │
│     └─ RequestBodyAdvice.afterBodyRead()                    │
│            ↑ 反序列化后的 Java 对象到这里                      │
└─────────────────────────────────────────────────────────────┘
```

1. **URL 参数解析 (`userId=100`)**： 

   Spring MVC 发现 Controller 方法上需要 `Long userId`。此时，**`Converter<String, Long>`** 出场，将字符串 `"100"` 转换为 Java 的 `100L`。

2. **请求体解析 (`@RequestBody`)**：

   当请求是JSON时，并且标注了`@RequestBody`，将使用`RequestResponseBodyMethodProcessor`解析参数。他包括：

   - 调用 RequestBodyAdvice

   - 选择并调用 MessageConverter.read()（反序列化）

   - 用 `ArgumentResolver` 完成参数绑定


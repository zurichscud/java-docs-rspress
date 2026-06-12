# DefaultErrorAttributes

在 Spring Boot 中，**`DefaultErrorAttributes`** 是负责**收集错误信息**的核心实现类。

当你没有对异常进行捕获，或者发生 404 错误时，Spring Boot 会自动跳转到 `/error` 路径。在这个过程中，`DefaultErrorAttributes` 会把异常的底层细节格式化为一个 `Map<String, Object>`，这个 Map 就是你平时在 Postman 或浏览器里看到的那个默认 JSON 错误响应的数据源。

## 核心工作原理

在 Spring Boot 的默认全局错误处理体系中，它扮演着“数据提供者”的角色：

1. **触发错误**：控制器（Controller）抛出异常，或者 Servlet 容器拦截到 404/500 等错误。
2. **重定向到 `/error`**：请求被转发给 Spring Boot 自带的 `BasicErrorController`。
3. **提取属性**：`BasicErrorController` 会调用 `DefaultErrorAttributes.getErrorAttributes()` 方法，拿到一个包含诸多错误信息的 Map。
4. **渲染输出**：根据请求头（Accept），这个 Map 会被转换成 JSON 返回，或者传给 Whitelabel 错误页面渲染成 HTML。



## 示例

```json
{
  "timestamp": "2026-06-12T09:15:30.123+00:00",
  "status": 404,
  "error": "Not Found",
  "message": "No static resource api/v1/user/unknown.",
  "path": "/api/v1/user/unknown"
}
```

Spring Boot 默认情况下，**HTTP 网络响应的状态码（Network Status Code）与 JSON 里面的 `"status"` 字段值是完全一致的**。
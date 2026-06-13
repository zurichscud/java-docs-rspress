# StringHttpMessageConverter

**读取请求（Read）：** 当请求的 `Content-Type` 通常为 `text/plain` 时，或者方法参数带有 `@RequestBody String body` 时，它负责将 HTTP 请求体中的字节流转换成 Java 的 `String` 对象。

**写入响应（Write）：** 当你的 Controller 方法返回值是 `String`，且使用了 `@ResponseBody`（或使用了 `@RestController`）时，它负责将这个 Java `String` 转换成字节流，并写入 HTTP 响应体，同时默认将 `Content-Type` 设置为 `text/plain;charset=ISO-8859-1`（在旧版本中）或 `text/plain;charset=UTF-8`（较新版本）。
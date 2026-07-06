# MediaType

`MediaType` = **Java 代码里对 HTTP Content-Type 的封装**

在 Spring Boot 和 HTTP 协议的语境下，MediaType（媒体类型） 用来标识传输的数据到底是什么格式，从而让发送端和接收端能够正确地解析报文。

MediaType 实际上是互联网标准 MIME 类型（Multipurpose Internet Mail Extensions） 在 Spring 中的面向对象封装。

```java
package org.springframework.http;
```

```java
response.setContentType(MediaType.APPLICATION_OCTET_STREAM_VALUE);
```

## 标准结构

一个标准的 `MediaType` 由两到三部分组成，格式通常为：`类型/子类型;参数`（`type/subtype;parameter`）。

- **Type（主类型）**：表示数据的大类。例如 `text`（文本）、`application`（应用数据）、`image`（图片）。
- **Subtype（子类型）**：表示具体的格式。例如 `json`、`xml`、`html`、`png`。
- **Parameter（可选参数）**：最常见的是指定字符集。例如 `charset=UTF-8`。



## 常见示例

- `application/json`：JSON 数据格式。
- `application/x-yaml`：我们之前实现的 YAML 格式。
- `multipart/form-data`：Vue 前端上传文件、提交表单时使用的格式。



## 常量值

为了避免开发者手动写错字符串，Spring 的 `org.springframework.http.MediaType` 类中内置了大量的静态常量。在日常开发中，我们应该优先使用这些常量：

| **常量名**                                 | **对应的字符串**             | **适用场景**                   |
| ------------------------------------------ | ---------------------------- | ------------------------------ |
| `MediaType.APPLICATION_JSON_VALUE`         | `"application/json"`         | 前后端分离最常用的 JSON 交互   |
| `MediaType.APPLICATION_XML_VALUE`          | `"application/xml"`          | XML 格式交互                   |
| `MediaType.TEXT_HTML_VALUE`                | `"text/html"`                | 返回传统的 HTML 页面           |
| `MediaType.MULTIPART_FORM_DATA_VALUE`      | `"multipart/form-data"`      | 文件上传                       |
| `MediaType.APPLICATION_OCTET_STREAM_VALUE` | `"application/octet-stream"` | 二进制流下载（如导出的 Excel） |



| **框架**      | **序列化（Java 对象 → JSON）**    | **反序列化（JSON → Java 对象）**     |
| ------------- | --------------------------------- | ------------------------------------ |
| **Jackson**   | `mapper.writeValueAsString(user)` | `mapper.readValue(json, User.class)` |
| **Gson**      | `gson.toJson(user)`               | `gson.fromJson(json, User.class)`    |
| **Fastjson2** | `JSON.toJSONString(user)`         | `JSON.parseObject(json, User.class)` |

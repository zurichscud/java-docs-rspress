# HttpMessageConverter

> HTTP消息转换

HttpMessageConverter 专门负责在 Java 对象 和 HTTP 请求/响应体（如 JSON、XML、文本等） 之间进行双向转换。

## 转换器何时工作的？

当一个 HTTP 请求到达 Spring MVC 控制器，或者控制器准备返回数据时，`HttpMessageConverter` 就会介入

### 响应(Write)

当一个请求执行完毕，Spring MVC 需要把返回值写回浏览器/客户端时，只有满足以下条件之一，`HttpMessageConverter` 才会介入：

- **方法或类上标注了 `@ResponseBody`**：这是最常见的情况。它告诉 Spring，返回值不是一个视图（View）名称，而是直接写进 HTTP 响应体的数据。

- **方法或类上标注了 `@RestController`**：因为 `@RestController` 本身就是一个组合注解，它内部已经隐式包含了 `@ResponseBody`。

- **返回值是 `ResponseEntity<?>`**：如果你的方法返回的是 `ResponseEntity`，即使你不写 `@ResponseBody`，Spring 也会通过 `HttpMessageConverter` 来转换其内部的 Body 数据。

### 请求(Read)

当客户端发送 JSON/XML 等数据到后端时，只要你在 Controller 的方法参数上标注了 **`@RequestBody`**，`HttpMessageConverter` 就会立即接入，将 HTTP 请求体中的二进制或文本数据`read`成你的 Java 实体类。



## 常见的内置实现类

| Converter                                | 作用                       |
| ---------------------------------------- | -------------------------- |
| `MappingJackson2HttpMessageConverter`    | JSON ↔ Java 对象（最常用） |
| `StringHttpMessageConverter`             | String ↔ text/plain        |
| `ByteArrayHttpMessageConverter`          | byte[] 数据                |
| `FormHttpMessageConverter`               | 表单数据                   |
| `MappingJackson2XmlHttpMessageConverter` | XML ↔ Java 对象            |

## Spring 是如何选择转换器的？

Spring MVC 内部维护着一个 HttpMessageConverter 的列表。这个List是存在顺序的，默认的转换器列表顺序：

1. `ByteArrayHttpMessageConverter`（处理字节数组）
2. **`StringHttpMessageConverter`（处理字符串）**
3. `ResourceHttpMessageConverter`（处理资源文件）
4. ...
5. **`MappingJackson2HttpMessageConverter`（处理 JSON 对象，排在后面）**



当需要转换时，它会遍历这个列表：

- 对于请求 (canRead)： 根据请求头中的 Content-Type（如 application/json）和目标 Java 参数类型，找到第一个返回 true 的转换器来处理。
- 对于响应 (canWrite)： 根据客户端请求头中的 Accept（期待接收的格式）以及返回值类型，找到最合适的转换器。

举个例子：
如果前端发送了一个 Content-Type: application/json 的 POST 请求，Spring 遍历转换器时，`MappingJackson2HttpMessageConverter` 发现自己能处理 JSON 且能转为对应的 Java 实体类，于是把 JSON 字符串反序列化为 Java 对象。

## Spring是何时选择转换器的？

请求：在 `RequestBodyAdvice` 执行之前，选择哪个 `HttpMessageConverter` 已经完全确定好了

响应：在`ResponseBodyAdvice`之前，选择哪个 `HttpMessageConverter` 已经完全确定好了

## 接口方法

无论是处理请求（Read）还是处理响应（Write），Spring MVC 的底层工作机制都是典型的 “先判断、再执行” 的策略。

- 请求时： Spring 会先通过 `canRead` 检查该转换器能否处理当前请求的格式与目标 Java 类型，通过后才调用` read` 将请求体反序列化为 Java 对象。
- 响应时： Spring 会先通过 `canWrite` 检查该转换器能否处理返回值类型与客户端请求的媒体类型，通过后才调用 `write` 将 Java 对象序列化为响应体。

```java
public interface HttpMessageConverter<T> {
    // 1. 判断该转换器是否能将当前请求内容读取为指定的 Java 类型
    boolean canRead(Class<?> clazz, MediaType mediaType);

    // 2. 判断该转换器是否能将指定的 Java 类型写入为当前媒体类型的响应
    boolean canWrite(Class<?> clazz, MediaType mediaType);

    // 3. 读取 HTTP 请求体并转换为 Java 对象
    T read(Class<? extends T> clazz, HttpInputMessage inputMessage)
            throws IOException, HttpMessageNotReadableException;

    // 4. 将 Java 对象写入到 HTTP 响应体中
    void write(T t, MediaType contentType, HttpOutputMessage outputMessage)
            throws IOException, HttpMessageNotWritableException;
}
```




# HttpMessageConverter

HTTP消息转换器

HttpMessageConverter 是一个至关重要的核心接口。简单来说，它就像一个“高级翻译官”，专门负责在 Java 对象 和 HTTP 请求/响应体（如 JSON、XML、文本等） 之间进行双向转换。

## 何时工作

当一个 HTTP 请求到达 Spring MVC 控制器，或者控制器准备返回数据时，`HttpMessageConverter` 就会介入：

- 读取请求 (Read)： 将 HTTP 请求体（比如前端发来的 JSON 字符串）转换成控制器方法中对应的 Java 对象。通常触发于 @RequestBody 注解。

- 写入响应 (Write)： 将控制器方法返回的 Java 对象转换成指定格式的 HTTP 响应体（比如传回前端的 JSON 数据）。通常触发于 @ResponseBody 或 @RestController。

## 常见的内置实现类

| Converter                                | 作用                       |
| ---------------------------------------- | -------------------------- |
| `MappingJackson2HttpMessageConverter`    | JSON ↔ Java 对象（最常用） |
| `StringHttpMessageConverter`             | String ↔ text/plain        |
| `ByteArrayHttpMessageConverter`          | byte[] 数据                |
| `FormHttpMessageConverter`               | 表单数据                   |
| `MappingJackson2XmlHttpMessageConverter` | XML ↔ Java 对象            |

## 接口方法

无论是处理请求（Read）还是处理响应（Write），Spring MVC 的底层工作机制都是典型的 “先判断、再执行” 的策略。

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

- 请求时： Spring 会先通过 canRead 检查该转换器能否处理当前请求的格式与目标 Java 类型，通过后才调用 read 将请求体真正反序列化为 Java 对象。
- 响应时： Spring 会先通过 canWrite 检查该转换器能否处理返回值类型与客户端请求的媒体类型，通过后才调用 write 将 Java 对象序列化为响应体。

## Spring 是如何选择转换器的？

Spring MVC 内部维护着一个 HttpMessageConverter 的列表（List）。当需要转换时，它会遍历这个列表：

对于请求 (canRead)： 根据请求头中的 Content-Type（如 application/json）和目标 Java 参数类型，找到第一个返回 true 的转换器来处理。

对于响应 (canWrite)： 根据客户端请求头中的 Accept（期待接收的格式）以及返回值类型，找到最合适的转换器。

举个例子：
如果前端（比如 Vue 端的 Axios）发送了一个 Content-Type: application/json 的 POST 请求，Spring 遍历转换器时，MappingJackson2HttpMessageConverter 发现自己能处理 JSON 且能转为对应的 Java 实体类，于是它就会接单，把 JSON 字符串反序列化为 Java 对象。

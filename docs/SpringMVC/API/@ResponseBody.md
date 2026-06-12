# @ResponseBody

@ResponseBody 是一个非常核心的注解，它的主要作用是跳过传统的视图解析（View Resolution）流程，直接将控制器的返回值写入 HTTP 响应体（Response Body）中。

```java
@RestController
@RequestMapping("/user")
public class UserController {

    @GetMapping("/{id}")
    @ResponseBody
    public User getUser(@PathVariable Long id) {
        return new User("Tom", 18);
    }
}
```

## 工作原理

如果不加 @ResponseBody，Spring MVC 会把控制器方法的返回值（比如一个字符串 "index"）当成视图名称去寻找对应的 HTML/JSP 页面。

加上 @ResponseBody 后，流程就会发生根本性的变化：

1. 绕过视图解析器： Spring 知道你返回的不是页面名称，而是具体的数据。

2. 触发消息转换器： Spring 会根据请求头中的 Accept（前端期望的数据格式）和返回值的类型，自动在后台挑选一个合适的 HttpMessageConverter（比如 MappingJackson2HttpMessageConverter）。

3. 序列化并写入响应： 转换器执行 canWrite 和 write 逻辑，将你的 Java 对象（如 User、List、Map 等）转换为 JSON 字符串或纯文本，直接塞进 HTTP 响应体里发送给前端。

## 常见使用场景

- 返回 JSON 数据（最常见）：
  当你返回一个普通的 Java 对象（POJO）或集合时，Spring 会使用MappingJackson2HttpMessageConverter将其转换为 JSON 格式。

- 返回纯文本：
  如果方法返回值是 String，Spring 默认会使用 StringHttpMessageConverter 将其作为纯文本（text/plain）直接返回。

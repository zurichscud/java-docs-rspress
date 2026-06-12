# @RequestBody

告诉 Spring，将当前 HTTP 请求的请求体（Request Body）中的数据（通常是 JSON 字符串），自动反序列化并绑定到控制器方法的 Java 对象参数上。

## 工作原理

当一个请求打到带有 @RequestBody 的 Controller 方法时，Spring 并在幕后启动了以下流水线：识别注解：

1. Spring 看到参数上有 @RequestBody，就知道这个参数的数据不在 URL 中，也不在表单（Form Data）里，而是深埋在 HTTP 请求体（Body）中。

2. 检查 Content-Type： Spring 会查看请求头（Header）里的 Content-Type。通常前端发来的是 application/json。

3. 调用合适的消息转换器：通常是 `MappingJackson2HttpMessageConverter`。

4. 验证并执行： 转换器先判断能否处理，通过后通过 Jackson 库读取请求体中的 JSON 字符串，将其转换成对应的 Java 对象，最后注入给方法参数。

## Example

```js
// Axios 示例
axios.post("/user/save", {
  name: "张三",
  age: 25,
  email: "zhangsan@example.com",
});
// 此时 Axios 会自动将 Header 的 Content-Type 设置为 application/json
```

```java
@RestController
@RequestMapping("/user")
public class UserController {

    @PostMapping("/save")
    // @RequestBody 会把前端传来的 JSON 映射进 userDTO 对象中
    public String saveUser(@RequestBody UserDTO userDTO) {
        System.out.println("收到用户姓名：" + userDTO.getName());
        return "success";
    }
}
```

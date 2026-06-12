# ResponseBodyAdvice

在 Spring Boot / Java 后端开发中，`ResponseBodyAdvice` 是一个非常强大且实用的接口。简单来说，它是 Spring 框架提供的一个**拦截器钩子**，允许你在系统的 Controller（控制器）执行完成之后、但在响应体（Response Body）被写入 HTTP 响应之前，**拦截并修改**返回的数据。

如果你想要在项目里做**全局统一返回值包装**、**加密/解密**、或**统一日志打印**，它就是最佳选择。

## 执行时机

`ResponseBodyAdvice` 的工作契机介于 Controller 和 `HttpMessageConverter`（如 Jackson）之间。整个流程如下：

1. **Controller** 处理完业务，返回一个对象（例如 `User` 对象）。
2. Spring 发现该方法标注了 `@ResponseBody`。
3. **`ResponseBodyAdvice` 介入**，捞出这个 `User` 对象，你可以把它包装成 `Result<User>`。
4. **`HttpMessageConverter`** 将最终的对象序列化为 JSON 字符串，返回给前端。

```
请求
 ↓
Controller
 ↓
返回对象
 ↓
ResponseBodyAdvice
 ↓
HttpMessageConverter
 ↓
JSON序列化
 ↓
响应给前端
```

也就是说：

```java
@GetMapping("/user")
public User getUser() {
    return new User("张三");
}
```

Controller 返回 `User` 后，会先经过 `ResponseBodyAdvice`，然后才转换成 JSON。



## 源码

```java
public interface ResponseBodyAdvice<T> {

	/**
	 * Whether this component supports the given controller method return type
	 * and the selected {@code HttpMessageConverter} type.
	 * @param returnType the return type
	 * @param converterType the selected converter type
	 * @return {@code true} if {@link #beforeBodyWrite} should be invoked;
	 * {@code false} otherwise
	 */
	boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType);

	/**
	 * Invoked after an {@code HttpMessageConverter} is selected and just before
	 * its write method is invoked.
	 * @param body the body to be written
	 * @param returnType the return type of the controller method
	 * @param selectedContentType the content type selected through content negotiation
	 * @param selectedConverterType the converter type selected to write to the response
	 * @param request the current request
	 * @param response the current response
	 * @return the body that was passed in or a modified (possibly new) instance
	 */
	@Nullable
	T beforeBodyWrite(@Nullable T body, MethodParameter returnType, MediaType selectedContentType,
			Class<? extends HttpMessageConverter<?>> selectedConverterType,
			ServerHttpRequest request, ServerHttpResponse response);

}
```

### supports

决定是否要拦截当前 Controller 的返回结果。返回 true 则执行 beforeBodyWrite；返回 false 则直接放行

### beforeBodyWrite

对返回体进行具体的修改逻辑

## 示例

我们需要加上 `@ControllerAdvice` 或 `@RestControllerAdvice` 注解，Spring 才会将其注册为全局组件。

```java
@RestControllerAdvice(basePackages = "com.example.controller") // 可以指定拦截的包名
public class MyResponseBodyAdvice implements ResponseBodyAdvice<Object> {

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        // 如果 Controller 方法已经返回了 Result 对象，或者放行某些特殊接口，这里返回 false
        return !returnType.getParameterType().isAssignableFrom(Result.class);
    }

    @Override
    public Object beforeBodyWrite(Object body, 
                                  MethodParameter returnType, 
                                  MediaType selectedContentType, 
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType, 
                                  ServerHttpRequest request, 
                                  ServerHttpResponse response) {
        
        // 关键大坑：如果 Controller 返回的是 String 类型，对应的转换器是 StringHttpMessageConverter
        // 如果直接返回 Result 对象，会导致类型转换异常 (ClassCastException)
        if (body instanceof String) {
            // 需要手动用 Jackson 序列化成 JSON 字符串返回
            return new ObjectMapper().writeValueAsString(Result.success(body)); 
        }

        // 其他类型直接包装
        return Result.success(body);
    }
}
```

::: danger String 类型的特殊处理

如上面代码所示，Spring MVC 对 `String` 类型的返回值默认使用 `StringHttpMessageConverter`。如果你在 `beforeBodyWrite` 里返回了一个 `Result<String>` 对象，Spring 会尝试强转成 String 从而报错。**必须特殊处理，将其转为 JSON 字符串**，或者调整转换器的优先级。

:::
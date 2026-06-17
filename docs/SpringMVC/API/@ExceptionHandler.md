# @ExceptionHandler

`@ExceptionHandler` 是 Spring MVC 提供的**异常处理注解**，用于捕获指定类型的异常，并执行自定义处理逻辑。

## 基本用法

处理指定异常

```java
@RestController
public class UserController {

    @GetMapping("/test")
    public String test() {
        throw new RuntimeException("出错了");
    }

    @ExceptionHandler(RuntimeException.class)
    public String handle(RuntimeException e) {
        return "异常：" + e.getMessage();
    }
}
```

当 `test()` 抛出 `RuntimeException` 时会被：`@ExceptionHandler(RuntimeException.class)`标记的方法捕获

## 匹配多个异常

```java
@ExceptionHandler({
    NullPointerException.class,
    IllegalArgumentException.class
})
public String handle(Exception e) {
    return e.getMessage();
}
```

## 多个ExceptionHandler

- Spring 会根据**异常类型的匹配程度**选择最合适的 `@ExceptionHandler`。

- 如果存在多个匹配的`@ExceptionHandler`，Spring会选择更具体的ExceptionHandler



## ExceptionHandler执行顺序

当你的 `@ExceptionHandler` 方法执行完毕并返回一个对象（例如 `Result.fail("系统异常")`）时，时序如下：

1. `ExceptionHandlerExceptionResolver` 拿到返回值。
2. 路由给对应的处理器（在前后端分离中，通常是 `RequestResponseBodyMethodProcessor`）。
3. 处理器准备把对象转成 JSON。**就在这个关键点，它会先去寻找容器中所有的 `ResponseBodyAdvice`**。
4. 执行 `ResponseBodyAdvice.supports()` 方法，判断当前返回值是否需要拦截。
5. 如果返回 `true`，则执行 `ResponseBodyAdvice.beforeBodyWrite()` 方法。**在这里你可以对 `@ExceptionHandler` 返回的错误对象进行二次修改**（例如统一包装结构、记录日志等）。
6. `ResponseBodyAdvice` 执行完毕，把（修改后的）对象还给处理器。
7. 处理器调用 `HttpMessageConverter`将对象序列化为 JSON 字符串。
8. 写入 `HttpServletResponse` 响应流，返回给 前端。

在 `ResponseBodyAdvice` 的 `supports` 或 `beforeBodyWrite` 中做类型判断，如果发现 `body` 已经是 `Result` 类型，就直接返回，不再重复包装：

```java
@Override
public Object beforeBodyWrite(Object body, ...) {
    if (body instanceof Result) {
        return body; // 如果已经是包装好的错误结果，直接放行
    }
    return Result.success(body);
}
```

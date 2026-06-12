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

多个异常

```java
@ExceptionHandler({
    NullPointerException.class,
    IllegalArgumentException.class
})
public String handle(Exception e) {
    return e.getMessage();
}
```


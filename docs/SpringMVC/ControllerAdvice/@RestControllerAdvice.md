# @RestControllerAdvice

使用 `@ControllerAdvice` 时，如果方法需要返回 JSON 数据，必须在方法上手动加 `@ResponseBody`。我们可以使用`@RestControllerAdvice` ，本质上是一个组合注解：

```
@ControllerAdvice
@ResponseBody
```

使用 `@RestControllerAdvice` 时，所有方法的返回值都会**自动**序列化为 JSON/XML 传输给前端。

如果你坚持使用 `@ControllerAdvice`，你的代码必须长这样：

```java
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    @ResponseBody // 每个方法都必须手动加上这个注解，否则 Spring 会误认为你想跳转网页！
    public Result handleException(Exception e) {
        return Result.fail(e.getMessage());
    }
}
```

为了解决前后端分离场景下的冗余代码，Spring 引入了 `@RestControllerAdvice`。现在你只需要这样写：

```java
@RestControllerAdvice // 声明一次，全局生效
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    // 自动隐式包含 @ResponseBody，直接返回对象，Spring 会自动将其序列化为 JSON
    public Result handleException(Exception e) {
        return Result.fail(e.getMessage());
    }
}
```


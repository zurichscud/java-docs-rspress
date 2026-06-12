# @RestControllerAdvice

`@RestControllerAdvice` 是 Spring 提供的一个**全局增强组件**，本质上是：

```
@ControllerAdvice
@ResponseBody
```

的组合注解。

## 用法

用于对所有 `@Controller`、`@RestController` 进行统一增强。

## 全局异常处理

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public Result<Void> handleException(Exception e) {
        return Result.fail("系统异常");
    }
}
```


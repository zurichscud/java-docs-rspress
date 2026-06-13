# @RestControllerAdvice

使用 `@ControllerAdvice` 时，如果方法需要返回 JSON 数据，必须在方法上手动加 `@ResponseBody`。我们可以使用

`@RestControllerAdvice` ，本质上是一个组合注解：

```
@ControllerAdvice
@ResponseBody
```

使用 `@RestControllerAdvice` 时，所有方法的返回值都会**自动**序列化为 JSON/XML 传输给前端。

## 全局异常处理

```java
package com.example.exception;

import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.http.HttpStatus;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. 处理自定义的业务异常（例如：密码错误、余额不足）
    @ExceptionHandler(BusinessException.class)
    public Map<String, Object> handleBusinessException(BusinessException e) {
        Map<String, Object> map = new HashMap<>();
        map.put("code", e.getCode());
        map.put("msg", e.getMessage());
        return map;
    }

    // 2. 处理兜底的系统异常（例如：NullPointerException, 数据库连接超时）
    @ExceptionHandler(Exception.class)
    public Map<String, Object> handleException(Exception e) {
        // 实际开发中这里会用 log.error("系统异常", e) 记录日志
        Map<String, Object> map = new HashMap<>();
        map.put("code", 500);
        map.put("msg", "系统繁忙，请稍后再试");
        return map;
    }
}
```






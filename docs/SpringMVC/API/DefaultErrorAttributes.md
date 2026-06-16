# DefaultErrorAttributes

在 Spring Boot 中，如果你没有配置任何自定义的异常处理器（例如 `@RestControllerAdvice`），或者有些异常发生在进入 Controller 之前（比如 Filter 层、Spring Security 认证阶段），Spring Boot 的全局错误处理机制就会全面接管。

默认情况下，当系统报错且没有被捕获时，Spring Boot 会重定向到 `/error` 端点，由 `BasicErrorController` 来处理响应。而 `BasicErrorController` 展现出来的 JSON 数据，就是直接从 `DefaultErrorAttributes` 中获取的。



## 默认返回的结构

在默认情况下，`DefaultErrorAttributes` 收集并返回给前端的 JSON 结构长这样：

```json
{
  "timestamp": "2026-06-16T14:36:16.123+00:00",
  "status": 500,
  "error": "Internal Server Error",
  "path": "/api/user/list"
}
```



## 继承与重写

如果你希望**所有未捕获的硬底层错误（如 Filter 报错）也自动适配后端的统一返回格式**，你可以通过继承并重写 `DefaultErrorAttributes` 来彻底改造它。

```java
import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.WebRequest;

import java.util.LinkedHashMap;
import java.util.Map;

@Component
public class CustomErrorAttributes extends DefaultErrorAttributes {

    @Override
    public Map<String, Object> getErrorAttributes(WebRequest webRequest, ErrorAttributeOptions options) {
        // 1. 获取 Spring Boot 默认帮我们收集好的错误属性
        Map<String, Object> defaultAttributes = super.getErrorAttributes(webRequest, options);

        // 2. 创建一个符合前端规范的全新 Map
        Map<String, Object> customAttributes = new LinkedHashMap<>();
        
        // 状态码
        Integer status = (Integer) defaultAttributes.get("status");
        customAttributes.put("code", status != null ? status : 500);
        
        // 映射错误提示信息
        String message = (String) defaultAttributes.get("message");
        if (message == null || "No message available".equals(message)) {
            message = (String) defaultAttributes.get("error"); // 拿不到具体 message 就用 error 概括
        }
        customAttributes.put("message", message);
        
        // 附带一些额外调试信息放入 data
        Map<String, Object> extraData = new LinkedHashMap<>();
        extraData.put("path", defaultAttributes.get("path"));
        extraData.put("timestamp", defaultAttributes.get("timestamp"));
        customAttributes.put("data", extraData);

        return customAttributes;
    }
}
```

改造后的响应效果：

```json
{
  "code": 404,
  "message": "Not Found",
  "data": {
    "path": "/api/unknown-service",
    "timestamp": "2026-06-16T14:36:16.123+00:00"
  }
}
```


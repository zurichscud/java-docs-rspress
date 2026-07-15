# OncePerRequestFilter

## 

在 Spring 框架中，**`OncePerRequestFilter`** 是最推荐用来实现请求日志、安全认证等功能的基类。

虽然标准的 `jakarta.servlet.Filter` 已经能实现拦截，但它有一个潜在的痛点：**无法保证在同一次请求中只被执行一次**。由于 Servlet 的转发机制（如 `forward` 或 `include`），同一个请求可能会多次穿过同一个过滤器，导致日志重复打印或重复计费。

`OncePerRequestFilter` 是一个抽象类，它通过在当前 `request` 中设置一个唯一属性标签（Attribute）来判断该请求是否已经走过此过滤器。

```java
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

public class LogFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        long start = System.currentTimeMillis();
        System.out.println("请求进入：" + request.getMethod() + " " + request.getRequestURI());

        // 放行
        filterChain.doFilter(request, response);

        long duration = System.currentTimeMillis() - start;
        System.out.println("请求完成，耗时：" + duration + "ms");
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // 可选：排除某些路径不经过此过滤器
        String path = request.getRequestURI();
        return path.startsWith("/health") || path.startsWith("/actuator");
    }
}
```
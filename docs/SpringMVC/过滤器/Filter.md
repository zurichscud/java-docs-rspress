# Filter

## 实现

```java
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

public class MyFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // 过滤器初始化时调用，可用于加载配置参数
        String encoding = filterConfig.getInitParameter("encoding");
        System.out.println("Filter 初始化，编码：" + encoding);
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        // 前置处理：记录请求开始时间
        long start = System.currentTimeMillis();
        System.out.println("请求进入：" + request.getMethod() + " " + request.getRequestURI());

        // 放行，执行下一个过滤器或目标资源
        chain.doFilter(request, response);

        // 后置处理：计算耗时
        long duration = System.currentTimeMillis() - start;
        System.out.println("请求完成，耗时：" + duration + "ms");
    }

    @Override
    public void destroy() {
        // 过滤器销毁时调用，可用于释放资源
        System.out.println("Filter 已销毁");
    }
}
```


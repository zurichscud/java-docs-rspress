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

## OncePerRequestFilter

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

## 注册Filter

### @WebFilter

使用 `@WebFilter` + `@ServletComponentScan`。这种方式属于原生 Servlet 规范，适合快速开发，不需要写额外的配置类。

步骤 1：在 Filter 类上加上注解

```java
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Order(1) // 决定多个 Filter 的执行顺序，数字越小越先执行
@WebFilter(urlPatterns = "/api/*") // 开启过滤的拦截路径
public class MyFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        // 你的逻辑
        chain.doFilter(request, response);
    }
}
```

步骤 2：在 Spring Boot 启动类上开启扫描

必须在你的主启动类（带有 `@SpringBootApplication` 的类）上加上 **`@ServletComponentScan`** 注解，否则 Spring 找不到 `@WebFilter`。

```java
@ServletComponentScan // ⚡ 关键：必须加这个注解
@SpringBootApplication
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```

### FilterRegistrationBean

如果你需要更精确地控制 Filter 的**执行顺序（Order）**、**拦截哪些/排除哪些 URL**，或者你在使用第三方 jar 包里的 Filter（无法在源码上加注解），这种基于 Java 配置类的方式是最佳选择。

你不需要在 Filter 类上加任何注解，只需写一个配置类：

```java
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {

    @Bean
    public v<MyFilter> loggingFilter() {
        FilterRegistrationBean<MyFilter> registrationBean = new FilterRegistrationBean<>();

        // 1. 注入你写好的 Filter 实例
        registrationBean.setFilter(new MyFilter());

        // 2. 设置拦截路径（可以传多个路径）
        registrationBean.addUrlPatterns("/api/*", "/user/*");

        // 3. 设置执行顺序（数字越小越早执行，可以为负数）
        registrationBean.setOrder(1);

        // 4. 设置过滤器名字（可选）
        registrationBean.setName("LogFilter");

        return registrationBean;
    }
}
```

通常会将`FilterRegistrationBean`写在WebConfig中和拦截器统一管理

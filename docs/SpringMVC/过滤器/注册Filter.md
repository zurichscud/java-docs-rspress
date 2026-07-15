# 注册Filter

## @WebFilter

使用 `@WebFilter` + `@ServletComponentScan`。这种方式属于原生 Servlet 规范，适合快速开发，不需要写额外的配置类。

### 步骤 1：在 Filter 类上加上注解

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

### 步骤 2：在 Spring Boot 启动类上开启扫描

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

## FilterRegistrationBean

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

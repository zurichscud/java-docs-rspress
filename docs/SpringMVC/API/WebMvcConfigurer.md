# WebMvcConfigurer

在 Spring Boot 项目中，它被广泛用于**自定义和扩展 Spring MVC 的默认配置**（比如配置拦截器、跨域、静态资源映射、消息转换器等）

## 常用方法

### addInterceptors

这是最常用的方法。用于向 Spring MVC 中注册自定义的拦截器（`HandlerInterceptor`）

```java
@Override
public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(new LoginInterceptor())
            .addPathPatterns("/**")                 // 拦截所有请求
            .excludePathPatterns(
                "/api/auth/login",                  // 放行登录接口
                "/api/auth/register",               // 放行注册接口
                "/doc.html", "/webjars/**"          // 放行 Swagger/Knife4j 接口文档
            );
}
```



### addCorsMappings

> 允许指定的源、请求头和请求方法访问后端资源。

在前后端分离开发时，浏览器会触发同源策略限制。通过这个方法可以全局解决跨域问题（CORS）。

```java
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**")                  // 仅对 /api/ 开头的请求应用跨域规则
            .allowedOrigins("http://localhost:5173") // 允许前端 Vue 服务的源
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 允许的请求方式
            .allowedHeaders("*")                    // 允许任何请求头
            .allowCredentials(true)                 // 是否允许携带 Cookie/凭证
            .maxAge(3600);                          // 预检请求（OPTIONS）的缓存时间（秒）
}
```

### addResourceHandlers

当用户在前端上传了图片、PDF 等文件，后端通常会将其保存在服务器的某个物理磁盘路径下。为了能让前端通过 URL 直接访问这些静态文件，需要做路径映射。

**核心逻辑**：将一个**网络虚拟路径**（URL 模式）映射到**物理实际路径**（本地磁盘或类路径）。

```java
@Override
public void addResourceHandlers(ResourceHandlerRegistry registry) {
    // 映射外部磁盘路径（注意：Linux 环境下用 file:/var/data/...）
    registry.addResourceHandler("/uploads/**")
            .addResourceLocations("file:D:/project/uploads/"); 
            
    // 映射类路径下的静态资源（Spring Boot 默认已配，若需自定义可在此追加）
    registry.addResourceHandler("/static/**")
            .addResourceLocations("classpath:/static/");
}
```

### configureMessageConverters

完全自定义消息转换器列表。**会覆盖 Spring Boot 的默认配置**，慎用。

```java
@Override
public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
    converters.add(new MappingJackson2HttpMessageConverter());
}
```

### extendMessageConverters

在默认转换器列表的基础上**追加或调整**，不会覆盖默认配置，推荐使用。

```java
@Override
public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
    // 在末尾添加自定义转换器
    converters.add(new MyCustomConverter());
    
    // 或在指定位置插入（索引 0 表示最高优先级）
    converters.add(0, new FastJsonHttpMessageConverter());
}
```

## Example

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class MyWebMvcConfig implements WebMvcConfigurer {

    // 1. 配置拦截器 (Interceptors)
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new MyCustomInterceptor())
                .addPathPatterns("/**")             // 拦截所有请求
                .excludePathPatterns("/login", "/static/**"); // 放行登录和静态资源
    }

    // 2. 跨域配置 (CORS)
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")                  // 允许跨域的路径
                .allowedOrigins("http://localhost:5173") // 允许的源（例如前端 Vue 项目的默认端口）
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);                      // 预检请求的有效期
    }

    // 3. 静态资源映射 (Resource Handlers)
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 将 /uploads/** 的 URL 映射到服务器本地的绝对路径
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:/var/www/uploads/");
    }

    // 4. 视图控制器 (View Controllers) - 适合简单的页面跳转
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // 请求 / 路径时直接跳转到 index 视图，无需写 Controller 方法
        registry.addViewController("/").setViewName("index");
    }
}
```


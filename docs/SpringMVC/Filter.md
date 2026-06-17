# 过滤器

虽然 Spring 提供了拦截器（Interceptor）和 AOP（切面），但 Filter 依托于 Servlet 容器，处于请求的最外层。这种特殊的地理位置，决定了它在处理**全局性、系统级、与业务逻辑解耦**的场景时，具有不可替代的地位。

通常，在一个标准的 Spring Boot 项目中，以下几个核心场景几乎必然会用到 Filter：

## 认证与授权

这是 Filter 最重磅的舞台。著名的 **Spring Security** 核心原理就是一套由十几个 Filter 组成的过滤器链（FilterChain）。

如果你用过 **Spring Security** 或 **Shiro**，你会发现它们无一例外都是基于 **Filter 链（Filter Chain）** 实现的。

Spring Security 的核心就是 `SecurityFilterChain`。既然官方和主流框架都把认证放在 Filter 层，那么遵循这个规范，将 JWT/Token 的解析和上下文构建，放在 Filter 中就是最顺理成章的选择。

::: tip

拦截器也可以去处理Token。这并不是一个非黑即白的绝对选择，而是取决于你的**系统架构、安全框架**以及**对性能的要求**。

:::



## 跨域处理

虽然 Spring 提供了 `@CrossOrigin` 注解，但在前后端分离（如 Vue + Java）的架构中，最彻底、最不容易出 Bug 的跨域解决方案依然是在 Filter 层配置 `CorsFilter`。

**原因：** 跨域的 `OPTIONS` 预检请求需要尽早被响应。如果在 Filter 层就允许跨域并返回 200，请求就不会白白走到后面的业务代码里。



## 日志记录

记录每一个进入系统的 HTTP 请求的详细信息（URL、请求方法、客户端 IP、执行耗时等）。

**原因：** 在 Filter 中可以通过 `System.currentTimeMillis()` 轻松计算出整个 HTTP 请求从进来至出去的总耗时，这是最精准的系统监控指标。

## 安全防御

- **XSS 过滤：** 通过 Filter 拦截请求，重写 `HttpServletRequest`，对所有输入的参数进行 HTML 转义，防止 XSS 注入攻击。

- **请求体可重复读取：** 默认的 `HttpServletRequest` 的输入流（InputStream）只能读取一次。在 Filter 中可以使用 `ContentCachingRequestWrapper` 对请求体进行缓存，这样后面的 Interceptor 或 Controller 就能重复读取 Body 数据（这在打印请求参数日志时非常有用）。



## 为什么不全用拦截器

| **特性**     | **Filter (过滤器)**                                        | **Interceptor (拦截器)**                                     |
| ------------ | ---------------------------------------------------------- | ------------------------------------------------------------ |
| **所属框架** | Servlet 容器（Tomcat 级别）                                | Spring MVC 框架级别                                          |
| **执行时机** | 在进入 `DispatcherServlet` **之前**和**之后**              | 在进入 `Controller` **之前**和**之后**                       |
| **核心能力** | **可以操纵 Request / Response 对象**（如包装、替换输入流） | 无法替换 Request/Response，但能获取到目标 Controller 的方法信息（Method） |
| **适用场景** | 权限控制、跨域、XSS 过滤、全局性能监控                     | 业务级别的Token解析、防重复提交、单接口权限粒度控制          |
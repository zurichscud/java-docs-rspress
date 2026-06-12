# RequestContextHolder

`RequestContextHolder` 是 Spring 提供的一个**全局静态生命周期管理器**。它的核心作用是：**让你在系统的任何地方（哪怕是深深的 Service 层、Mapper 层或工具类中），都能随时随地一键捞出当前的 `HttpServletRequest` 和 `HttpServletResponse`。**

## 核心工作原理：魔术背后的 `ThreadLocal`

在传统的 Servlet 开发中，如果你想在 Service 层拿到请求头里的 Token，你必须把 `HttpServletRequest` 作为参数，从 Controller 一层一层往下传。这种做法极其优雅，被称为“代码污染”。

Spring 为了解决这个问题，设计了 `RequestContextHolder`。它的底层依赖的是 **`ThreadLocal`**（线程局部变量）。

整个生命周期流程如下：

1. **请求到达**：当一个 HTTP 请求进入 Tomcat，Tomcat 会分配一个**工作线程**给它。
2. **Spring 拦截并注入**：请求经过 Spring 的 `DispatcherServlet` 或 `RequestContextFilter` 时，Spring 会把当前的 `Request` 和 `Response` 包装成一个 `ServletRequestAttributes` 对象，然后塞进 `RequestContextHolder` 的 `ThreadLocal` 里。
3. **任意层读取**：在这次请求的**同一个线程内**，任何代码调用 `RequestContextHolder.getRequestAttributes()`，都能精准拿到当前线程专属的请求数据。
4. **请求结束并清理**：当 Controller 执行完毕，响应返回给前端之前，Spring 会自动调用 `resetRequestAttributes()` **清理掉 `ThreadLocal`**，防止内存泄漏。
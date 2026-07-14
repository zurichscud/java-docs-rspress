# 拦截器

它主要用于在**请求到达 Controller 之前、之后，以及视图渲染完成之后**执行特定的通用逻辑。



## 接口方法

Spring 拦截器的生命周期包含三个核心方法

### preHandle

**`preHandle()`**：在请求到达 Controller **之前**执行。返回值是 `boolean`：

- `true`: 放行，继续执行下一个拦截器或 Controller。
- `false`: 拦截，请求到此为止。

只有 **`preHandle` 返回为 `true` 的拦截器**，它的 `afterCompletion` 才会被触发。任何拦截器的 `postHandle` 都**不会**被执行。

::: tip 场景：A 放行，B 拦截（返回 false）

1. **`Interceptor A.preHandle()`** -> 执行（返回 true）
2. **`Interceptor B.preHandle()`** -> 执行（返回 **false**，在此处请求被截断）
3. `Controller` -> ❌ 跳过，不执行
4. 所有拦截器的 `postHandle()` -> ❌ 跳过，不执行
5. `Interceptor B.afterCompletion()` -> ❌ 跳过（因为 B 没放行）
6. **`Interceptor A.afterCompletion()`** ->  执行（因为 A 之前放行了，需要让 A 清理资源）

:::

第三个参数 **`handler` 实际上就是“当前请求准备去调用的那个目标对象”**。

虽然它的声明类型是 `Object`，但根据请求的不同，它通常会被实例化为以下两种主要类型：

- `HandlerMethod` （最常见）

当你请求一个普通的 Controller 接口时，`handler` 的实际类型就是 `HandlerMethod`。

- **它包含了什么**：它包装了目标 **Controller 的 Bean 实例**、对应的 **Method 对象**、方法参数以及注解信息。

- **能用来做什么**：你可以通过强转来获取方法上的注解，从而做权限控制或日志记录。

```java
if (handler instanceof HandlerMethod) {
    HandlerMethod handlerMethod = (HandlerMethod) handler;
    // 获取目标 Controller 的类名
    String className = handlerMethod.getBeanType().getName();
    // 获取目标方法名
    String methodName = handlerMethod.getMethod().getName();
    
    // 比如：判断方法上有没有免登录注解 @NoAuth
    NoAuth noAuth = handlerMethod.getMethodAnnotation(NoAuth.class);
    if (noAuth != null) {
        return true; // 放行
    }
}
```

- `ResourceHttpRequestHandler` （静态资源）

当客户端请求的是**静态资源**（如 `/css/style.css`、`/js/app.js` 或图片）时，Spring 默认不会走 Controller 方法，而是由静态资源处理器来处理。此时 `handler` 的实际类型就是 `ResourceHttpRequestHandler`。



### postHandle

**`postHandle()`**：在 Controller 执行完毕**之后**，视图渲染**之前**执行。可以对 Controller 处理后的 `ModelAndView` 进行修改（但在 前后端分离架构中，这个方法用得相对较少）。

### afterCompletion

**`afterCompletion()`**：在**整个请求结束**（视图渲染完成后，或者准备返回 JSON 数据后）执行。通常用于**资源清理**（例如清除 `ThreadLocal` 中的用户信息）或**性能监控**（计算请求耗时）。



## 定义拦截器

实现 `HandlerInterceptor` 接口：

```java
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

@Component
public class LoginInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 1. 模拟从请求头获取 Token（前后端分离常用）
        String token = request.getHeader("Authorization");
        
        if (token != null && "valid-token".equals(token)) {
            // Token 有效，放行
            return true; 
        }
        
        // 2. Token 无效，拦截并返回 401 状态码
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\"code\": 401, \"msg\": \"未登录或 Token 已过期\"}");
        return false;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        // Controller 执行完后的逻辑
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        // 请求完全结束后的清理工作
    }
}
```

## 配置并注册拦截器

### 基本用法

实现 `WebMvcConfigurer` 接口并指定拦截哪些路径，排除哪些路径：

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private LoginInterceptor loginInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loginInterceptor)
                .addPathPatterns("/**")             // 拦截所有请求
                .excludePathPatterns(
                    "/api/auth/login",              // 排除登录接口
                    "/api/auth/register",           // 排除注册接口
                    "/static/**"                    // 排除静态资源
                );
    }
}
```

### 控制拦截器顺序

在 Spring Boot 中，拦截器的顺序默认取决于你**添加（注册）它们的先后顺序**。

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private LogInterceptor logInterceptor; // 日志拦截器
    
    @Autowired
    private AuthInterceptor authInterceptor; // 权限拦截器

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 先添加的先执行 preHandle
        registry.addInterceptor(logInterceptor)
                .addPathPatterns("/**");

        // 后添加的后执行 preHandle
        registry.addInterceptor(authInterceptor)
                .addPathPatterns("/api/**");
    }
}
```

如果你觉得靠代码的上下行顺序来决定执行先后不够稳妥，或者配置太复杂，可以使用 `.order()` 方法显式指定优先级。**数字越小，优先级越高（越先执行 `preHandle`）**：

```java
@Override
public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(logInterceptor).addPathPatterns("/**").order(1);  // 最外层
    registry.addInterceptor(authInterceptor).addPathPatterns("/**").order(2); // 内层
}
```



## 多个拦截器的执行顺序

在 Spring MVC 中，当系统配置了**多个拦截器**时，它们的执行顺序就像一个「栈」（Stack）。

假设我们配置了两个拦截器：**Interceptor A（先注册）** 和 **Interceptor B（后注册）**。当一个请求过来，且所有 `preHandle` 都返回 `true`（放行）时，完整的生命周期如下：

1. **`Interceptor A.preHandle()`** -> 执行（返回 true）
2. **`Interceptor B.preHandle()`** -> 执行（返回 true）
3. **`Controller`** -> 目标方法执行
4. **`Interceptor B.postHandle()`** -> 执行
5. **`Interceptor A.postHandle()`** -> 执行
6. **`视图渲染 / JSON 返回`**
7. **`Interceptor B.afterCompletion()`** -> 执行
8. **`Interceptor A.afterCompletion()`** -> 执行



>  在实际框架中，为了性能和方便管理，大家通常不用前面那种 `setNextHandler` 的链表方式了，而是用一个数组把所有拦截器装起来，通过下标循环来实现责任链。

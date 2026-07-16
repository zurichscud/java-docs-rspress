# 拦截器

它主要用于在**请求到达 Controller 之前、之后，以及视图渲染完成之后**执行特定的通用逻辑。





## 定义拦截器

实现 `HandlerInterceptor` 接口中的相关方法即可：

### preHandle

在请求到达 Controller **之前**执行。返回值是 `boolean`：

- `true`: 放行，继续执行下一个拦截器或 Controller。
- `false`: 拦截，请求到此为止。

只有 **`preHandle` 返回为 `true` 的拦截器**，它的 `afterCompletion` 才会被触发。任何拦截器的 `postHandle` 都**不会**被执行。

第三个参数 **`handler` 实际上就是“当前请求准备去调用的那个目标对象”**。虽然它的声明类型是 `Object`，但根据请求的不同，它通常会被实例化为以下两种主要类型：

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

在 Controller 执行完毕之后执行，如果preHandle返回false，任何拦截器的 `postHandle` 都**不会**被执行

### afterCompletion

在**整个请求结束执行。通常用于**资源清理（例如清除 `ThreadLocal` 中的用户信息）或性能监控。



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





## 拦截器原理

```java
class HandlerExecutionChain {
    // 1. 存放拦截器的数组（链条）
    private List<Interceptor> interceptors = new ArrayList<>();
    
    // 2. 目标业务处理器（比如你的 Vue 请求要去访问的 Controller）
    private Object handler;
    
    // 3. 核心指针：记录 preHandle 执行到了哪一步，用于逆序触发 afterCompletion
    private int interceptorIndex = -1;

    public HandlerExecutionChain(Object handler, List<Interceptor> interceptors) {
        this.handler = handler;
        this.interceptors = interceptors;
    }

    // 执行整个责任链流程
    public void execute(Request request, Response response) {
        Exception dispatchException = null;
        
        try {
            // 步骤一：正向执行所有拦截器的 preHandle
            if (!applyPreHandle(request, response)) {
                // 如果 preHandle 返回 false，说明被拦截了，直接拦截返回
                return; 
            }

            // 步骤二：所有拦截器放行后，执行真正的业务逻辑（Controller）
            executeHandler(handler, request, response);

            // 步骤三：逆向执行所有拦截器的 postHandle
            applyPostHandle(request, response);
            
        } catch (Exception ex) {
            dispatchException = ex; // 捕获业务或拦截器中的异常
        } finally {
            // 步骤四：无论成功还是失败，逆向执行已通过拦截器的 afterCompletion（清理资源）
            triggerAfterCompletion(request, response, dispatchException);
        }
    }

    // ================== 责任链的核心控制逻辑 ==================

    // 1. 正向传播
    private boolean applyPreHandle(Request request, Response response) {
        for (int i = 0; i < interceptors.size(); i++) {
            Interceptor interceptor = interceptors.get(i);
            
            // 执行当前拦截器的前置处理
            if (!interceptor.preHandle(request, response)) {
                // 如果被拦截，触发【已经通过的拦截器】的 afterCompletion
                triggerAfterCompletion(request, response, null);
                return false; 
            }
            // 关键：记录当前成功执行到的拦截器位置
            this.interceptorIndex = i; 
        }
        return true;
    }

    // 2. 逆向传播（postHandle）
    private void applyPostHandle(Request request, Response response) {
        // 从最后一个拦截器开始，倒序向前执行
        for (int i = interceptors.size() - 1; i >= 0; i--) {
            Interceptor interceptor = interceptors.get(i);
            interceptor.postHandle(request, response);
        }
    }

    // 3. 逆向收尾（afterCompletion）
    private void triggerAfterCompletion(Request request, Response response, Exception ex) {
        // 只对【已经成功执行了 preHandle】的拦截器，进行倒序的收尾处理
        for (int i = this.interceptorIndex; i >= 0; i--) {
            Interceptor interceptor = interceptors.get(i);
            try {
                interceptor.afterCompletion(request, response, ex);
            } catch (Exception e) {
                // 即使某个收尾方法报错，也要保证链条上其他收尾方法能执行完
                log("afterCompletion 报错", e); 
            }
        }
    }
}
```



### 拦截器执行顺序

> 假设存在A、B、C拦截器

根据上述的伪代码，我们可以得到多个拦截器执行顺序：

如果所有拦截器都顺利通过：

- 正向preHandler
- Controller
- 反向postHandler
- 反向afterCompletion

如果在拦截器Chain中，拦截器【C】拦截了

- 正向preHandler到被拦截的拦截器【C】
- 不会执行Handler、postHandler。
- 反向执行已成功执行的拦截器【B】的`afterCompletion`

## Example

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


# SecurityContextHolder

SecurityContext 是“存用户认证信息的对象”，SecurityContextHolder 是“访问这个对象的工具”。

## 定义

```java
public final class SecurityContextHolder {

    private static SecurityContextHolderStrategy strategy;


    public static SecurityContext getContext() {
        return strategy.getContext();
    }

    public static void setContext(SecurityContext context) {
        strategy.setContext(context);
    }
}
```



## 获取当前认证信息

```java
Authentication authentication =
    SecurityContextHolder
        .getContext()
        .getAuthentication();
```

## 设置认证信息

```java
SecurityContextHolder
    .getContext()
    .setAuthentication(authentication);
```



## SecurityContextHolderStrategy

Spring Security 官方内置了 **3 种标准策略**

| **策略标识 (strategyName)**       | **底层数据结构**         | **存储范围 / 隔离级别**                        | **最适用场景**                                               |
| --------------------------------- | ------------------------ | ---------------------------------------------- | ------------------------------------------------------------ |
| **`MODE_THREADLOCAL`** *(默认)*   | `ThreadLocal`            | **线程隔离**（当前线程独享）                   | 绝大多数传统的 Web 应用，一个请求由单个线程处理到底。        |
| **`MODE_INHERITABLETHREADLOCAL`** | `InheritableThreadLocal` | **父子线程继承**（子线程自动复制父线程上下文） | 简单的异步场景（如手写 `new Thread()` 或简单的 `@Async` 异步调用）。 |
| **`MODE_GLOBAL`**                 | 普通 `static` 静态变量   | **进程全局共享**（所有线程拿到同一个）         | 桌面客户端应用（如 Swing/JavaFX）、命令行工具或单用户独立的后台服务。 |

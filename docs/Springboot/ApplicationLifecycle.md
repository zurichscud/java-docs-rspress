# 应用生命周期

Spring Boot 在启动和关闭过程中，会发布一系列的 `SpringApplicationEvent`。我们可以通过实现 `SpringApplicationRunListener` 或使用 `@EventListener` / `ApplicationListener<T>` 来监听这些关键节点。

## 核心事件流向

| **触发顺序** | **核心事件 / 阶段**                                          | **作用与场景**                                               |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **1**        | `starting()` / `ApplicationStartingEvent`                    | 此时 Spring Boot 刚启动，**上下文（Context）还未创建**。适合做极其基础的早期初始化（如日志配置）。 |
| **2**        | `environmentPrepared()` / `ApplicationEnvironmentPreparedEvent` | 环境（`Environment`）已准备好（配置文件已加载），但上下文仍未创建。可以用来动态修改配置属性。 |
| **3**        | `contextPrepared()` / `ApplicationContextInitializedEvent`   | 上下文已创建，但 Bean 还没有被加载。                         |
| **4**        | `contextLoaded()` / `ApplicationPreparedEvent`               | Bean 定义（`BeanDefinition`）已加载，但**尚未实例化 Bean**。 |
| **5**        | **上下文刷新（Context Refresh）**                            | 此时 Spring 核心容器开始初始化所有的单例 Bean。              |
| **6**        | `started()` / `ApplicationStartedEvent`                      | 容器刷新完成，应用已启动，但 `CommandLineRunner` 等还未执行。 |
| **7**        | `ready()` / `ApplicationReadyEvent`                          | **最常用的事件**。应用已完全准备就绪，可以对外提供服务。适合做**缓存预热、启动定时任务**等。 |
| **8**        | `failed()` / `ApplicationFailedEvent`                        | 启动过程中发生异常时触发。                                   |

## 监听事件

由于此时上下文已经刷新完成，`@EventListener`方式只能监听到 `ApplicationStartedEvent` 和 `ApplicationReadyEvent`。

```java
@Component
public class AppLifecycleListener {

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        System.out.println("🚀 应用已完全就绪！可以开始预热缓存或执行初始化 SQL...");
    }
}
```


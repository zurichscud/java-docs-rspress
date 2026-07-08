# SpringApplicationRunListener

`SpringApplicationRunListener` 是 Spring Boot 启动流程中**最核心、最底层的生命周期监听接口**。

```java
public interface SpringApplicationRunListener {

    // 1. 刚执行 run() 方法，最早期，此时 Environment 和 Context 都还没创建
    default void starting(ConfigurableBootstrapContext bootstrapContext) {}

    // 2. Environment（配置文件、环境变量等）已经准备好，但 Context 还没创建
    default void environmentPrepared(ConfigurableBootstrapContext bootstrapContext, 
                                     ConfigurableEnvironment environment) {}

    // 3. ApplicationContext 已经创建，但还未加载 Bean 定义
    default void contextPrepared(ConfigurableApplicationContext context) {}

    // 4. Bean 定义（BeanDefinition）已加载完毕，但 Bean 还没有开始实例化（还没 Refresh）
    default void contextLoaded(ConfigurableApplicationContext context) {}

    // 5. 容器刷新完毕（Bean 已全部实例化），应用已启动，但 CommandLineRunner 还没执行
    default void started(ConfigurableApplicationContext context, Duration timeTaken) {}

    // 6. 应用完全就绪，CommandLineRunner 执行完毕，可以对外提供服务了
    default void ready(ConfigurableApplicationContext context, Duration timeTaken) {}

    // 7. 启动过程中发生异常时触发
    default void failed(ConfigurableApplicationContext context, Throwable exception) {}
}
```

## 编写实现类

必须提供一个**包含两个参数的构造函数** `(SpringApplication, String[])`，否则 Spring Boot 无法通过反射实例化它。

```java
package com.example.listener;

import org.springframework.boot.ConfigurableBootstrapContext;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.SpringApplicationRunListener;
import org.springframework.core.env.ConfigurableEnvironment;

public class MyCustomRunListener implements SpringApplicationRunListener {

    // 必须保留这个构造函数
    public MyCustomRunListener(SpringApplication application, String[] args) {
        // 初始化逻辑
    }

    @Override
    public void starting(ConfigurableBootstrapContext bootstrapContext) {
        System.out.println(">>> [MyCustomRunListener] 核心容器准备启动，最早的节点！");
    }

    @Override
    public void environmentPrepared(ConfigurableBootstrapContext bootstrapContext, ConfigurableEnvironment environment) {
        System.out.println(">>> [MyCustomRunListener] 配置文件已加载，当前激活的环境为: " 
                            + String.join(",", environment.getActiveProfiles()));
    }
}
```

## 通过 `spring.factories` 注册

在项目的 `src/main/resources/` 目录下创建 `META-INF/spring.factories` 文件，并配置如下内容：

```
org.springframework.boot.SpringApplicationRunListener=\
com.example.listener.MyCustomRunListener
```


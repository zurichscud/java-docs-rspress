# AOP



## 依赖引入

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

Spring Boot 的 `spring-boot-starter-aop` 依赖里，已经包含了 `spring-aop` 和 `aspectjweaver`。

## 配置

SpringBoot默认开启了 `@EnableAspectJAutoProxy`，不需要再显式指定了。


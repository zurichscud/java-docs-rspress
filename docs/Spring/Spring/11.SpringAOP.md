# Spring AOP

Spring AOP（面向切面编程，Aspect-Oriented Programming）是Spring框架提供的一种编程方式，用于在不修改业务逻辑代码的情况下，将横切关注点从业务逻辑中分离出来，例如日志记录、事务管理、权限检查等。

| 概念                    | 说明                                                         |
| ----------------------- | ------------------------------------------------------------ |
| **切面（Aspect）**      | 切入点+通知。每种模块增强就是一个单独的切面，例如日志切面、事务切面。 |
| **连接点（JoinPoint）** | 目标方法执行中的某个点。切点可以存在多个连接点               |
| **通知（Advice）**      | 切面在连接点上执行的动作。                                   |
| **切点（Pointcut）**    | 目标方法                                                     |
| **织入（Weaving）**     | 将切面应用到目标对象的过程。Spring AOP 是在运行时通过代理实现的（动态代理或CGLIB代理）。 |



## Spring 代理模式

- **JDK 动态代理**：基于接口，目标类实现了接口会生成代理类。
- **CGLIB 代理**：基于类继承，目标类没有接口时使用CGLIB。

> Spring 默认如果目标类实现接口优先使用JDK动态代理。



## Spring 开启AOP

AspectJ 提供更多高级能力和更全面的织入机制。spring-context 会帮助我们引入 spring-aop

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-aop</artifactId>
</dependency>
<dependency>
    <groupId>org.aspectj</groupId>
    <artifactId>aspectjweaver</artifactId>
</dependency>
```

```java
@Configuration
@EnableAspectJAutoProxy  // 开启 Spring AOP
public class AppConfig {
}
```

- Spring AOP 启用后（通过 `@EnableAspectJAutoProxy`），容器扫描 `@Aspect` 注解的类。

- Spring 读取 AspectJ 注解（例如 `@Before`, `@After`, `@Around`）。

- Spring 使用 JDK 动态代理或 CGLIB 生成代理对象，在方法调用时插入对应通知逻辑。

- 如果你只是普通的 POJO，没有被切面（AOP）增强，那么 Spring 创建的就是普通对象，不是代理。

- 当 Bean 被切面匹配时（如 `@Aspect` 或事务切面 `@Transactional`），Spring 会生成代理对象来增强原始 Bean 的方法。

- Spring 默认只在必要时才创建代理。

## Springboot开启AOP

Spring Boot 的 `spring-boot-starter-aop` 依赖里，自动包含了 `spring-aop` 和 `aspectjweaver`。并且默认会开启 `@EnableAspectJAutoProxy`，所以在 Spring Boot 中写 AOP 切面可以“开箱即用”。


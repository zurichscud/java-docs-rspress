

# 注解创建Bean

## @Configuration

### 基本作用

`@Configuration` 用来**标识一个类是配置类**，本质上相当于以前的 XML 配置文件。

被 `@Configuration` 标注的类，会被 Spring 容器当作“配置中心”，在启动时使用`AnnotationConfigApplicationContext`加载并创建IOC容器。

### 配合@Bean

在配置类中，可以通过 `@Bean` 方法向 Spring 容器中注册对象（Bean）。

```java
@Configuration
public class AppConfig {

    @Bean
    public UserService userService() {
        return new UserService();
    }
}
```

相当于 XML：

```xml
<bean id="userService" class="com.xxx.UserService"/>
```

::: tip 单例保证

Spring 会对 `@Configuration` 类进行CGLIB代理，保证`@Bean` 方法只会执行一次（单例），因此建议在配置类中使用`@Bean`。在@Component中使用`@Bean`标注的方法不会被代理。

:::

## @Bean

当你使用 `@Bean` 时，Spring 会在**容器启动时**调用该方法，并将其返回的对象注册为一个 Bean。它通常在标注了 `@Configuration` 的类中使用，本质上是把一个普通的方法变成了一个生产 Bean 的工厂方法。

```java
@Target({ElementType.METHOD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Bean {
    @AliasFor("name")
    String[] value() default {};

    @AliasFor("value")
    String[] name() default {};

    boolean autowireCandidate() default true;

    String initMethod() default "";

    String destroyMethod() default "(inferred)";
}
```



- 默认情况下，Bean 的 ID 就是**方法名**。

```java
@Configuration
public class AppConfig {

    @Bean
    public MyService myService() {
        return new MyServiceImpl();
    }
}
```

- 如果你的 Bean 需要依赖其他对象，可以直接把依赖项作为方法参数。Spring 会自动从容器中寻找对应的 Bean 并注入。

```java
@Bean
public MyController myController(MyService myService) { // Spring 会自动注入 myService
    return new MyController(myService);
}
```



| **特性**     | **@Bean**                                              | **@Component**                 |
| ------------ | ------------------------------------------------------ | ------------------------------ |
| **作用对象** | 标注在**方法**上。                                     | 标注在**类**上。               |
| **使用场景** | 当你需要引用**第三方库**的类（无法在源码上加注解）时。 | 用于你**自己编写**的业务代码。 |



## @ComponentScan

### 基础语法

**指定包扫描路径**，让 Spring 自动发现并注册 Bean 到 IOC 容器中。

```java
@ComponentScan("com.example.service")
```

当你没有在 `@ComponentScan` 中指定任何路径时，Spring 的默认行为是：**以标注了该注解的类所在的包（Package）作为扫描的根路径。**

### 扫描过程

1. 根据 `@ComponentScan` 确定扫描哪些包
2. 扫描这些包下的所有类
3. 找出带有组件注解的类（包括 `@Configuration`）
4. 全部注册到 IOC 容器

::: warning

`@Configuration`本质上也是一个 `@Component`，能不能生效，取决于：**是否被 `@ComponentScan` 扫描到**。

:::

## @Component

- @Component
- @Controller
- @Service
- @Repository



```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface Controller {

	/**
	 * The value may indicate a suggestion for a logical component name,
	 * to be turned into a Spring bean in case of an autodetected component.
	 * @return the suggested component name, if any (or empty String otherwise)
	 */
	@AliasFor(annotation = Component.class)
	String value() default "";//value的默认值是空字符。Spring会使用当前类的小写名字作为id

}
```

## @Import

`@Import` 是 **Spring 中用于向容器导入组件（Bean）的注解**。
 它通常写在 **`@Configuration` 配置类上**，作用是 **把指定的类注册到 Spring 容器中**，相当于手动把 Bean 加入容器。

使用`@Import`注册成为的bean的名字默认为全类名

```java
@Configuration
@Import(UserService.class)
public class AppConfig {
}
```

## @ImportResource

`@ImportResource` 是 **Spring 用来导入 XML 配置文件的注解**。**把 XML 中定义的 Bean 加载到当前 Spring 容器中**。

```java
@Configuration
@ImportResource("classpath:beans.xml")
public class AppConfig {
}
```

- beans.xml

```xml
<beans>
    <bean id="userService" class="com.demo.UserService"/>
</beans>
```


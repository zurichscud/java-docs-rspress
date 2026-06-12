# Spring容器

Spring容器可以理解为`ApplicationContext`，获取ApplicationContext可以根据如下类获取

## 获取ApplicationContext

### ClassPathXmlApplicationContext

用于从类路径下加载 XML 配置文件并初始化容器

```java [beans.xml]
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
           http://www.springframework.org/schema/beans
           https://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userService" class="com.example.UserService"/>
    
</beans>
```

- 加载单个XML文件

```java
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class MainApp {
    public static void main(String[] args) {
        // 从类路径加载 XML 配置
        ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");

        // 获取 Bean
        UserService userService = (UserService) context.getBean("userService");
        userService.doSomething();
    }
}
```

- 加载多个XML文件

```java
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class MainApp {
    public static void main(String[] args) {
        // 直接传多个 XML 文件路径
        ApplicationContext context = new ClassPathXmlApplicationContext(
            "beans1.xml", "beans2.xml", "beans3.xml"
        );

        UserService userService = context.getBean(UserService.class);
        OrderService orderService = context.getBean(OrderService.class);

        userService.doSomething();
        orderService.processOrder();
    }
}
```



::: danger

在 Spring 中，**多个 XML 文件中 Bean 的 ID 不可以重复**，即使是分布在不同的 XML 文件里，只要最终被同一个 `ApplicationContext` 加载，它们的 ID 就必须唯一，否则容器会抛出异常。

:::

### FileSystemXmlApplicationContext

`FileSystemXmlApplicationContext`和 `ClassPathXmlApplicationContext` 类似，但它从 **文件系统（磁盘路径）** 加载 XML，而不是类路径。适合在项目外部或者指定绝对路径的 XML 配置场景。该方式较少使用

```java
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.FileSystemXmlApplicationContext;

public class MainApp {
    public static void main(String[] args) {
        // 通过文件系统路径加载 XML 配置
        ApplicationContext context = new FileSystemXmlApplicationContext(
            "D:/spring-config/beans.xml"
        );

        UserService userService = context.getBean(UserService.class);
        userService.doSomething();
    }
}
```



### AnnotationConfigApplicationContext

如果你已经有了一个 `@Configuration` 配置类，可以通过 **Annotation 方式**创建 IoC 容器。

```java
@Configuration
@ComponentScan("com.demo")
public class AppConfig {
}
```

```java
ApplicationContext context =
        new AnnotationConfigApplicationContext(AppConfig.class);
```



## ApplicationContext

| 方法                                          | 说明                    |
| --------------------------------------------- | ----------------------- |
| `getBean(String name)`                        | 根据 Bean 名称获取 Bean |
| `getBean(Class<T> requiredType)`              | 根据类型获取 Bean       |
| `getBean(String name, Class<T> requiredType)` | 根据名称和类型获取 Bean |
| `containsBean(String name)`                   | 是否包含指定名称的 Bean |
| `isSingleton(String name)`                    | 判断 Bean 是否是单例    |
| `isPrototype(String name)`                    | 判断 Bean 是否是原型    |
| `getType(String name)`                        | 获取 Bean 的类型        |
| `getAliases(String name)`                     | 获取 Bean 的别名列表    |
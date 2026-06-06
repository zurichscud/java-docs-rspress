# QuickStart



## Spring XML文件

Spring XML 中声明的 `<bean>` **通常没有严格的书写顺序要求**，因为 Spring 会先解析整个配置文件，再统一创建和装配 Bean。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
           http://www.springframework.org/schema/beans
           https://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userService" class="com.example.UserService"/>
    
</beans>
```

- id：bean的唯一标识也称为`name`
- class：全类名

## Spring与控制反转

Spring实现了控制反转这种设计模式，Spring可以帮助我们管理bean的创建和处理Bean之间的关系。

## Spring与依赖注入

控制反转有多种实现，Spring采用的是依赖注入实现控制反转

Spring通过依赖注入的方式完成了Bean的管理，通过注入让对象与对象之间产生关系

Spring的依赖注入存在两种方式：

- set注入
- 构造器注入

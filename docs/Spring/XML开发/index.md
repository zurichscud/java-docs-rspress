
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
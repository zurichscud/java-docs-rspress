# QuickStart

```
IoC（控制反转）
    ↓ 实现思想
DI（依赖注入）
    ↓ 实现方式
Autowiring（自动装配）
    ↓ Spring具体机制
完成DI
```



## Spring与控制反转

IoC（Inversion of Control）是一种设计思想。

Spring实现了控制反转这种设计模式，Spring可以帮助我们管理bean的创建和处理Bean之间的关系。

## Spring与依赖注入

控制反转有多种实现，Spring采用的是依赖注入实现控制反转

## Spring与自动装配

自动装配是 Spring 提供的具体能力。用于实现依赖注入

### 构造器注入

```java
public OrderService(UserService userService) {
    this.userService = userService;
}
```

### Setter注入
```java
@Autowired
public void setUserService(UserService userService) {
    this.userService = userService;
}
```

### 字段注入
```java
@Autowired
private UserService userService;
```
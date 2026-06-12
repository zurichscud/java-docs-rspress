# Bean的生命周期

被Spring管理的Bean遵循着统一的生命周期


## 1.实例化

Spring 通过构造方法创建对象（还没注入属性）

只是一个“空壳对象”

## 2.属性赋值

- 进行依赖注入（DI）

- 比如 `@Autowired`、`@Value`

## 3.初始化

按顺序执行：

1. 注解方式：`@PostConstruct`
2. 接口方式：如果实现了`InitializingBean`，将调用`afterPropertiesSet`方法
3. XML方式： `init-method`

```java
public class UserService {

    public void init() {
        System.out.println("Bean 初始化方法执行");
    }

    public void destroy() {
        System.out.println("Bean 销毁方法执行");
    }
}
```

```xml
<bean id="userService"
      class="com.example.UserService"
      init-method="init"
      destroy-method="destroy"/>
```



## 4.使用

Bean已经提供业务使用

## 5.销毁

容器关闭时执行：

1. 注解方式：`@PreDestroy`
2. 接口方式：如果实现了`DisposableBean`，将调用`destroy`方法
3. XML方式： `destroy-method`

```xml
<bean id="userService"
      class="com.example.UserService"
      init-method="init"
      destroy-method="destroy"/>
```


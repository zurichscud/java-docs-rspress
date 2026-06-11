# Bean的生命周期

被Spring管理的Bean遵循着统一的生命周期

## 基本生命周期

### 1.实例化

Spring 通过构造方法创建对象（还没注入属性）

只是一个“空壳对象”

### 2属性赋值

- 进行依赖注入（DI）

- 比如 `@Autowired`、`@Value`

### Aware 接口

让 Bean 在创建过程中“拿到 Spring 容器的环境参数”。

| 接口                    | 作用             |
| ----------------------- | ---------------- |
| BeanNameAware           | 获取 Bean 的名字 |
| BeanFactoryAware        | 获取 BeanFactory |
| ApplicationContextAware | 获取容器上下文   |
| EnvironmentAware        | 获取环境变量     |
| ResourceLoaderAware     | 获取资源加载器   |

例如我想让user这个bean在创建时感知Spring环境，就可以让User实现Aware接口。
```java
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanNameAware;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class User implements BeanNameAware, ApplicationContextAware {

    private String name;

    private String beanName;
    private ApplicationContext applicationContext;

    public User(String name) {
        this.name = name;
    }

    @Override
    public void setBeanName(String name) {
        this.beanName = name;
        System.out.println("当前 BeanName：" + name);
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
        System.out.println("拿到了 Spring 容器：" + applicationContext.getDisplayName());
    }

    public void show() {
        System.out.println("user name = " + name);
        System.out.println("beanName = " + beanName);

        // 从容器中获取自己（演示用）
        User self = applicationContext.getBean(beanName, User.class);
        System.out.println("从容器拿到自己：" + self);
    }
}
```

一般不推荐业务代码使用 Aware。

### 3.初始化

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



### 4.使用

Bean已经提供业务使用

### 5.销毁

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



## BeanPostProcessor

 **BeanPostProcessor 是 Spring 在 Bean 初始化前后提供的“拦截增强器”**，注意会拦截所有Bean的初始化，这是**全局**的。

接口定义：

```java
public interface BeanPostProcessor {

    Object postProcessBeforeInitialization(Object bean, String beanName);

    Object postProcessAfterInitialization(Object bean, String beanName);
}
```

**我们只需要自己实现一个类，然后交给 Spring 容器管理，让它在所有 Bean 初始化前后“插一脚”**。

```java
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.stereotype.Component;

@Component
public class SimpleBeanPostProcessor implements BeanPostProcessor {

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("初始化前：" + beanName);
        return bean;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("初始化后：" + beanName);
        return bean;
    }
}
```



## InitializingBean

接口方式的局部Bean初始化方法

```java
public interface InitializingBean {
    void afterPropertiesSet() throws Exception;
}
```

使用：

```java
import org.springframework.beans.factory.InitializingBean;

public class UserService implements InitializingBean {

    private String name;

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public void afterPropertiesSet() {
        System.out.println("InitializingBean 初始化方法执行");
        System.out.println("name = " + name);
    }
}
```



## DisposableBean

接口方式的局部Bean销毁方法

```java
public interface DisposableBean {
    void destroy() throws Exception;
}
```

使用：

```java
import org.springframework.beans.factory.DisposableBean;

public class UserService implements DisposableBean {

    @Override
    public void destroy() {
        System.out.println("UserService 销毁方法执行");
    }

}
```

## Java生命周期规范

Java生命周期是规范（API、注解、接口）

### @PostConstruct

初始化后执行

`@PostConstruct` 是 Java 提供的一个**生命周期注解**，表示：“当 Bean 创建完成，并且依赖注入完成后，自动执行的方法”。

```java
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    public UserService() {
        System.out.println("构造方法执行");
    }

    @PostConstruct
    public void init() {
        System.out.println("PostConstruct 执行");
    }
}
```

### @PreDestroy

对象销毁前执行。

```java
@PreDestroy
public void destroy() {
}
```


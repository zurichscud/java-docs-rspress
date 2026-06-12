# Java生命周期规范

Java生命周期是规范（API、注解、接口）

## @PostConstruct

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

## @PreDestroy

对象销毁前执行。

```java
@PreDestroy
public void destroy() {
}
```


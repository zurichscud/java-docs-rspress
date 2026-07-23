# SecurityContext

定义了一个数据容器

## 接口定义

它本身很简单，只保存一个东西：Authentication

```java
public interface SecurityContext extends Serializable {

    Authentication getAuthentication();

    void setAuthentication(Authentication authentication);

}
```

定义成一个接口是为了解决Java无法多继承的问题

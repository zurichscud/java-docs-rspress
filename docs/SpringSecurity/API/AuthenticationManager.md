# AuthenticationManager

## 接口定义

```java
public interface AuthenticationManager {

  //给我一个未认证的 Authentication，我帮你认证，返回已认证的 Authentication。
    Authentication authenticate(Authentication authentication)
            throws AuthenticationException;

}
```



## ProviderManager

ProviderManager 是 AuthenticationManager 的默认实现


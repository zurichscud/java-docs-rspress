# AuthenticationManager

## 接口定义

```java
public interface AuthenticationManager {

    Authentication authenticate(Authentication authentication)
            throws AuthenticationException;

}
```

给我一个未认证的 Authentication，我帮你认证，返回已认证的 Authentication。

## ProviderManager

ProviderManager 是 AuthenticationManager 的默认实现

```java
AuthenticationManager
          |
          ↓
ProviderManager
```


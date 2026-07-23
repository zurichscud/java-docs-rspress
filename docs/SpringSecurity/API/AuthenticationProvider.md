# AuthenticationProvider

> 提供认证方法

## 接口定义

Spring Security 不规定你必须怎么认证：

```java
public interface AuthenticationProvider {

    Authentication authenticate(Authentication authentication)
            throws AuthenticationException;

    boolean supports(Class<?> authentication);

}
```

它只是定义：

- 能不能处理这种 Authentication
- 怎么认证

## DaoAuthenticationProvider

DaoAuthenticationProvider 是官方提供的实现之一。DAO = Data Access Object。表示：通过数据访问方式获取用户信息。

具体逻辑：

1. **查库**：它会调用你写的 `MyCustomUserDetailsService.loadUserByUsername(username)`。
2. **获取UserDetails**：你的 Service 去数据库查到了正确的用户名和**加密后的密码密文**，并包装成 `UserDetails` 返回给 Provider。
3. **核对密码**：DaoAuthenticationProvider 调用 `PasswordEncoder.matches(用户输入的明文密码, 数据库的密文密码)`。

## 自定义认证方式

你可以自己实现AuthenticationProvider接口，满足自己系统的认证方式，例如：

- 微信认证：WechatAuthenticationProvider

- JWT：JwtAuthenticationProvider

- 短信验证码：SmsAuthenticationProvider

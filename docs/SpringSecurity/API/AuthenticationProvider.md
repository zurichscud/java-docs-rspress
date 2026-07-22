# AuthenticationProvider

> 用户名密码认证

## DaoAuthenticationProvider

DaoAuthenticationProvider 是 `AuthenticationProvider` 的一个常用实现

DaoAuthenticationProvider 是官方提供的实现之一。

`DaoAuthenticationProvider`将调用 `PasswordEncoder.matches(明文, 密文)` 进行密码比对。


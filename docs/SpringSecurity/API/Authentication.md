# Authentication

> 认证信息： 表示“当前是谁，以及是否已经通过认证”。

## 接口定义

```java
public interface Authentication extends Principal, Serializable {

    // 用户权限，如 ROLE_ADMIN
    Collection<? extends GrantedAuthority> getAuthorities();

    // 证明主体有效的凭证，如密码、token，认证成功后通常置为 null
    Object getCredentials();

    // 认证请求的附加信息，如 IP 地址、Session ID
    Object getDetails();

    // 被认证的主体身份，通常返回 UserDetails 对象
    Object getPrincipal();

    // 是否已通过认证
    boolean isAuthenticated();

    // 设置认证状态，通常由框架内部调用，不应手动使用
    void setAuthenticated(boolean isAuthenticated);

}
```

## UsernamePasswordAuthenticationToken

`UsernamePasswordAuthenticationToken` 是 `Authentication` 接口最常用的实现类，用于封装用户名/密码形式的认证信息。

`UsernamePasswordAuthenticationToken` 有两个构造方法：

- 设置为未认证状态：调用后`authenticated = false`

```java
public UsernamePasswordAuthenticationToken(
        Object principal,
        Object credentials
)
```

- 设置为已认证状态：调用后`authenticated = true`

```java
public UsernamePasswordAuthenticationToken(
        Object principal,
        Object credentials,
        Collection<? extends GrantedAuthority> authorities
)
```


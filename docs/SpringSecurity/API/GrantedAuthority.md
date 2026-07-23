# GrantedAuthority

`GrantedAuthority`（已授予的权限）是 Spring Security 中**用来表示用户拥有什么“权限”或“角色”的核心接口**。

## 定义

```java
public interface GrantedAuthority extends Serializable {
    // 返回权限的字符串表示形式（如 "sys:user:add" 或 "ROLE_ADMIN"）
    String getAuthority();
}
```



## SimpleGrantedAuthority

Spring Security 默认提供了一个最简实现类 `SimpleGrantedAuthority`，它只是简单地封装了一个字符串：

```java
// 构造一个权限
GrantedAuthority authority = new SimpleGrantedAuthority("sys:user:add");

// 构造一个角色（注意 ROLE_ 前缀）
GrantedAuthority role = new SimpleGrantedAuthority("ROLE_ADMIN");
```



## 角色（Role）与权限（Permission）的区别

在实际开发中，我们常区分“角色”（如管理员、普通用户）和“细粒度权限”（如新增用户、删除用户），但在 Spring Security 眼里，**它们都是 `GrantedAuthority`，本质上没有任何区别，都是字符串**。

| **类型**        | String                            | **对应 SpEL 表达式**           | **说明**                                             |
| --------------- | --------------------------------- | ------------------------------ | ---------------------------------------------------- |
| **细粒度权限**  | `"sys:user:add"` 或 `"user:read"` | `hasAuthority('sys:user:add')` | 明确指定操作权限                                     |
| **角色 (Role)** | `"ROLE_ADMIN"` 或 `"ROLE_USER"`   | `hasRole('ADMIN')`             | `hasRole('ADMIN')` 会自动补全前缀查找 `"ROLE_ADMIN"` |



- **对于开发者：** 只需要在数据库存好权限字符串（如 `sys:user:add`），在登录拦截时转成 `SimpleGrantedAuthority` 塞给 Spring Security。

- **对于 Spring Security：** 它不管底层架构多复杂，鉴权时只负责比对 `GrantedAuthority.getAuthority()` 拿到的字符串是否匹配。


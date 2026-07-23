# UserDetails

> 用户信息



## 接口定义

```java
public interface UserDetails extends Serializable {

    Collection<? extends GrantedAuthority> getAuthorities();

    String getPassword();

    String getUsername();

    default boolean isAccountNonExpired() {
        return true;
    }

    default boolean isAccountNonLocked() {
        return true;
    }

    default boolean isCredentialsNonExpired() {
        return true;
    }

    default boolean isEnabled() {
        return true;
    }
}
```



## Example

开发者可以定义实现类向SpringSecurity提供用户信息

```java
public class LoginUser implements UserDetails {

    private User user; // 数据库用户实体
    private List<String> permissions; // 数据库查出的权限标识，如 ["sys:user:add", "sys:user:edit"]

    // 核心方法：向 Spring Security 提供当前用户的权限集合
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (permissions == null) {
            return Collections.emptyList();
        }
        // 将 List<String> 转为 Collection<GrantedAuthority>
        return permissions.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() { return user.getPassword(); }
    @Override
    public String getUsername() { return user.getUsername(); }
    // 其他 UserDetails 接口方法...
}
```


# UserDetailsService

> 查询用户

```java
package com.example.security;

import com.example.entity.SysUser;
import com.example.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyCustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserMapper userMapper; // 注入你的 MyBatis Mapper 或 JPA Repository

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        
        // 1. 拿着前端输入的 username，直接去数据库的 sys_user 表里查数据
        SysUser user = userMapper.selectByUsername(username);
        
        // 2. 如果数据库里根本没有这个用户名，直接抛出异常
        if (user == null) {
            // 这个异常会被 Spring Security 的 Provider 捕获，并最终转为“用户名或密码错误”提示前端
            throw new UsernameNotFoundException("用户名不存在");
        }
        
        // 3. 查到了就直接把这个对象返回！
        // 此时这个 user 对象里面包含了从数据库查出来的【正确加密密码】（比如 $2a$10$...）
        //省略了SysUser->UserDetails的过程
        return user; 
    }
}
```

## 返回值处理

你可能好奇：“这里只看到了根据用户名查库，我前端传过来的密码是在哪儿校验的呢？”

答案是：**不需要你写代码去比对。**

当你把上面的 `user` 对象 `return` 出去之后，Spring Security 的核心组件 `DaoAuthenticationProvider` 会自动接管后面的事：

1. 拿到你 `return` 的 `user` 对象里的**数据库密文**。
2. 拿到前端输入的**明文密码**。
3. 自动调用 `PasswordEncoder.matches(明文, 密文)` 进行比对。

所以，这个 Service 的定位非常纯粹，就是一个“数据库资料提取器”。


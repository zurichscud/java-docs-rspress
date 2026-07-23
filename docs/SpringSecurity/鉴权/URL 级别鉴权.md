## URL 级别鉴权

在 Security 配置类中统一配置 HTTP 路由的访问规则：

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/public/**").permitAll() // 所有人可访问
            .requestMatchers("/admin/**").hasRole("ADMIN") // 仅 ADMIN 角色
            .requestMatchers("/user/add").hasAuthority("sys:user:add") // 需要特定按钮/接口权限
            .anyRequest().authenticated() // 其他请求必须登录
        );
    return http.build();
}
```


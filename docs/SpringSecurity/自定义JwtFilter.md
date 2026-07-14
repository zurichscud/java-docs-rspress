# 自定义JwtFilter

> 整个落地过程分为两个核心部分：生成 JWT 和 解析 JWT（过滤器）。



## JwtAuthenticationFilter

在标准的 Spring Security 架构中，我们通常会把自己写的 JwtTokenFilter插进 Spring Security 的过滤器链中（通常在 `UsernamePasswordAuthenticationFilter`之前）。每次请求进来时，先拦截下来解析 Token：

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private MyCustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        // 1. 从请求头中获取 Authorization 字段
        String token = request.getHeader("Authorization");
        
        // 2. 判断 Token 是否合法（通常前后端约定以 "Bearer " 开头）
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7); // 截取掉 "Bearer " 得到真正的 token
            
            try {
                // 3. 解析 Token，从中获取用户名
                String username = JwtUtil.getUsernameFromToken(token);
                
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    // 4. 重新去数据库查一下这个用户（确保用户依然有效）
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    
                    // 5. 关键：手动构建一个“已认证”的令牌对象
                    UsernamePasswordAuthenticationToken authentication = 
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    
                    // 6. 塞入 Spring Security 的上下文中。
                    // 这样，后面的过滤器（如 AuthorizationFilter）就会认为这个请求已经是登录状态了！
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception e) {
                // Token 解析失败（过期、伪造等），直接放行或抛出异常。放行后后面的过滤器也会拦截它
            }
        }
        
        // 继续走过滤器链中的下一个过滤器
        filterChain.doFilter(request, response);
    }
}
```

## 注册JwtAuthenticationFilter

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // ... 其他配置 (如 csrf, authorizeHttpRequests 等)
            
            // 将 JWT 过滤器放在 UsernamePasswordAuthenticationFilter 之前
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
```

- **`addFilterBefore(filter, class)`**：把自定义过滤器放在某个标准过滤器**之前**（最常用）。
- **`addFilterAfter(filter, class)`**：把自定义过滤器放在某个标准过滤器**之后**。
- **`addFilterAt(filter, class)`**：把自定义过滤器放在和某个标准过滤器**相同的位置**（注意：这并不会替换原过滤器，只是它们俩的顺序变成随机/依赖注册顺序，通常不推荐，除非你手动关闭了原过滤器）。

## AuthenticationSuccessHandler

我们通过自定义一个 `AuthenticationSuccessHandler`（认证成功处理器），在密码匹配成功后被自动触发。

```java
@Component
public class LoginSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, 
                                        HttpServletResponse response, 
                                        Authentication authentication) throws IOException, ServletException {
        // 1. 从 authentication 中获取刚刚认证成功的用户主体
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        
        // 2. 生成 JWT Token（这里可以使用 JwtUtil 工具类，把用户名存进 Token）
        String token = JwtUtil.createToken(userDetails.getUsername());
        
        // 3. 组装成 JSON 格式返回给 Vue 前端
        response.setContentType("application/json;charset=UTF-8");
        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("msg", "登录成功");
        result.put("token", token); // Vue 拿到这个 token 后会存入 LocalStorage
        
        PrintWriter writer = response.getWriter();
        writer.write(new ObjectMapper().writeValueAsString(result));
        writer.flush();
    }
}
```


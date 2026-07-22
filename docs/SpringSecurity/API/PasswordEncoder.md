# PasswordEncoder

> 比较密码

- **你声明 Bean**：你在配置类（通常是继承了 `WebSecurityConfigurerAdapter`）中通过 `@Bean` 声明了 `BCryptPasswordEncoder`

  ```java
  @Bean
  public PasswordEncoder passwordEncoder(){
      return new BCryptPasswordEncoder();
  }
  ```

- **Spring 自动装配**：当 Spring Security 初始化 `DaoAuthenticationProvider` 时，它发现 Spring 容器中恰好有一个类型为 `PasswordEncoder` 的 Bean，就会**自动**把它注入（Autowired）到自己的内部属性中。

- 不要使用默认的`PasswordEncoder` ：`DelegatingPasswordEncoder`

  它要求数据库中存储的密码必须带有一个**大括号前缀 `{id}`**，用来指定这个密码是用什么算法加密的。

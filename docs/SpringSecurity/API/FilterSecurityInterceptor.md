# FilterSecurityInterceptor

在 Spring Security 6.x（伴随 Spring Boot 3.x）中，官方对底层架构进行了大幅度重构，FilterSecurityInterceptor已经被正式废弃并替换了。

```java
[FilterSecurityInterceptor] 
       │
       ├──> 1. 调用 SecurityMetadataSource (获取当前 URL 需要什么权限)
       │
       └──> 2. 调用 AuthenticationManager (确保用户已登录)
       │
       └──> 3. 调用 AccessDecisionManager (通过投票机制，决定是否放行)
                   │
                   └──> AccessDecisionVoter (具体投票器，如 RoleVoter)
```

- 当请求来到这里时，它先通过 `SecurityMetadataSource` 查到当前请求的 URL（比如 `/admin/`）需要什么权限（比如 `ROLE_ADMIN`）。
- 然后它把当前用户的认证信息和需要的权限一起提交给 **`AccessDecisionManager`（访问决策管理器）**。
- `AccessDecisionManager` 内部往往有一群 **`AccessDecisionVoter`（投票器）**。大家开始投票（一票否决、少数服从多数等策略），如果有权限就放行，没权限就抛出 `AccessDeniedException`。
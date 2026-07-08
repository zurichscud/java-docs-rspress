# @EnableWebMvc

在 Spring Boot 项目中，如果你在配置类上加了 `@EnableWebMvc` 注解，会引发一个非常经典的“配置全面失效”的现象。

它会全面接管 Spring MVC，导致 Spring Boot 针对 Web 的绝大多数自动化配置（Auto-configuration）完全失效。你需要自己完全配置`WebMvcConfigurer`。

在 Spring Boot 开发中，我们绝大多数时候**不需要**加 `@EnableWebMvc`。
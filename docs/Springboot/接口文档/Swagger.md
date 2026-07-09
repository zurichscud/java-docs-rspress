# Swagger

## Swagger/OpenAPI

 SmartBear公司开发了一套用于描述 RESTful API 的开源规范，当时它就叫 **Swagger Specification**（同时他们还开发了 Swagger UI 等配套工具）。

SmartBear 公司决定将这个“API 描述规范”捐赠给 Linux 基金会。为了表示这是一套行业公认的、开放的标准，该规范被正式更名为 **OpenAPI Specification (OAS)**。

- swagger 是基于 OpenAPI 规范开发出来的**一套具体工具**

- OpenAPI 是一份**纯文本的规范文档指南**。它规定了你应该用怎样的 JSON 或 YAML 格式来描述一个网页接口。



## Spring-fox

Spring-fox 曾经是 Spring Boot 2.x 时代的霸主（其最著名的依赖是 `springfox-swagger2` 和 `springfox-swagger-ui`）。但它有几个致命的痛点：

1. **项目断更**：官方团队在 2020 之后基本停止了维护。
2. **不兼容 Spring Boot 3**：Spring Boot 3.0 完成了向 `jakarta.*` 命名空间的迁移（抛弃了旧的 `javax.*`）。Spring-fox 因为停更，无法在 Spring Boot 3 上运行。
3. **各种小 Bug 无法解决**：例如在 Spring Boot 2.6+ 版本中，由于默认的路径匹配策略从 `AntPathMatcher` 变成了 `PathPatternParser`，导致 Spring-fox 直接报错，需要手动修改配置才能运行。



## Spring-doc

Spring-doc 是为了填补 Spring-fox 停更后的空白而诞生的。它是目前社区推荐的标准解决方案。

- **开箱即用**：只需引入一个 Starter 依赖，无需写任何 Java 配置类，访问 `/swagger-ui/index.html` 就能直接看到漂亮的文档界面。
- **原生支持 OpenAPI 3**：OpenAPI 3 是 Swagger 2 的升级版，结构更清晰，支持更复杂的对象定义以及更多样化的认证方式。
- **对 WebFlux 的支持**：Spring-doc 对响应式编程（WebFlux）的支持也远好于 Spring-fox。

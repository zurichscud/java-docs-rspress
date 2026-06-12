# MappingJackson2HttpMessageConverter

Spring Boot 中，它是最核心、最常用的消息转换器，底层依赖于著名的 Jackson 序列化框架。

## Usage

Spring Boot 的 spring-boot-starter-web 默认打包了 Jackson。但在纯 Spring MVC 中还是需要我们手动配置。

## Replacement

虽然 Spring Boot 默认集成了 Jackson，但如果你在项目中引入了其他的 JSON 库（比如阿里开源的 Fastjson 或 Google 的 Gson），你也可以通过自定义配置，将默认的 MappingJackson2HttpMessageConverter 替换为：

- FastJsonHttpMessageConverter（使用 Fastjson 库）

- GsonHttpMessageConverter（使用 Gson 库）

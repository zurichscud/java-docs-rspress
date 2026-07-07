# 自动配置以JSON框架为例

## 导入Gson

Springboot应用启动，Spring Boot会先在`spring-boot-autoconfigure`扫描`META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` 文件并注册成为bean。

 Spring Boot 官方源码里只内置了 Jackson、Gson 和 JSON-B 这三种 JSON 框架的自动车间。因此这三种JSON框架只需要导入依赖即可。

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-gson</artifactId>
</dependency>
```



```java
@Configuration(proxyBeanMethods = false)
class JacksonHttpMessageConvertersConfiguration {

    // ------------------------------------------------------
    // 1. Jackson 的自动注册车间
    // ------------------------------------------------------
    @Configuration(proxyBeanMethods = false)
    @ConditionalOnClass(ObjectMapper.class) // 条件 1：必须在类路径下能找到 ObjectMapper 类
    @ConditionalOnBean(ObjectMapper.class)  // 条件 2：Spring 容器里必须已经有了 ObjectMapper 的 Bean
    static class MappingJackson2HttpMessageConverterConfiguration {
        
        @Bean
        @ConditionalOnMissingBean(value = MappingJackson2HttpMessageConverter.class)
        // 只要你没手动注册过，它就自动帮你 new 一个注册进去
        public MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter(ObjectMapper objectMapper) {
            return new MappingJackson2HttpMessageConverter(objectMapper);
        }
    }

    // ------------------------------------------------------
    // 2. Gson 的自动注册车间
    // ------------------------------------------------------
    @Configuration(proxyBeanMethods = false)
    @ConditionalOnClass(Gson.class)         // 条件 1：必须在类路径下能找到 Gson 类
    @ConditionalOnBean(Gson.class)          // 条件 2：Spring 容器里必须已经有了 Gson 的 Bean
    static class GsonHttpMessageConverterConfiguration {

        @Bean
        @ConditionalOnMissingBean
        // 核心：只要你没手动注册过它，并且类路径里有 Gson 依赖，它就【自动】帮你 new 一个塞进容器！
        public GsonHttpMessageConverter gsonHttpMessageConverter(Gson gson) {
            return new GsonHttpMessageConverter(gson);
        }
    }
}
```

如果类路径（Classpath）下**同时存在** Jackson 和 Gson，Spring Boot 会**默认优先使用 Jackson**。

因为 `spring-boot-starter-web` 默认强制引入了 Jackson，当你直接加入 `spring-boot-starter-gson` 后，两者会共存。此时，Spring Boot 依然会把 Jackson 放在 HTTP 消息转换器列表的前面。

你不需要在 `pom.xml` 中使用 `<exclusions>` 去大费周折地排除 Jackson，只需要在配置文件中加一行配置，Spring Boot 就会自动把 Gson 的优先级提到最前面：

```properties
spring.mvc.converters.preferred-json-mapper=gson
```



## 导入FastJson2

### 方式一：使用spring-boot-starter

Spring Boot 官方并没有为 Fastjson2 写自动配置。如果你什么都不做，它不会像 Gson 那样自动注册。 

FastJSON 2 提供了专门的 Spring Boot Starter，引入后**零配置**即可生效。

```xml
<!-- Spring Boot 2.x -->
<dependency>
    <groupId>com.alibaba.fastjson2</groupId>
    <artifactId>fastjson2-extension-spring-boot-starter</artifactId>
    <version>2.0.53</version>
</dependency>

<!-- Spring Boot 3.x -->
<dependency>
    <groupId>com.alibaba.fastjson2</groupId>
    <artifactId>fastjson2-extension-spring-boot3-starter</artifactId>
    <version>2.0.53</version>
</dependency>
```

当你在 `pom.xml` 里引入了阿里的 spring-boot-starter依赖，Spring Boot 启动时会去扫描所有第三方 Jar 包里的 `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` 文件（Spring Boot 2.x 是 `spring.factories`）。

```java
//com.alibaba.fastjson2.support.spring6.autoconfigure.FastJsonAutoConfiguration
@Configuration
@ConditionalOnClass(JSON.class) // 1. 只要你引入了 Fastjson2 的 Jar 包
public class FastJsonAutoConfiguration {

    @Configuration
    @ConditionalOnWebApplication // 2. 并且当前是个 Web 项目
    static class FastJsonMvcConfiguration implements WebMvcConfigurer {

        @Override
        public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
            // 3. 阿里自己 new 了一个转换器
            FastJsonHttpMessageConverter converter = new FastJsonHttpMessageConverter();
            
            // 4. 重点：阿里直接把它强行塞进了 Spring MVC 的转换器队伍里
            // 甚至默认会把它插到第一位（index 0），直接抢走 Jackson 的饭碗！
            converters.add(0, converter); 
        }
    }
}
```

### 方式二：fastjson2-extension-spring5

```xml
<!-- fastjson2 核心 -->
<dependency>
    <groupId>com.alibaba.fastjson2</groupId>
    <artifactId>fastjson2</artifactId>
    <version>2.0.53</version>
</dependency>

<!-- Spring5/SpringBoot2 扩展包 -->
<dependency>
    <groupId>com.alibaba.fastjson2</groupId>
    <artifactId>fastjson2-extension-spring5</artifactId>
    <version>2.0.53</version>
</dependency>
```

由于 Spring Boot 不会自动帮你把 FastJson 装配进 `AbstractHttpMessageConverter` 的执行队列里，你需要写一个配置类，手动把它塞进去，并**提升它的优先级**。

```java
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {


    @Override
    public void extendMessageConverters(
            List<HttpMessageConverter<?>> converters) {

        FastJsonHttpMessageConverter converter =
                new FastJsonHttpMessageConverter();

        FastJsonConfig config = new FastJsonConfig();

        config.setDateFormat("yyyy-MM-dd HH:mm:ss");

        converter.setFastJsonConfig(config);

        converters.add(0, converter);
    }
}
```




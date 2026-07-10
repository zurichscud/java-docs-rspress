# 自定义YAML内容协商

在 Spring Boot 中，要实现 YAML 格式的内容协商，我们需要自定义一个 **`HttpMessageConverter`**，并将其注册到 Spring MVC 中。

由于 Jackson 官方提供了对 YAML 格式的支持，我们可以非常方便地利用 `jackson-dataformat-yaml` 来实现这个功能。

## 引入依赖

首先，在后端的 `pom.xml`中引入 Jackson 的 YAML 数据格式化模块：

```xml
<dependency>
    <groupId>com.fasterxml.jackson.dataformat</groupId>
    <artifactId>jackson-dataformat-yaml</artifactId>
</dependency>
```

## 自定义 YAML 消息转换器

我们需要继承 `AbstractHttpMessageConverter`，利用 Jackson 的`YAMLMapper`来处理对象的序列化与反序列化。同时，我们需要定义一个自定义的 MediaType，比如 `application/x-yaml`。

```java
import com.fasterxml.jackson.dataformat.yaml.YAMLMapper;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.AbstractHttpMessageConverter;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class YamlHttpMessageConverter extends AbstractHttpMessageConverter<Object>{

    private final YAMLMapper yamlMapper = new YAMLMapper();

    public YamlHttpMessageConverter(){
        // 声明该转换器支持的媒体类型：application/x-yaml
        super(new MediaType("application", "x-yaml", StandardCharsets.UTF_8));
    }

    @Override
    protected boolean supports(Class<?> clazz){
        // 支持所有 Java 对象类型
        return true;
    }

    @Override
    protected Object readInternal(Class<?> clazz, HttpInputMessage inputMessage)
            throws IOException, HttpMessageNotReadableException{
        // 反序列化：将请求体中的 YAML 转换为 Java 对象
        return yamlMapper.readValue(inputMessage.getBody(), clazz);
    }

    @Override
    protected void writeInternal(Object o, HttpOutputMessage outputMessage)
            throws IOException, HttpMessageNotWritableException{
        // 序列化：将 Java 对象转换为 YAML 并写入响应体
        yamlMapper.writeValue(outputMessage.getBody(), o);
    }
}
```



## 注册转换器并配置内容协商

实现 `WebMvcConfigurer` 接口，将刚刚创建的 `YamlHttpMessageConverter` 添加到 Spring 的转换器列表中，并配置内容协商策略（例如支持 URL 参数或扩展名）。

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer{

    /**
     * 1. 注册自定义的 YAML 转换器
     */
    @Override
    public void extendMessageConverters(List<HttpMessageConverter<?>> converters){
        converters.add(new YamlHttpMessageConverter());
    }

    /**
     * 2. 配置内容协商策略（可选：支持参数协商）
     */
    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer){
        configurer
                // 开启基于请求参数的内容协商（例如 ?format=yaml）
                .favorParameter(true)
                .parameterName("format")
                // 忽略请求头中的 Accept 属性（如果想完全由参数控制可以设为 true，通常设为 false 保持两都支持）
                .ignoreAcceptHeader(false)
                // 映射参数值与媒体类型的关系
                .mediaType("json", MediaType.APPLICATION_JSON)
                .mediaType("xml", MediaType.APPLICATION_XML)
                .mediaType("yaml", new MediaType("application", "x-yaml"));
    }
}
```



## 测试效果

```java
@RestController
@RequestMapping("/api/users")
public class UserController{

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id){
        return new User(id, "张三", "zhangsan@example.com");
    }
}
```

- 方式 A：通过 HTTP Request Header (Accept)

```sh
curl -H "Accept: application/x-yaml" http://localhost:8080/api/users/1
```


# RestTemplate

**RestTemplate** 是 Spring Web提供的一个**同步的、阻塞式的 HTTP 客户端工具**。它简化了客户端与 HTTP 服务器之间的通信，能够将 HTTP 响应直接转换为 Java 对象（POJO）。

::: warning

从 Spring 5 开始，官方已经将 `RestTemplate` 标记为**维护模式**。虽然它依然被广泛使用且不会被移除，但 Spring 官方更推荐使用响应式的 **WebClient**，或者在 Spring Cloud 环境下使用声明式的 **OpenFeign**。

:::

## 创建对象

```java
@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

}
```

使用：

```java
@Resource
private RestTemplate restTemplate;
```

## Usage

`RestTemplate` 针对不同的 HTTP 动词提供了非常直观的方法。主要分为两类：

1. `xxxForEntity()`：返回 `ResponseEntity<T>`，包含 **响应头、状态码和响应体**。
2. `xxxForObject()`：直接返回 **响应体（Java 对象）**，更便捷。

### GET 请求

```java
// 1. 直接获取对象
User user = restTemplate.getForObject("https://api.example.com/users/{id}", User.class, 1);

// 2. 获取完整的 ResponseEntity
ResponseEntity<User> response = restTemplate.getForEntity("https://api.example.com/users/1", User.class);
HttpStatus statusCode = response.getStatusCode();
User body = response.getBody();
```

### POST 请求

```java
User newUser = new User("Jack", "Admin");
// 提交对象并获取返回的 JSON 转换后的对象
User createdUser = restTemplate.postForObject("https://api.example.com/users", newUser, User.class);
```

## 通用底层方法exchange

如果需要设置复杂的请求头（Headers）、执行 PUT/DELETE 请求或者处理泛型返回（如 `List<User>`），通常会使用 `exchange()` 方法：

```java
HttpHeaders headers = new HttpHeaders();

headers.set("token", "123456");

headers.setContentType(MediaType.APPLICATION_JSON);

Map<String, Object> body = new HashMap<>();
body.put("name", "张三");

HttpEntity<Map<String, Object>> entity =
        new HttpEntity<>(body, headers);

ResponseEntity<String> response =
        restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                String.class
        );

String result = response.getBody();
```



## Example

```java
Map<String, Object> requestBody = new HashMap<>();

requestBody.put("model", "deepseek-r1");

List<Map<String, String>> messages = new ArrayList<>();

Map<String, String> message = new HashMap<>();

message.put("role", "user");
message.put("content", prompt);

messages.add(message);

requestBody.put("messages", messages);

HttpHeaders headers = new HttpHeaders();

headers.setContentType(MediaType.APPLICATION_JSON);

HttpEntity<Map<String, Object>> entity =
        new HttpEntity<>(requestBody, headers);

String result = restTemplate.postForObject(
        url,
        entity,
        String.class
);
```

- 请求示例：

```json
{
  "model": "deepseek-r1",
  "messages": [
    {
      "role": "user",
      "content": "你的prompt"
    }
  ]
}
```

## 替换为 OKHttp

原生连接池管理能力较弱，通常会将其替换为高性能的 HTTP 客户端库（如 **Apache HttpClient** 或 **OKHttp**）。

```java
@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate() {
        // 使用 OkHttp3 驱动，内部自带连接池
        return new RestTemplate(new OkHttp3ClientHttpRequestFactory());
    }
}
```

## 拦截器

- 统一添加Token

```java
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component // 让 Spring 管理这个拦截器
public class AuthHeaderInterceptor implements ClientHttpRequestInterceptor {

    // 注入配置文件中的 token，如果找不到则默认为空字符串
    @Value("${myapp.auth.token:}")
    private String token;

    @Override
    public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution) throws IOException {
        // 如果配置了 token，则自动追加到 Header
        if (token != null && !token.isEmpty()) {
            request.getHeaders().add("Authorization", token);
        }
        return execution.execute(request, body);
    }
}
```

- 注册拦截器

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.OkHttp3ClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;
import java.util.Collections;

@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate(AuthHeaderInterceptor authHeaderInterceptor) {
        RestTemplate restTemplate = new RestTemplate(new OkHttp3ClientHttpRequestFactory());
        
        // 将 Spring 管理的拦截器注入进去
        restTemplate.setInterceptors(Collections.singletonList(authHeaderInterceptor));
        
        return restTemplate;
    }
}
```

- 如果有多个远程服务端，你也可以创建多个`RestTemplate`实例。

```java
@Configuration
public class RestTemplateConfig {

    private OkHttp3ClientHttpRequestFactory clientHttpRequestFactory() {
        return new OkHttp3ClientHttpRequestFactory();
    }

    @Bean("aRestTemplate") 
    public RestTemplate aRestTemplate(AInterceptor interceptor) {
        RestTemplate restTemplate = new RestTemplate(clientHttpRequestFactory());
        restTemplate.setInterceptors(Collections.singletonList(interceptor));
        return restTemplate;
    }

    @Bean("bRestTemplate")
    public RestTemplate bRestTemplate(BInterceptor interceptor) {
        RestTemplate restTemplate = new RestTemplate(clientHttpRequestFactory());
        restTemplate.setInterceptors(Collections.singletonList(interceptor));
        return restTemplate;
    }
}
```


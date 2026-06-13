# RequestEntity

RequestEntity 是一个非常实用的类，它代表了一个完整的 HTTP 请求。它不仅包含了请求体（Body），还包含了请求头（Headers）、请求方法（HTTP Method）和目标 URL。

## 在RestTemplate中使用

它通常与 RestTemplate 或 WebClient 一起使用，用来以编程的方式构建并发送外部 HTTP 请求。

假设你需要向第三方 API 发送一个 JSON 载荷（Payload）：

```java
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import java.net.URI;

// 1. 准备你要发送的数据对象
MyUserDto userDto = new MyUserDto("张三", 25);

// 2. 使用流式 API 构建 RequestEntity
RequestEntity<MyUserDto> requestEntity = RequestEntity
        .post(URI.create("https://api.example.com/users"))
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", "Bearer your_token_here")
        .body(userDto);
```

构建好 RequestEntity 后，可以直接把它传给 RestTemplate 的 exchange 方法：

```java
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

RestTemplate restTemplate = new RestTemplate();

// 发送请求并接收响应
ResponseEntity<String> response = restTemplate.exchange(requestEntity, String.class);

// 获取响应状态码和响应体
System.out.println(response.getStatusCode());
System.out.println(response.getBody());
```

## 在Controller中使用

在 Spring Boot 的 Controller 中，RequestEntity 并不像在客户端调用（如 RestTemplate）那样频繁出现。

在 Controller 层，你可以直接将 `RequestEntity<T>` 作为方法的参数，Spring MVC 会自动将当前的 HTTP 请求映射到这个对象中。

```java
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MyController {

    @PostMapping("/api/process")
    public ResponseEntity<String> handleRequest(RequestEntity<MyUserDto> request) {
        // 1. 获取请求体 (自动反序列化)
        MyUserDto body = request.getBody();

        // 2. 获取特定的请求头
        String authToken = request.getHeaders().getFirst("Authorization");

        // 3. 获取请求的 URL 或 Method
        System.out.println("请求地址: " + request.getUrl());
        System.out.println("请求方法: " + request.getMethod());

        return ResponseEntity.ok("Received successfully");
    }
}
```

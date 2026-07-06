# RestTemplate


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

## GET 请求

```java
String url = "http://localhost:8080/user/1";

String result = restTemplate.getForObject(url, String.class);

System.out.println(result);
```

JSON响应体转对象：

```java
User user = restTemplate.getForObject(
        url,
        User.class
);
```



## POST 请求

Spring可以自动将对象转为JSON 请求体

```java
String url = "http://localhost:8080/user";

UserDTO dto = new UserDTO();
dto.setName("张三");

String result = restTemplate.postForObject(
        url,
        dto,
        String.class
);
```

## 带请求头

使用核心方法`exchange`完成复杂请求：

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


# Header

## @RequestHeader

`@RequestHeader` 可以直接把请求头的值注入到方法参数中。

### 获取单个请求头

```java
@RestController
@RequestMapping("/header")
public class HeaderController {

    @GetMapping("/get")
    public String getHeader(@RequestHeader("User-Agent") String userAgent
                           @RequestHeader("TOKEN") String token
                           ) {
        return "User-Agent=" + userAgent;
    }

    // 可以设置默认值
    @GetMapping("/get2")
    public String getHeaderDefault(
            @RequestHeader(name="token", required=false, defaultValue="") String token) {
        return "Token=" + token;
    }

}
```

- `name`：请求头名字

- `required`：是否必须（默认 `true`）

- `defaultValue`：默认值，如果请求头不存在就返回这个值

```
GET /header/get
Headers:
User-Agent: Mozilla/5.0
```

### 获取所有请求头

`@RequestHeader` 也可以注入一个 `Map<String, String>` 来接收所有请求头：

```java
@GetMapping("/map")
public String getHeaderMap(@RequestHeader Map<String, String> headers) {
    return headers.toString();
}
```




## HttpServletRequest

如果想获取 **所有请求头** 或更复杂的操作，可以用 `HttpServletRequest`：

```java
@GetMapping("/all")
public String getAllHeader(HttpServletRequest request) {
    Enumeration<String> headerNames = request.getHeaderNames();
    StringBuilder sb = new StringBuilder();
    while(headerNames.hasMoreElements()){
        String name = headerNames.nextElement();
        String value = request.getHeader(name);
        sb.append(name).append(": ").append(value).append("\n");
    }
    return sb.toString();
}
```


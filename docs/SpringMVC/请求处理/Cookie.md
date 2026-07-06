# Cookie

## 设置Cookie

```java
@GetMapping("/set")
public String setCookie(HttpServletResponse response) {
    Cookie cookie = new Cookie("token", "123456");
    cookie.setMaxAge(60*60); // 1小时
    cookie.setPath("/");     // 有效路径
    response.addCookie(cookie);
    return "cookie set";
}
```





## @CookieValue

`@CookieValue` 注解可以直接把指定 cookie 的值注入到方法参数。

```java
@RestController
@RequestMapping("/cookie")
public class CookieController {

    @GetMapping("/get")
    public String getCookie(@CookieValue("JSESSIONID") String sessionId,@CookieValue("USERID") String userId) {
        return "SessionID=" + sessionId;
    }

    // 可以设置默认值
    @GetMapping("/get2")
    public String getCookieDefault(@CookieValue(name="token", defaultValue="") String token) {
        return "Token=" + token;
    }

}
```

- `name`：Cookie 名称

- `required`：是否必须（默认 `true`）

- `defaultValue`：默认值，如果 cookie 不存在就返回这个值

- `@CookieValue`不支持将所有Cookie映射到Map，但是我们可以声明多个`@CookieValue`





## HttpServletRequest

如果你想获取 **所有 Cookie** 或做更复杂处理，可以用 `HttpServletRequest`：

```java
@GetMapping("/all")
public String getAllCookie(HttpServletRequest request) {
    Cookie[] cookies = request.getCookies();
    if(cookies == null) return "No cookies";

    StringBuilder sb = new StringBuilder();
    for(Cookie c : cookies){
        sb.append(c.getName()).append("=").append(c.getValue()).append(";");
    }
    return sb.toString();
}
```


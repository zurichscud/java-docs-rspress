# JSON参数

我们可以使用`@RequestBody`解析请求中的JSON参数

## 绑定到对象

`@RequestBody`把 HTTP 请求体（request body）解析成这个方法参数对应的 Java 对象

```java
@RestController
public class UserController {

    @PostMapping("/user")
    public String saveUser(@RequestBody User user) {
        return user.toString();
    }

}
```

JavaBean：

```java
public class User {
    private String name;
    private Integer age;

    // getter / setter
}
```

## 绑定到Map

```java
@PostMapping("/user")
public String saveUser(@RequestBody Map<String, Object> data) {
    return data.toString();
}
```

```
{name=tom, age=20}
```


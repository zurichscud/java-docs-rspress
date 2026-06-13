# ResponseEntity

ResponseEntity 是一个非常核心的类，它用于代表整个 HTTP 响应。

简单来说，通过它，你不仅可以控制返回给前端的数据（Body），还能自由地设置 HTTP 状态码（Status Code） 和 响应头（Headers）。

## 核心组成部分

1. Status Code（状态码）：告诉前端请求是成功（200）、创建成功（201）、未找到（404）还是服务器错误（500）。

2. Headers（响应头）：传递元数据，比如设置缓存控制、自定义 Token，或者指定返回类型（Content-Type）。

3. Body（响应体）：实际返回给前端的数据（可以是实体对象、List、Map 或者是你的统一返回值封装类 `Result<T>`）。

## 基础用法：只返回状态码和数据

这是最常用的场景，通常可以使用快捷的静态方法（如 .ok()）来构建。

```java
@GetMapping("/user/{id}")
public ResponseEntity<User> getUserById(@PathVariable Long id) {
    User user = userService.findById(id);

    if (user != null) {
        // 返回 200 OK，并将 user 对象作为 JSON 写入 Body
        return ResponseEntity.ok(user);
    } else {
        // 返回 404 Not Found，没有 Body
        return ResponseEntity.notFound().build();
    }
}
```

## 进阶用法：自定义状态码和 Headers

当你需要更精细的控制（比如异步创建资源后返回 201，并附带自定义 Header）时，可以使用链式调用的 BodyBuilder：

```java
@PostMapping("/user")
public ResponseEntity<String> createUser(@RequestBody User user) {
    boolean isCreated = userService.save(user);

    if (isCreated) {
        return ResponseEntity
                .status(HttpStatus.CREATED) // 201 Created
                .header("Custom-Header", "UserCreatedSuccess")
                .body("User created successfully");
    }

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to create user");
}
```

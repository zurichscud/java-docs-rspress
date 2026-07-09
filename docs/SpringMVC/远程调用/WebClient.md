# WebClient

**WebClient** 是自 Spring 5 (随着 Spring WebFlux) 引入的现代 HTTP 客户端。它是为了替代逐渐老化的 `RestTemplate` 而设计的。

如果说 `RestTemplate` 是传统的 **同步、阻塞** 客户端，那么 `WebClient` 就是 **异步、非阻塞** 的现代客户端。

## 核心优势

1. **非阻塞与高并发 (Non-blocking)**： `RestTemplate` 采用“一个请求一个线程（Thread-per-request）”的模型。如果高并发下远程服务响应慢，线程池会迅速耗尽。 而 `WebClient` 基于 Reactor 响应式流，底层的 Netty 网络框架只需要**极少数的线程**就能处理海量的并发请求，等待网络 I/O 时线程不会被挂起。
2. **支持三种模式**：它不仅能玩转传统的**同步**调用，还能完美支持**异步**回调以及 **流式（Streaming/SSE）** 传输。
3. **函数式流式 API**：链式调用非常丝滑，比 `RestTemplate` 更加优雅。

## 同步获取数据

```java
Mono<User> mono = webClient.get()
        .uri("https://api.example.com/users/{id}", 1)
        .retrieve()
        .bodyToMono(User.class);

// 强行阻塞，直到拿到对象（类似 RestTemplate）
User user = mono.block();
```

## 异步响应式获取

不使用 `.block()`，而是让它返回 `Mono<T>`（代表 0 或 1 个结果）或 `Flux<T>`（代表 0 或多个结果的响应式流）：

```java
// 返回的是一个“承诺”，此时并没有真正发生网络阻塞
Mono<User> userMono = webClient.get()
        .uri("https://api.example.com/users/1")
        .retrieve()
        .bodyToMono(User.class);

// 只有当有人去 subscribe(订阅) 它，或者在 Spring MVC/WebFlux 的 Controller 中直接返回它时，才会真正触发和执行
userMono.subscribe(user -> {
    System.out.println("异步收到了数据: " + user.getName());
});
```



## POST 请求示例

```java
User newUser = new User("Jack", "Admin");

Mono<User> createdUserMono = webClient.post()
        .uri("https://api.example.com/users")
        .bodyValue(newUser) // 传递请求体
        .retrieve()
        .bodyToMono(User.class);
```



## Mono

我们可以用前端 `Promise` 的概念来无缝平替理解 `Mono`：

| **特性**     | **Promise**                          | **Mono**                                   |
| ------------ | ------------------------------------ | ------------------------------------------ |
| **状态状态** | `Pending` / `Fulfilled` / `Rejected` | 类似。要么产生 1 个结果，要么产生空/错误。 |
| **成功回调** | `.then(data => ...)`                 | `.map(data -> ...)` 或 `.flatMap(...)`     |
| **捕获异常** | `.catch(err => ...)`                 | `.onErrorResume(err -> ...)`               |
| **并发组合** | `Promise.all([p1, p2])`              | `Mono.zip(m1, m2)`                         |

```java
Mono<User> userMono = webClient.get()
        .uri("https://api.example.com/users/1")
        .retrieve()
        .bodyToMono(User.class);

// 假设这里还有一些其他的普通 Java 代码
System.out.println("这一行会执行，但上面的网络请求根本没发出去");
```

在 Java 的响应式世界里，必须有一个**触发源（订阅者）**。通常有以下两种方式让这段网络请求真正跑起来：

```java
// 1. 定义流水线
Mono<User> userMono = webClient.get().uri("...").retrieve().bodyToMono(User.class);

// 2. 只有执行了这一句，网络请求才轰轰烈烈地发出去
userMono.subscribe(user -> {
    System.out.println("真正拿到了用户数据：" + user.getName());
});
```

在实际开发中，我们很少手动去写 `.subscribe()`。因为你用的是 Spring 框架，**Spring 充当了那个最终的订阅者**。

```java
@GetMapping("/user")
public Mono<User> getUser() {
    // 你只负责组装、返回这个 Mono 流水线
    return webClient.get()
            .uri("https://api.example.com/users/1")
            .retrieve()
            .bodyToMono(User.class); 
    // 当这个 Mono 被返回给 Spring 框架后，Spring 底层会自动调用 .subscribe() 
    // 从而触发网络请求，并将最终结果渲染成 JSON 给前端 Vue
}
```

因为 `getUser()` 返回的是一个 `Mono<User>`（计划书），其他地方调用它时，**默认是异步、非阻塞的**。但是，调用者拥有绝对的决定权

- 走向 A：保持纯正的异步（推荐 🌟）

调用者不急着要结果，而是继续用链式包装它。整个过程**没有任何线程被阻塞，完全是异步的**：

```java
public Mono<Order> createOrder() {
    return userService.getUser() // 拿到 Mono<User>
            .map(user -> {
                // 异步流水线：等未来拿到 user 后，再执行这里的下单逻辑
                return new Order(user.getId(), "商品A");
            }); 
}
```

- 走向 B：强行变成同步阻塞（不推荐 ❌）

调用者是个“急性子”，必须立刻、马上拿到真实的 `User` 对象才肯往下走。这时候可以使用 `.block()` 方法：

```java
public Order createOrder() {
    // 强行阻塞当前线程！直到网络请求完成并返回 User 才会往下走
    User user = userService.getUser().block(); 
    
    // 这一行必须等上面拿到 user 之后才会执行（彻底变成了同步）
    return new Order(user.getId(), "商品A");
}
```



## Example

```java
@Configuration
public class WebClientConfig {

    @Value("${myapp.vendor-a.token}")
    private String tokenA;

    @Value("${myapp.vendor-b.token}")
    private String tokenB;

    @Bean("aWebClient")
    public WebClient aWebClient() {
        return WebClient.builder()
                .baseUrl("https://api.vendor-a.com")
                .defaultHeader("Authorization", tokenA) // 直接一句话配好全局 Header 和 BaseURL
                .build();
    }

    @Bean("bWebClient")
    public WebClient bWebClient() {
        return WebClient.builder()
                .baseUrl("https://api.vendor-b.com")
                .defaultHeader("X-API-Key", tokenB)
                .build();
    }
}
```



```java
@Autowired
@Qualifier("aWebClient")
private WebClient aWebClient;

public Mono<String> callA() {
    // 自动拼成 https://api.vendor-a.com/orders 并自带 Token A
    return aWebClient.get()
            .uri("/orders") 
            .retrieve()
            .bodyToMono(String.class);
}
```


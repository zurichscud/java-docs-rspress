# 远程调用

![image-20260709135516830](https://markdown-lai.oss-cn-hangzhou.aliyuncs.com/typora/image-20260709135516830.png)

在 Spring Boot 生态中，**远程调用（RPC / HTTP 调用）方案大多数选择取决于项目规模和架构**。目前主流选择如下：

| 方案                     | 类型     | 使用比例 | 典型场景           | 推荐程度       |
| ------------------------ | -------- | -------- | ------------------ | -------------- |
| OpenFeign                | HTTP     | ⭐⭐⭐⭐⭐    | 微服务之间调用     | 最主流         |
| gRPC                     | RPC      | ⭐⭐⭐⭐     | 高性能内部服务调用 | 大型系统常用   |
| Dubbo                    | RPC      | ⭐⭐⭐⭐     | 国内企业微服务     | 很常见         |
| RestTemplate             | HTTP     | ⭐⭐       | 老项目             | 不推荐新项目   |
| WebClient                | HTTP     | ⭐⭐⭐      | 高并发异步调用     | 推荐           |
| 原生 HttpClient / OkHttp | HTTP     | ⭐⭐       | 自定义调用         | 较少           |
| 消息队列（MQ）           | 异步通信 | ⭐⭐⭐⭐⭐    | 解耦、削峰         | 非同步调用替代 |

## HTTP 调用

可以使用HTTP客户端直接调用第三方服务，例如`RestTemplate`

## RPC

Remote Procedure Call（远程过程调用）。简单来说，就是**让分布式系统中的远程服务调用，看起来像本地的方法调用。**

> 它的目标是：让调用远程服务像调用本地方法一样。

例如本地调用：

```java
User user = userService.findById(1);
```

RPC 后：

```java
User user = userService.findById(1);
```

::: info

**RPC 不是一种单独的协议，而是一种远程调用思想/机制**。HTTP是协议

:::


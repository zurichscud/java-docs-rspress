# SSE

**SSE** ， **Server-Sent Events（服务器发送事件）**，是一种用于**服务器向浏览器实时推送数据**的技术。

## 基本概念

- 浏览器和服务器建立一条“单向的长连接”
- 服务器可以不断主动往浏览器“推消息”
- 浏览器不用反复请求（不像轮询）

### 核心特点

- **单向通信**：服务器 → 客户端（浏览器）
- 基于 HTTP（不用像 WebSocket 那样升级协议）
- 自动重连（浏览器断线会自动重新连接）
- 数据格式是文本（通常是 JSON）



### 应用场景

- 实时通知（比如消息提醒）

- 日志流（实时输出服务器日志）

- 股票/行情更新

- AI 流式输出（比如类似 ChatGPT 的逐字生成）

## SSE数据格式

每个事件的发送数据遵循以下格式：

```js
[字段名]: [字段值]\n
```

- 每个字段以 **`字段名: 字段值`** 的形式定义。

- 每个字段后必须跟上 **换行符**（`\n`）。

- 每个事件结束后，需要有 **两个换行符**（`\n\n`）表示事件的结束。

- 字段名区分大小写，不能有空格。

每个事件都可以包含以下字段：

- `event`: 指定事件的类型（可以自定义名称）。

- `data`: 传输的数据。可以是任何有效的文本格式（JSON、字符串、数字等），但需要注意将数据正确地格式化为文本形式。

- `id`: 可选，设置事件的 ID。

- `retry`: 可选，指定客户端重新连接的时间（毫秒）。

```js
event: update\n
id: 1001\n
data: {"status": "success", "message": "Data updated successfully"}\n
retry: 5000\n\n
```



默认事件：如果没有指定 `event` 字段，事件的类型默认为 `message`。

## SSE中断

### 服务端中断

服务端可以主动关闭SSE连接

```java
emitter.complete(); // 正常关闭
```



但是由于 前端中的`EventSource` 在连接异常断开时会默认尝试**自动重连**，如果你只是简单地关闭 Socket，浏览器会认为网络出错了并再次发起请求。

这次连接会被重建，造成服务端不能终止SSE连接的效果



### 推荐做法

先向客户端发送一个特定的“结束”事件，由客户端主动关闭连接。

- 服务端

```js
res.write('event: close\n');
res.write('data: {"message": "Stream finished"}\n\n');
res.end();
```

- 客户端：

```js
eventSource.addEventListener('close', (e) => {
    console.log('服务端通知：任务已完成，准备关闭连接');
    eventSource.close(); // 彻底切断，不再重连
  });
```



## SSE请求

### SSE请求

SSE的请求是由前端的`EventSource`对象发送的。

### SSE响应

SSE 是基于 HTTP 协议的，它要求服务器响应 **特定的 Content-Type**：

```http
Content-Type: text/event-stream
```

- `text/event-stream` 表示响应是一个事件（文本）流（Event Stream）

- EventSource会自动解析这个文本流

- 一般还会加上：

```http
Cache-Control: no-cache
Connection: keep-alive
```

![image-20260516134905185](https://markdown-lai.oss-cn-hangzhou.aliyuncs.com/typora/image-20260516134905185-20260517004409088.png)



## SseEmitter

`SseEmitter` 是 Spring MVC / Spring Boot 提供的类，用于向浏览器发送 **单向、持续的事件流**

###  `emitter.send(Object object)`

最简单的发送方式，直接发送纯文本或对象。Spring 会默认将其转为 JSON 格式，事件类型默认为普通的 `message`。

```java
// 发送纯字符串
emitter.send("Hello, Client!");

// 发送 DTO 对象（Spring 会自动用 Jackson 转为 JSON 字符串）
UserMessageDTO msg = new UserMessageDTO("系统通知", "您的订单已发货");
emitter.send(msg);
```

### `emitter.send(SseEmitter.SseEventBuilder builder)`

配置更多：

```java
emitter.send(SseEmitter.event()
        .id("msg_001")                      // 设置消息唯一 ID（前端可通过 Last-Event-ID 拿到）
        .name("order_status")               // 自定义事件名，前端可以监听这个事件
        .reconnectTime(5000)                // 提示前端：如果断开了，5秒后再尝试重连
        .data(orderData, MediaType.APPLICATION_JSON) // 发送的数据及格式
);
```

### `emitter.complete()`

**正常结束**。通知客户端所有数据已发送完毕，并关闭当前 HTTP 连接。执行后会触发 `onCompletion` 回调。



### `emitter.onCompletion(Runnable callback)`

当连接正常完成（调用了 `complete()`）**或**客户端主动断开（如关闭网页）时触发。

```java
emitter.onCompletion(() -> {
    System.out.println("连接正常结束，正在清理内存...");
    emitterMap.remove(userId);
});
```

### `emitter.onTimeout(Runnable callback)`

当连接达到初始化时设置的 `timeout` 时间，且期间没有新数据发送导致超时时触发。

::: warning

- SSE出错时，HTTP 请求的底层网络管道（Socket）已经彻底关闭了。

- **前端的重连**：并不是在原来那条既有的 HTTP 通道上继续通信，而是**重新发起一次全新的 HTTP 请求**。
- 后端的连接对象：旧的 `SseEmitter` 实例已经随着那次报错或超时**彻底废弃**了，它所对应的旧网络管道已经不可用。

旧的实例只是一个空壳，因此你必须在回调里将其从缓存 Map 中移除，否则会导致内存泄漏。

:::

````java
emitter.onTimeout(() -> {
    System.out.println("连接超时，关闭并移除...");
    emitterMap.remove(userId);
});
````

### `emitter.onError(Consumer<Throwable> callback)`

当异步请求处理过程中发生错误（如网络中断、写入管道失败）时触发。

```java
emitter.onError((ex) -> {
    System.err.println("连接发生异常: " + ex.getMessage());
    emitterMap.remove(userId);
});
```

## SSE生命周期概述

### 没有close事件

1. 客户端建立连接 → Controller 返回 `SseEmitter`
2. 服务器持有 `SseEmitter` 实例，可以异步发送消息
3. 超时计时开始（比如 1 分钟）
4. 客户端接收消息
5. 服务端调用 `emitter.complete()` → 关闭连接
6. 前端`onerror`触发，触发原因是“连接关闭”
7. 浏览器 EventSource 会在 3 秒后尝试重连（默认重连间隔）
8. 客户端重连成功，但是服务端没有发送信息，当达到超时时间，连接被关闭
9. 前端继续重试...

### 发送close事件

服务端完成数据的发送，可以发送close事件去通知前端，关闭SSE连接。就不会出现上面的问题。

### 超时时间



| 场景                         | 推荐超时时间                     | 说明                                                         |
| ---------------------------- | -------------------------------- | ------------------------------------------------------------ |
| 高频消息 / 需要实时通知      | **Long.MAX_VALUE** 或 **几小时** | 保持连接活跃，避免频繁重连，后台可以通过业务逻辑判断连接有效性 |
| 中低频消息（几分钟才有消息） | **5~15 分钟**                    | 保证连接稳定，超时后 EventSource 会自动重连                  |
| 短连接 / 非关键通知          | **1~2 分钟**                     | 保证服务器资源及时回收，客户端通过自动重连继续接收           |





## Example

```java
package com.example.sse;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@CrossOrigin
public class SseController {

    // 存储所有客户端的 SseEmitter（可用于广播）
    private final Map<String, SseEmitter> clients = new ConcurrentHashMap<>();

    @GetMapping("/sse")
    public SseEmitter sse() {
        // 创建一个 SseEmitter 对象，超时 1 分钟
        SseEmitter emitter = new SseEmitter(60_000L);

        // 保存客户端
        String clientId = String.valueOf(System.currentTimeMillis());
        clients.put(clientId, emitter);

        // 字符数组要推送的内容
        char[] content = "莫听穿林打叶声，何妨吟啸且徐行。竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。".toCharArray();

        // 单线程调度器，避免阻塞请求线程
        ScheduledExecutorService executor = new ScheduledThreadPoolExecutor(1);
        AtomicInteger index = new AtomicInteger(0);

        // 每 300ms 推送一个字符
        executor.scheduleAtFixedRate(() -> {
            try {
                int i = index.getAndIncrement();
                if (i < content.length) {
                    emitter.send(SseEmitter.event()
                            .data(String.valueOf(content[i])));
                } else {
                    emitter.complete();        // 发送完成，结束连接
                    executor.shutdown();       // 关闭调度器
                    clients.remove(clientId);  // 移除客户端
                }
            } catch (Exception e) {
                emitter.completeWithError(e); // 出现异常时结束连接
                executor.shutdown();
                clients.remove(clientId);
            }
        }, 0, 300, TimeUnit.MILLISECONDS);

        // 客户端连接超时或主动关闭处理
        emitter.onCompletion(() -> {
            executor.shutdown();
            clients.remove(clientId);
        });
        emitter.onTimeout(() -> {
            emitter.complete();
            executor.shutdown();
            clients.remove(clientId);
        });

        return emitter;
    }

    // 可选：广播给所有客户端
    public void broadcast(String message) {
        clients.forEach((id, emitter) -> {
            try {
                emitter.send(SseEmitter.event().data(message));
            } catch (Exception e) {
                emitter.completeWithError(e);
                clients.remove(id);
            }
        });
    }
}
```



## 最佳实践

### 存储客户端连接

```java
private Map<String, SseEmitter> map = new ConcurrentHashMap<>();
```

- 使用 `ConcurrentHashMap` 存储每个用户的 `SseEmitter`

- key = 用户 ID，value = 对应用户的 SSE 连接

### 用户订阅接口

```java
@GetMapping("/sse/user/subscribe/{userId}")
public void subscribe(@PathVariable String userId) {
    SseEmitter emitter = new SseEmitter(60_000L);
    map.put(userId, emitter);

    emitter.onCompletion(() -> map.remove(userId));
    emitter.onTimeout(() -> map.remove(userId));
    emitter.onError(e -> map.remove(userId));
}
```

用户访问 `/sse/user/subscribe/{userId}` 时：

- 创建一个 `SseEmitter` 对象（1 分钟超时）
- 保存到 `map`，方便后续给指定用户推送消息

`onCompletion`、`onTimeout`、`onError`：

- 当 SSE 连接完成、超时或出错时，把该用户从 `map` 移除
- 防止内存泄漏

### 给指定用户发送消息接口

例如管理员给指定用户发送消息

```java
@GetMapping("/sse/user/send/{userId}")
public SseEmitter send(@PathVariable String userId) {
    SseEmitter emitter = map.get(userId);
    if (emitter == null) return null;

    try {
        emitter.send(SseEmitter.event().data(getMsg(userId)));
    } catch (IOException e) {
        throw new RuntimeException(e);
    }

    return emitter;
}
```

- 根据用户 ID 从 `map` 获取 `SseEmitter`

- 如果用户不在线或没有订阅，直接返回 null

- 调用 `emitter.send()` 推送消息

### 添加心跳机制

- 为了保证长连接不会被代理或浏览器关闭，可以每隔 15~30 秒发送一条空消息或心跳。如果能够发送成功就说明连接能够正常运行。

- 如果连续几次心跳发送失败或触发异常 → 可以认为客户端掉线 → 清理 SseEmitter

```java
SseEmitter emitter = new SseEmitter(60000L); // 超时时间 1 分钟

// 出现异常时清理
emitter.onError(e -> registry.remove(userId));

// 连接完成时清理
emitter.onCompletion(() -> registry.remove(userId));

// 定期心跳保持连接活跃
scheduler.scheduleAtFixedRate(() -> {
    try {
        emitter.send(SseEmitter.event().name("heartbeat").data(""));
    } catch (Exception e) {
        //发送消息失败
    }
}, 0, 30, TimeUnit.SECONDS);
```



### SseClientRegistry

一个连接就是一个对象，由于SSE是长连接，我们可以将连接存入容器中方便管理

```java
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.concurrent.ConcurrentHashMap;

@Component
public class SseClientRegistry {

    // 用户ID -> SseEmitter
    private final ConcurrentHashMap<String, SseEmitter> clients = new ConcurrentHashMap<>();

    public void add(String userId, SseEmitter emitter) {
        clients.put(userId, emitter);

        // 连接完成或超时时自动移除
        emitter.onCompletion(() -> clients.remove(userId));
        emitter.onTimeout(() -> clients.remove(userId));
    }

    public void remove(String userId) {
        clients.remove(userId);
    }

    public SseEmitter get(String userId) {
        return clients.get(userId);
    }

    public void sendMessage(String userId, String message) {
        SseEmitter emitter = clients.get(userId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event().name("message").data(message));
            } catch (Exception e) {
                clients.remove(userId);
                e.printStackTrace();
            }
        }
    }
}
```




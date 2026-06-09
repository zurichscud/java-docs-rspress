# WebSocket

一旦连接建立，客户端和服务端都可以主动发送消息。WebSocket占用的资源比SSE多

| 对比项   | SSE                   | WebSocket  |
| -------- | --------------------- | ---------- |
| 通信方向 | 单向（服务器→客户端） | 双向       |
| 协议     | HTTP                  | ws / wss   |
| 复杂度   | 简单                  | 较复杂     |
| 使用场景 | 实时通知、日志流      | 聊天、游戏 |

![image-20260517161003304](https://markdown-lai.oss-cn-hangzhou.aliyuncs.com/typora/image-20260517161003304.png)

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

## 原生 WebSocket



创建 WebSocket 服务端

```java
import jakarta.websocket.OnClose;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@ServerEndpoint("/ws/chat")
@Component
public class ChatEndpoint {

    // 保存所有连接
  //使用static是因为ChatEndpoint是多例的，我们只希望维护所有连接在同一个容器
    private static final Set<Session> sessions = Collections.synchronizedSet(new HashSet<>());

    @OnOpen
    public void onOpen(Session session) {
        sessions.add(session);
        System.out.println("新连接: " + session.getId());
    }

    @OnMessage
    public void onMessage(String message, Session session) throws IOException {
        System.out.println("收到消息: " + message);
        // 广播给所有连接
        for (Session s : sessions) {
            s.getBasicRemote().sendText("用户 " + session.getId() + ": " + message);
        }
    }

    @OnClose
    public void onClose(Session session) {
        sessions.remove(session);
        System.out.println("连接关闭: " + session.getId());
    }
}
```



Spring Boot 原生不扫描 `@ServerEndpoint`，所以需要一个 **ServerEndpointExporter**：

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

@Configuration
public class WebSocketConfig {
    
    @Bean
    public ServerEndpointExporter serverEndpointExporter() {
        return new ServerEndpointExporter();
    }
}
```



```html
<!DOCTYPE html>
<html>
<body>
<input type="text" id="msg">
<button onclick="sendMsg()">发送</button>

<ul id="messages"></ul>

<script>
const ws = new WebSocket("ws://localhost:8080/ws/chat");

ws.onopen = () => console.log("连接成功");
ws.onmessage = (event) => {
    const li = document.createElement('li');
    li.textContent = event.data;
    document.getElementById('messages').appendChild(li);
};

function sendMsg() {
    const msg = document.getElementById('msg').value;
    ws.send(msg);
}
</script>
</body>
</html>
```







## STOMP + SockJS

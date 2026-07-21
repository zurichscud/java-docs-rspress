# SSE

## 客户端重试机制

当客户端检测到连接中断或错误时，浏览器会自动根据服务器发送的 **`retry`** 字段（如果有）来进行重试。默认情况下，客户端会每 3 秒重新尝试连接。

## EventSource

**EventSource** 是浏览器提供的一个原生 JavaScript 对象，用于 **接收服务器推送的事件流**。它配合 SSE 使用，可以建立一个**单向的长连接**，服务器不断发送数据，浏览器实时接收。

### 创建 EventSource

```
const evtSource = new EventSource('/sse-endpoint');
```

- `/sse-endpoint` 是服务器提供 SSE 流的 URL

- 浏览器会自动发起 GET 请求，保持连接

- 服务器响应必须是 `Content-Type: text/event-stream`

### message事件

默认事件：接收服务器发送的普通消息（没有指定 `event` 类型的消息）

```http
data: 这是默认消息
\n\n
```

```js
evtSource.onmessage = (event) => {
    console.log("默认消息:", event.data);
};
```

::: danger

如果SSE的消息不符合SSE格式规范，客户端将无法解析到相关事件，也就不会触发相关的回调函数了

:::

### open事件

当连接成功建立时触发

```js
evtSource.onopen = () => {
    console.log("SSE连接已建立");
};
```

### error事件

当连接出错或断开时触发。EventSource 会自动重连（默认 3 秒）

```js
evtSource.onerror = (event) => {
    console.error("SSE连接出错或断开", event);
};
```

### 关闭连接

手动关闭 SSE 连接，停止接收消息

```js
evtSource.close();
```

调用 `eventSource.close()` 后，连接将被关闭，服务器将不再向客户端发送任何数据，且 `EventSource` 会触发 `onerror` 事件。

```html
<script>
  const eventSource = new EventSource('/events');

  eventSource.onmessage = function(event) {
    console.log("收到数据:", event.data);
  };

  // 主动关闭连接
  setTimeout(() => {
    eventSource.close();
    console.log("连接已关闭");
  }, 10000);  // 10秒后关闭连接
</script>
```





### 自定义事件（通过 `event:` 指定）

- **用途**：服务器可以发送带有事件类型的消息
- **服务器端格式**：

```http
event: update
data: 新数据
\n\n
```

```js
evtSource.addEventListener('update', (event) => {
    console.log("update事件:", event.data);
});
```

## 客户端示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>SSE 逐字显示示例</title>
</head>
<body>
    <h1>Server-Sent Events 示例</h1>
    <div id="output" style="font-size: 20px; line-height: 1.5;"></div>

    <script>
        // 创建 EventSource 连接 SSE 接口
        const eventSource = new EventSource('http://localhost:8080/sse');

        // 监听服务器推送的消息
        eventSource.onmessage = function(event) {
            const outputDiv = document.getElementById('output');
            // 每次收到一个字符就追加
            outputDiv.innerHTML += event.data;
        };

        // 监听错误事件
        eventSource.onerror = function(err) {
            console.error("SSE 连接出错或关闭", err);
            eventSource.close();
        };

        // 可选：监听连接打开
        eventSource.onopen = function() {
            console.log("SSE 连接已建立");
        };
    </script>
</body>
</html>
```



## Node.js实现

服务器通过发送特殊的HTTP响应头，告知客户端它会使用SSE推送数据。

```js
app.get('/sse',(req,res)=>{
    res.setHeader('Content-Type', 'text/event-stream')
    res.status(200)
    setInterval(() => {
        res.write('event: test\n')
        res.write('data: ' + new Date().getTime() + '\n\n')
    }, 1000)
})

```



```js
const sse = new EventSource('http://localhost:3000/sse')
sse.addEventListener('test', (event) => {
    console.log(event.data)
})
```

## 自定义SSE客户端

原生的EventSource并不支持我们在请求头中添加Token鉴权。这就需要我们自定义一个SSE客户端。

SSE本质是上是HTTP请求，我们知道了他的基本原理，也可以很容易的实现

```js
class SseClient {
    /**
     * @param {string} url SSE接口地址
     * @param {string} token 可选Token
     * @param {number} reconnectInterval 重连间隔，默认3000ms
     */
    constructor(url, token = '', reconnectInterval = 3000) {
        this.url = url;
        this.token = token;
        this.reconnectInterval = reconnectInterval;
        this.listeners = {};   // 存放事件监听函数
        this.running = false;  // 控制是否继续连接
        this._connect();       // 初始化连接
    }

    _connect() {
        this.running = true;

        const headers = this.token ? { 'Authorization': `Bearer ${this.token}` } : {};

        fetch(this.url, { headers })
            .then(res => {
                if (!res.body) throw new Error('SSE流不可用');
                const reader = res.body.getReader();
                const decoder = new TextDecoder('utf-8');
                let buffer = '';

                const readChunk = () => {
                    reader.read().then(({ done, value }) => {
                        if (done) {
                            this._reconnect();
                            return;
                        }
                        buffer += decoder.decode(value, { stream: true });
                        let parts = buffer.split('\n\n');
                        buffer = parts.pop();

                        for (let part of parts) {
                            this._handleMessage(part);
                        }

                        readChunk();
                    }).catch(() => {
                        this._reconnect();
                    });
                };

                readChunk();
                this._emit('open', {});
            })
            .catch(() => this._reconnect());
    }

    _handleMessage(raw) {
        const lines = raw.split('\n');
        let event = 'message';
        let data = '';

        for (let line of lines) {
            if (line.startsWith('event:')) event = line.replace(/^event:\s*/, '');
            if (line.startsWith('data:')) data += line.replace(/^data:\s*/, '') + '\n';
        }
        data = data.trim();
        if (data) this._emit(event, { data });
    }

    _emit(event, obj) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(fn => fn(obj));
        }
    }

    _reconnect() {
        if (this.running) {
            setTimeout(() => this._connect(), this.reconnectInterval);
        }
    }

    /**
     * 添加事件监听
     * @param {string} event 事件名
     * @param {Function} callback 回调
     */
    addEventListener(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    /**
     * 关闭SSE
     */
    close() {
        this.running = false;
    }
}
```


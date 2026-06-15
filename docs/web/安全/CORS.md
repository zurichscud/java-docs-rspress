# CORS

跨域资源共享（Cross-Origin Resource Sharing，CORS）是一种机制，用于在浏览器中实现跨域请求访问资源的权限控制。当一个网页通过 XMLHttpRequest 或 Fetch API 发起跨域请求时，浏览器会根据同源策略（Same-Origin Policy）进行限制。





## 同源策略

**同源策略**是浏览器的一种安全机制，用来限制不同来源（origin）的网页之间互相访问数据。

两个 URL **协议 + 域名 + 端口** 三者完全相同，才算同源。

```js
www.example.com   api.example.com //域名不同，因此跨域
```





`http://localhost:3001`存在如下网页：

```html [index.html]
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>127.0.0.1:3000</h1>

    <script>
        fetch('http://localhost:3000/get')
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err));
    </script>
    
</body>
</html>
```

浏览器访问`http://localhost:3001/index.html`控制台报错：

```js
index.html:1 Access to fetch at 'http://localhost:3000/get' from origin 'http://localhost:3001' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

因为`http://localhost:3001`和`http://localhost:3000`不同源，因此请求`http://localhost:3000/get`被浏览器阻止

## 相关请求头

### Access-Control-Allow-Origin

- 只允许指定源访问

```js
Access-Control-Allow-Origin: http://www.example.com
```

- 允许所有域访问

```js
Access-Control-Allow-Origin: *
```

- 动态返回请求源

后端读取请求头里的 Origin，然后原样返回：

```js
Access-Control-Allow-Origin: Origin
```

### Access-Control-Allow-Methods

Access-Control-Allow-Methods 决定浏览器“允不允许用这个方法发跨域请求”。

```js
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
```

### Access-Control-Request-Headers

`Access-Control-Request-Headers` 是 **浏览器在预检请求（OPTIONS）中自动发送的请求头**。

它的真正含义是：浏览器准备发送的“非简单请求头”列表

它的作用是，告诉服务器： “接下来正式请求里，我会携带这些非简单请求头，你是否允许？”

它解决的是：浏览器想发送“自定义请求头”时，需要先征得服务器同意。否则浏览器会拦截请求。

```js
axios.get('/api', {
  headers: {
    Authorization: 'Bearer xxx',
    'X-Token': '123'
  }
})
```

```js
OPTIONS /api
Access-Control-Request-Method: GET
Access-Control-Request-Headers: authorization, x-token
Origin: http://localhost:5173
```



## 解决

### 服务端


在响应头中设置`Access-Control-Allow-Origin`即可

```js
const express = require('express');


const app = express();

app.use(express.json());
app.use((req,res,next)=>{
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next()
})

app.get('/get', (req, res) => {
  console.log('get request');
  res.send('GET');
});

app.delete('/delete', (req, res) => {
  console.log('delete request');
  res.send('DELETE');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000...');
});

```


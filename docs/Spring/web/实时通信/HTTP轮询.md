# HTTP轮询

主动权在客户端，服务端无法主动发送消息给客户端





![image-20260516160219900](https://markdown-lai.oss-cn-hangzhou.aliyuncs.com/typora/image-20260516160219900.png)

- 客户端一旦收到消息就会关闭连接

- 服务端无法主动发送消息给客户端（服务端永远找不到客户端）

```http
fetch(userdomian.com)
```


# Cache-Control

## 强缓存

当响应头里有：

```js
Cache-Control:public,max-age=3600
```

浏览器行为：

- 资源在 3600 秒内
- 直接从本地读取
- 不发送请求
- Network 面板显示 `(from memory cache)` 或 `(from disk cache)`

## 协商缓存

当响应头是：

```js
Cache-Control: no-cache
```

使用前必须和服务器确认



## 完全不缓存

上述两种缓存策略都不会使用。

```js
Cache-Control: no-store
```



## 浏览器如何触发缓存？

以 Chrome 为例：

| 操作         | 行为     | 是否使用强缓存 | 是否使用协商缓存 |
| ------------ | -------- | -------------- | ---------------- |
| 地址栏回车   | 正常访问 | ✅              | ✅                |
| 点击刷新按钮 | 刷新     | ❌              | ✅                |

::: tip

Postman 和浏览器不一样——**它没有实现浏览器的自动缓存机制**。

:::
# HttpInputMessage

它只干两件事：读取请求头 和 读取请求体。

## 为什么设计

Spring 为什么不直接把 `HttpServletRequest`传给转换器，而是要单独封装一个 `HttpInputMessage`呢？

### 职责单一

消息转换器（如解析 JSON/YAML）只需要知道两件事——“报文头是什么（以此判断格式）”和“报文体怎么读”。它不需要关心请求的 URL 是什么、Session 是什么、Cookie 是什么。

`HttpInputMessage`恰好只提供了转换器需要的最少信息。


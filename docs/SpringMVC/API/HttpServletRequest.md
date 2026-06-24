# HttpServletRequest

## getRemoteAddr

获取**客户端的 IP 地址**。如果前端经过了 Nginx 反向代理，这个方法拿到的可能是 Nginx 的内网 IP（如 `127.0.0.1`）。此时需要改拿 Nginx 转发的 Header：`request.getHeader("X-Forwarded-For")`。



## getMethod

获取**请求方式**



## getScheme

获取**请求协议**（如 `http` 或 `https`）

## getRequestURI

拿到路径，例如` "/api/user/search"`。这个路径不包含QueryString

## getRequestURL

- **`request.getRequestURL()`**：长（**L**ong），返回**带域名**的全路径（如 `http://localhost:8080/api/user`）。

- **`request.getRequestURI()`**：短（**I**ntermediate），返回**不带域名**的纯接口路径（如 `/api/user`）。

## getQueryString

在写请求日志时，我们通常希望把请求的完整 URL（包含参数）打印出来，但是HttpServletRequest并没有提供直接获取完整URL的方法，我们只能使用 `getQueryString()` 进行拼接

```java
String uri = request.getRequestURI(); // 拿到路径，例如 "/api/user/search"
String queryString = request.getQueryString(); // 拿到原始参数字符串

// 如果有参数，就用问号拼接；没有参数，就直接用 URI
String fullUrl = (queryString != null) ? (uri + "?" + queryString) : uri;
```



## getParameterMap

**`request.getParameterMap()`** 是用来**获取前端发送的所有 Query 参数（URL 拼接参数）和 Form 表单数据**（`application/x-www-form-urlencoded`）的方法。

`request.getParameterMap()` 会**全盘接收，统一合并到同一个 Map 中**。

```http
GET /api/user/search?type=admin&tags=java&tags=vue
```

注意这里的 `tags` 传了两次。此时，Java 后端通过 `request.getParameterMap()` 拿到的数据结构其实是这样的：

```json
{
    "type": ["admin"],
    "tags": ["java", "vue"]  // 同名参数的值会被放入数组中
}
```

::: warning getParameterMap返回的 Map 是只读的。

```java
Map<String, String[]> paramMap = request.getParameterMap();
paramMap.put("userId", new String[]{"123"}); // ❌ 会直接抛出异常！
```

:::

`request.getParameterMap()` 无法读取到上传的文件数据（二进制流）。二进制文件流，超出了该方法的设计处理范围。



## getInputStream

**`request.getInputStream()`**：获取字节输入流（`ServletInputStream`）。常用于处理**二进制数据、文件上传**

## getContentType



## getParts

当表单以 `enctype="multipart/form-data"` 提交时，请求体会被切分成多个部分（Parts）。

- **普通表单文本字段**（如 `username`）会是一个 Part。
- **上传的文件**（如 `avatar.png`）也会是一个 Part。

`getParts()` 的返回值是 `Collection<Part>`，它包含了这次请求中的所有部分。



## Header

**`request.getHeader(String name)`**：最常用。获取指定名称的请求头的值（如获取 Token）。

```java
String token = request.getHeader("Authorization");
```

**`request.getHeaderNames()`**：获取前端传过来的所有 Header 的名字。

## 域对象（Attribute）

你可以在 Filter 里往 `request` 里存数据，Controller 里直接取。

**`request.setAttribute(String name, Object o)`**：在请求域中**保存数据**。

- *典型场景：* 在 Filter 里解析 Token 拿到 `userId`，然后 `request.setAttribute("currentUserId", userId);`，后面的 Controller 就能直接拿来用，不用重复解析 Token。

**`request.getAttribute(String name)`**：在后续的拦截器或 Controller 中**获取数据**。

**`request.removeAttribute(String name)`**：移除指定的属性。
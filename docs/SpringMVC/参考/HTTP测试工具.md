# HTTP测试工具

HTTP 文件（通常以 `.http` 或 `.rest` 为后缀）是一种**用于声明和执行 HTTP 请求的纯文本文件**。

它在Springboot项目中非常流行，常被用作轻量级的 API 测试工具，直接用来替代 Postman 或 Swagger 的部分功能。

## 优势

- **纯文本、版本控制友好**：因为是纯文本，可以完美直接提交到 Git 仓库，方便团队共享和追踪 API 的变更。
- **代码编辑器原生支持**：
  - **IntelliJ IDEA**：内置支持，点击代码左侧的“绿色小箭头”即可直接发送请求。
  - **VS Code**：安装 `REST Client` 插件后，同样可以一键运行。
- **支持变量与多环境**：可以定义开发（dev）、测试（test）环境的变量，轻松切换。



## 基本语法

一个标准的 `.http` 文件语法非常简单直观，主要由**请求行**、**请求头**和**请求体**组成，多个请求之间使用 `###`（三个井号）进行分隔。

### GET

```java
### 获取用户列表
GET http://localhost:8080/api/users?page=1&size=10
Accept: application/json
```

### POST

**注意**：请求头和请求体之间必须要有一个**空行**。

```java
### 创建新用户
POST http://localhost:8080/api/users
Content-Type: application/json

{
  "username": "developer_code",
  "email": "dev@example.com",
  "role": "admin"
}
```

### 上传文件



## 变量

你可以定义局部变量，或者在单独的环境配置文件（如 `http-client.env.json`）中定义多环境变量：

```java
@baseUrl = http://localhost:8080
@authToken = Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

### 获取当前登录用户信息
GET {{baseUrl}}/api/profile
Authorization: {{authToken}}
```

## 环境

可以新建一个`http-client.env.json`文件定义环境变量。在运行HTTP文件时，我们可以选择运行时环境

```json
{
  "dev": {
    "token": "debug-token-for-local",
    "host": "http://localhost:9734"
  },
  "prod": {
    "token": "your-token-for-production",
    "host": "https://your-production-host.com"
  }
}
```




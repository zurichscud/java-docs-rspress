# Ant路径匹配

**Ant路径（Ant-style Path Pattern）** 是一种 **路径匹配规则**，最早来自 Apache Ant，后来被 Spring Framework 广泛使用，例如：

- Spring MVC 请求映射
- Spring Boot 静态资源映射
- Spring Security 路径匹配

它主要用于 **URL 或文件路径的通配匹配**。

## 规则

- `?`：匹配一个字符

```
/test?.jsp
```

```
/test1.jsp #匹配
/testA.jsp #匹配
/test10.jsp #不匹配
```

- `*`： 匹配任意字符（不包含 `/`）

```
/test/*.jsp
```

```
/test/a.jsp
/test/hello.jsp
```

- `**`：匹配任意路径

```
/test/**/*.jsp
```

```
/test/a.jsp
/test/a/b.jsp
/test/a/b/c.jsp
```

## 应用

- controller

```java
@GetMapping("/user/*")
public String test() {
    return "ok";
}
```

- 配置文件中的路径值

```
spring:
  mvc:
    static-path-pattern: /res/**
```


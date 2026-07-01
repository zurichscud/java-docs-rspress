# SLF4J

Springboot采用的是SLF4J （Simple Logging Facade for Java）接口

## 为什么需要日志框架

- 频繁使用`System.out.println()`会占用额外的CPU资源，尤其是高并发的场景下，可能会影响应用的性能

- 控制台输出无法长期保存和检索

- 缺乏灵活性



## 常见的实现

### Log4j

Apache维护的古老日志项目

### Log4j2

Log4j2是Log4j的下一代版本，性能更优

### Logback

Log4j的创始人开发的另一个日志框架。比Log4j的性能更好

### JUL

Java SE中的日志框架，不需要额外的库文件

## Logger

Logger 判断当前级别（如 INFO），决定要不要记录（捕获）这条日志。

### 日志级别

```java
TRACE < DEBUG < INFO < WARN < ERROR
```

如果日志级别是INFO，则日志包含INFO、WARN、ERROR。

我们可以指定项目中不同文件的日志级别。root表示整个项目的日志级别，日志级别采用局部优先策略

```yaml [application.yaml]
logging:
  level:
    root: debug
    org.springframework: warn
    com.claims: debug
```

### 日志分组

它可以让你把多个不同的包（packages）组合成一个单一的日志组，然后针对这个组统一设置日志级别。

比如，你不用再麻烦地为 org.hibernate、org.springframework 分别写好几行配置，直接给它们打包成一个组就能一键管理。

```yaml
logging:
  # 1. 定义分组
  group:
    # 定义一个名为 tomo 的分组，包含自定义的包和第三方包
    tomo:
      - com.example.demo.controller
      - com.example.demo.service
      - org.mybatis
    # 再定义一个名为 sql 的分组
    sql:
      - org.hibernate.SQL
      - org.mybatis.logging

  # 2. 控制分组的日志级别
  level:
    tomo: info
    sql: debug
```

## Appender

Logger（记录器）负责捕获日志，Appender（输出源）则负责把这些日志“送往何处”。

```java
logger（记录日志） → appender（输出日志） → 输出目标（文件/控制台/远程等）
```

常见的 Appender 类型：

### ConsoleAppender

ConsoleAppender（控制台输出）

### FileAppender / RollingFileAppender

- 目的地：服务器的本地磁盘文件（如 logs/app.log）。
- 高级版（Rolling）：支持滚动策略。比如每天生成一个新的日志文件，或者文件超过 10MB 就自动切分并压缩（.gz），防止单文件过大撑爆磁盘。

### AsyncAppender

在默认情况下，Logback 或 Log4j2 的 Appender（比如 ConsoleAppender 或 FileAppender）都是同步（Synchronous）的。

这意味着，当你的代码执行到 logger.info() 时，当前线程（处理用户请求的业务线程）必须停下来，等待日志框架完成以下一系列操作：

1. 组装日志字符串。

2. 将数据写入磁盘文件（或者是控制台/网络）。

3. 磁盘 I/O 完成后，业务线程才能继续往下执行。

痛点：磁盘 I/O 的速度比内存慢成千上万倍。如果碰上高并发、磁盘繁忙，或者日志量突然暴增，业务线程就会死死卡在写日志这一步，导致接口响应变慢，甚至引发整个服务雪崩。

AsyncAppender本身不输出到目的地，而是作为包裹其他 Appender 的“壳”。

```xml
<appender name="ASYNC_ERROR" class="ch.qos.logback.classic.AsyncAppender">
    <queueSize>512</queueSize>
    <appender-ref ref="ERROR_FILE"/>
</appender>
```





## 日志框架切换

Log4j2在性能上比Logback好，我们引入Log4j2需要排除Logback依赖：

```xml
<!-- 排除默认日志 -->
<exclusions>
    <exclusion>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-logging</artifactId>
    </exclusion>
</exclusions>

<!-- 引入log4j2 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-log4j2</artifactId>
</dependency>
```



## 文件归档

日志按天进行归档

## 文件切割

文件超限时进行文件切割

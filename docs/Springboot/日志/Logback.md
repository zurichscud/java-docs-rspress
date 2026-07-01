# Logback

Springboot默认使用Logback作为日志框架

## 默认配置

### spring-boot-starter-logging

- 核心场景启动器`spring-boot-starter`中引入了`spring-boot-starter-logging`
- Spring Boot 默认日志体系：SLF4J（接口） + Logback（实现）
- 默认日志级别是INFO
- 日志是系统一旦启动就要使用，因此日志依赖没有使用`AutoConfiguration`，而是使用了`ApplicationListener`

### 日志格式

当你启动一个 Spring Boot 项目时，控制台通常会打印出类似这样的日志：

```sh
2026-07-01 17:52:30.123  INFO 12345 --- [main] c.e.demo.DemoApplication : Started DemoApplication in 1.5 seconds
```

| **示例内容**                       | **对应含义**   | **占位符（Pattern）**         | **说明**                                                     |
| ---------------------------------- | -------------- | ----------------------------- | ------------------------------------------------------------ |
| **`2026-07-01 17:52:30.123`**      | 日期与时间     | `%d{yyyy-MM-dd HH:mm:ss.SSS}` | 精确到毫秒。                                                 |
| **`INFO`**                         | 日志级别       | `%-5level`                    | 占 5 个字符宽度，左对齐（ERROR, WARN, INFO, DEBUG, TRACE）。 |
| **`12345`**                        | 进程 ID (PID)  | `${PID:-}`                    | 当前运行的 Java 进程号。                                     |
| **`---`**                          | 分隔符         | `---`                         | 纯粹的视觉分隔符，没有实际含义。                             |
| **`[main]`**                       | 线程名称       | `[%thread]`                   | 产生该日志的线程，外层用方括号包裹。                         |
| **`c.e.demo.DemoApplication`**     | 产生日志的类名 | `%logger{36}`                 | 通常是类的全限定名，默认会进行缩写（长度限制 36）。          |
| **`: Started DemoApplication...`** | 日志具体消息   | `%msg%n`                      | 冒号后跟实际打印的文本，最后 `%n` 换行。                     |



## 配置项

application.yaml

```yaml
# 控制日志级别
logging:
  level:
    root: info
    com.xxx: debug
```





## 配置文件

yaml 并不可以完全替代 logback的配置文件，yaml 只是“简化入口”，不是完整配置。但是application.yaml的优先级会比XML的优先级高



### logback.xml

Logback的配置文件

### logback-spring.xml

`logback-spring.xml` 支持 Spring 特性：支持 profile

```xml
<springProfile name="dev">
    <!-- 开发环境配置 -->
</springProfile>

<springProfile name="prod">
    <!-- 生产环境配置 -->
</springProfile>
```

## 最佳实践

`logback-spring.xml` ：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration scan="true" scanPeriod="60 seconds">

    <!-- 日志路径 -->
    <!--  app.log       ← 当前正在写
    app.2026-04-23.log  ← 昨天的
    app.2026-04-22.log  ← 前天的  -->·
    <property name="LOG_HOME" value="./logs"/>
    <property name="APP_NAME" value="app"/>

    <!-- 日志格式 -->
    <property name="LOG_PATTERN"
              value="%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n"/>

    <!-- ================== 控制台输出 ================== -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>${LOG_PATTERN}</pattern>
        </encoder>
    </appender>

    <!-- ================== INFO日志（按天滚动） ================== -->
    <appender name="INFO_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${LOG_HOME}/${APP_NAME}.log</file>

        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!-- 按天切割 -->
            <fileNamePattern>${LOG_HOME}/${APP_NAME}.%d{yyyy-MM-dd}.log</fileNamePattern>
            <!-- 保留30天 -->
            <maxHistory>30</maxHistory>
        </rollingPolicy>

        <!-- 只记录 INFO 及以上 -->
        <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
            <level>INFO</level>
        </filter>

        <encoder>
            <pattern>${LOG_PATTERN}</pattern>
        </encoder>
    </appender>

    <!-- ================== ERROR日志（单独文件） ================== -->
    <appender name="ERROR_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${LOG_HOME}/error.log</file>

        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>${LOG_HOME}/error.%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>60</maxHistory>
        </rollingPolicy>

        <!-- 只记录 ERROR -->
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>ERROR</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>

        <encoder>
            <pattern>${LOG_PATTERN}</pattern>
        </encoder>
    </appender>

    <!-- ================== 异步日志 ================== -->
    <appender name="ASYNC_INFO" class="ch.qos.logback.classic.AsyncAppender">
        <!-- 队列大小 -->
        <queueSize>1024</queueSize>
        <!-- 丢弃阈值（避免阻塞） -->
        <discardingThreshold>0</discardingThreshold>
        <includeCallerData>false</includeCallerData>

        <appender-ref ref="INFO_FILE"/>
    </appender>

    <appender name="ASYNC_ERROR" class="ch.qos.logback.classic.AsyncAppender">
        <queueSize>512</queueSize>
        <appender-ref ref="ERROR_FILE"/>
    </appender>

    <!-- ================== 开发环境 ================== -->
    <springProfile name="dev">
        <root level="DEBUG">
            <appender-ref ref="CONSOLE"/>
            <!--开发环境不想要输出文件，可以注释-->
            <appender-ref ref="ASYNC_INFO"/>
            <appender-ref ref="ASYNC_ERROR"/>
        </root>
    </springProfile>

    <!-- ================== 测试环境 ================== -->
    <springProfile name="test">
        <root level="DEBUG">
            <appender-ref ref="ASYNC_INFO"/>
            <appender-ref ref="ASYNC_ERROR"/>
        </root>
    </springProfile>

    <!-- ================== 生产环境 ================== -->
    <springProfile name="prod">
        <root level="INFO">
            <!-- 生产建议关闭控制台 -->
            <!-- <appender-ref ref="CONSOLE"/> -->
            <appender-ref ref="ASYNC_INFO"/>
            <appender-ref ref="ASYNC_ERROR"/>
        </root>
    </springProfile>

</configuration>
```


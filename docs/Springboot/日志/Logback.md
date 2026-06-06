# Logback

## Logger

### 日志级别（level）

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



## appender

**appender（输出器）** 是日志系统的一个核心组件

```java
logger（记录日志） → appender（输出日志） → 输出目标（文件/控制台/远程等）
```



## 配置文件

### application.yaml

yaml 并不可以完全替代 logback的配置文件，yaml 只是“简化入口”，不是完整配置。

::: warning

application.yaml的优先级会比XML的优先级高

:::

```yaml
# 控制日志级别
logging:
  level:
    root: info
    com.xxx: debug
```



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

## 日志文件

对于开发环境，当前路径是项目根路径

## 最佳实践

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


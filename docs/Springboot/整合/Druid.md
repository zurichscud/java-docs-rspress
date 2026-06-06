# Druid

## 依赖引入

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid-spring-boot-starter</artifactId>
    <version>1.2.20</version>
</dependency>
```

## 配置

```yaml
spring:
  datasource:
    type: com.alibaba.druid.pool.DruidDataSource
    url: jdbc:mysql://localhost:3306/test
    username: root
    password: 123456

    druid:
      initial-size: 5
      max-active: 20
      min-idle: 5
      max-wait: 60000

      # 监控
      filters: stat,wall,slf4j
```



## 多数据源

```yaml
spring:
  datasource:
    druid:
      master:
        url: jdbc:mysql://localhost:3306/master_db
      slave:
        url: jdbc:mysql://localhost:3306/slave_db
```





## 开启监控页面（可选）

```yaml
spring:
  datasource:
    druid:
      stat-view-servlet:
        enabled: true
        login-username: admin
        login-password: admin
```


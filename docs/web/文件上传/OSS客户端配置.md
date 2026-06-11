# Springboot配置客户端

## OSSConfig

```java
@Data
@NoArgsConstructor
@Component
@ConfigurationProperties(prefix = "app.oss")
public class OssProperties {

    private boolean enabled;

    private String endpoint;

    private String bucket;

    private String accessKeyId;

    private String accessKeySecret;

    private String prefix;
}
```

## 创建OSS客户端

创建OSS客户端的单例，具体原因如下：

1. **性能考虑**

- 创建 OSSClient（或 S3Client）涉及初始化 HTTP 连接池、签名认证等操作，每次请求都创建会很慢。
- 共用客户端可以复用底层连接池，提高吞吐量。

2. **资源消耗**

- 客户端内部维护线程池和连接池，每次新建都会占用额外内存和线程。
- 高并发场景下，如果每个分片都新建客户端，会导致大量连接/线程泄露风险。

3. **线程安全**

- 阿里 OSS 官方文档和 AWS S3 SDK 都说明：**OSSClient / S3Client 是线程安全的**，可以多线程或多请求共用。

```java
@Configuration
public class OssConfig {

    @Bean
    public OSS ossClient(
            @Value("${oss.endpoint}") String endpoint,
            @Value("${oss.accessKeyId}") String accessKeyId,
            @Value("${oss.accessKeySecret}") String accessKeySecret) {
        return new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);
    }
}
```


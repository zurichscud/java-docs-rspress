# AbstractHttpMessageConverter



## 默认实现

### canRead/canWrite

`HttpMessageConverter`接口定义了 `canRead` 和 `canWrite` 方法，`AbstractHttpMessageConverter` 对它们进行了默认实现：

```java
public boolean canRead(Class<?> clazz, @Nullable MediaType mediaType) {
    // 1. 检查子类是否支持该 Java 类型
    if (!supports(clazz)) {
        return false;
    }
    // 2. 如果请求没传 Media-Type（例如没有 Content-Type 头部），默认允许读取
    if (mediaType == null) {
        return true;
    }
    // 3. 遍历当前转换器支持的 MediaType 列表，看看是否包含请求的 MediaType
    for (MediaType supportedMediaType : getSupportedMediaTypes()) {
        if (supportedMediaType.includes(mediaType)) {
            return true;
        }
    }
    return false;
}
```

- 它会先调用 `supports(Class<?> clazz)`（由子类实现，判断是否支持该 Java 类型）。
- 接着检查 `MediaType` 是否匹配。
- 只有两个条件都满足，才会真正进行数据转换。

### read/write

```java
public abstract class AbstractHttpMessageConverter<T> implements HttpMessageConverter<T> {

    // 1. 框架和外部调用这个公开方法
    @Override
    public final T read(Class<? extends T> clazz, HttpInputMessage inputMessage) {
        // A. 统一的准备工作：检查媒体类型、设置字符集等
        prepareInputMessage(inputMessage); 
        
        try {
            // B. 核心步骤：调用子类各自的“内部”实现
            return readInternal(clazz, inputMessage); 
        } catch (Exception ex) {
            // C. 统一的异常处理
            throw new HttpMessageNotReadableException("解析失败", ex);
        }
    }

    // 2. 留给子类去自由发挥的“内部”方法
    protected abstract T readInternal(Class<? extends T> clazz, HttpInputMessage inputMessage);
}
```

`Internal`表示内部的

## MediaType匹配算法

在实际的 HTTP 请求中，客户端（如浏览器、复杂的 API 网关或 Axios）发送的 `Accept` 请求头经常包含通配符，例如：

- `Accept: application/*`（接收 application 大类下的任何格式）
- `Accept: */*`（接收任何格式）

父类 `AbstractHttpMessageConverter` 内部的 `canRead` 并不是做简单的字符串相等比较，而是调用了 `supportedMediaType.includes(mediaType)`。它内置了复杂的**通配符匹配算法**：如果你的转换器支持 `application/x-yaml`，当客户端发来 `Accept: application/*` 时，父类的逻辑能正确判定为“匹配”，从而放行。

如果你自己去重写 `canRead`，为了兼容这些标准 HTTP 协议的通配符，你就必须把 Spring 源码里那套复杂的匹配逻辑自己重新写一遍。



## 统一处理 HTTP 头部信息

在写入响应时，它会自动帮你处理和补全关键的 HTTP 头部：

- **Content-Type：** 自动根据当前选择的媒体类型和字符集（如 `UTF-8`）设置 `Content-Type`。
- **Content-Length：** 如果能够提前计算出数据流的大小（例如通过 `ByteArrayOutputStream`），它会自动设置 `Content-Length` 头部，避免浏览器因为不知道长度而出现解析问题。

## 子类应该实现什么

`AbstractHttpMessageConverter` 采用了**模板方法（Template Method）设计模式**。它把通用的逻辑自己全部实现了，而把和具体格式相关的核心读写逻辑，留给了子类去实现。

子类**必须实现**的抽象方法主要有以下三个：

### supports

```java
protected abstract boolean supports(Class<?> clazz);
```

告诉父类，当前转换器**是否支持处理这个 Java 类型**的转换。

### readInternal

```java
protected abstract T readInternal(Class<? extends T> clazz, HttpInputMessage inputMessage) throws IOException, HttpMessageNotReadableException;
```

**反序列化核心**。当父类的 `canRead` 校验通过后，会调用这个方法，由子类负责把 HTTP 请求体中的数据转换成 Java 对象。

### writeInternal

```java
protected abstract void writeInternal(T t, HttpOutputMessage outputMessage) throws IOException, HttpMessageNotWritableException;
```

**序列化核心**。当父类的 `canWrite` 校验通过后，会调用这个方法，由子类负责把 Java 对象转换成指定格式的数据写入 HTTP 响应体。

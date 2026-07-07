# JSON处理

## Jackson

消息转换器：`MappingJackson2HttpMessageConverter`

```java
// 序列化：Java 对象 → JSON 字符串
ObjectMapper mapper = new ObjectMapper();
String json = mapper.writeValueAsString(user);

// 反序列化：JSON 字符串 → Java 对象
User user = mapper.readValue(json, User.class);
```

很多开发者在刚接触 `ObjectMapper` 时，担心多线程并发请求会导致数据混乱，所以习惯每次都 `new` 一个新的实例。

但 Jackson 官方在设计时就已经明确：**一旦 `ObjectMapper` 实例化并配置完成后（即不再动态修改配置），它的所有读写操作（`readValue` 和 `writeValueAsString`）都是绝对线程安全的。**

多线程并发调用同一个 `ObjectMapper` 实例的读写方法时，内部使用的都是局部变量和线程安全的上下文，绝对不会发生数据交叉或线程冲突。



## Gson

消息转换器：`GsonHttpMessageConverter`

```java
// 序列化：Java 对象 → JSON 字符串
Gson gson = new Gson();
String json = gson.toJson(user);

// 反序列化：JSON 字符串 → Java 对象
User user = gson.fromJson(json, User.class);
```

## Fastjson

消息转换器：`FastJsonHttpMessageConverter`

```java
// 序列化：Java 对象 → JSON 字符串
String json = JSON.toJSONString(user);

// 反序列化：JSON 字符串 → Java 对象
User user = JSON.parseObject(json, User.class);
```




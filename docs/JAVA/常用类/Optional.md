# Optional

## ifPresent

如果有值就执行，没有就什么都不做。

结合 Stream 使用：找到第一个元素并处理

```java
list.stream()
    .filter(x -> x > 10)
    .findFirst()
    .ifPresent(x -> {
        System.out.println(x);
    });
```

```java
Stream → findFirst() → Optional → ifPresent()
```


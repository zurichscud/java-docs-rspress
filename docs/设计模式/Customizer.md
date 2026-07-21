# Customizer

`Customizer<T>` 就是 Spring 团队为了**提升语义可读性**而对 `Consumer<T>` 进行的一层语义包装。

```java
// Java 8 标准库
@FunctionalInterface
public interface Consumer<T> {
    void accept(T t);
}

// Spring 框架定义
@FunctionalInterface
public interface Customizer<T> {
    void customize(T t);

    static <T> Customizer<T> withDefaults() {
        return (t) -> {};
    }
}
```

Customizer返回的是一个空的对象实现

在 Spring 框架中，`withDefaults()` 方法的作用是：**当用户不想写任何自定义配置、只希望应用框架默认设置时，提供一个合法的入参对象。**

```
// 表示：应用表单登录，但不进行任何额外的自定义修改（全部使用 Spring 的默认规则）
.formLogin(Customizer.withDefaults())
//不需要这样写：
.formLogin(t->{})
```

如果方法不提供 `withDefaults()`，用户或者框架在处理“默认配置”时，可能需要传递 `null`，这就强制代码里充斥着空指针检查：

```java
// 如果没有 withDefaults()，可能需要这样防空
if (customizer != null) {
    customizer.customize(configurer);
}
```

而 `return (t) -> {};` 返回了一个**有类型、无行为**的“空对象”，使得调用方可以**无脑直接执行 `customizer.customize(obj)`**，彻底消除了 `NullPointerException` 的隐患。
# PropertyEditor



## PropertyEditor

`java.beans.PropertyEditor` 是 JDK 自带的一个原生接口，它的方法非常多，是为GUI设计的。现常用于Springboot的`@InitBinder`类型转换接口。

这个接口没有默认实现，因为他设计较早，当时Java还不支持接口的默认实现语法。

如果我们直接 `implements PropertyEditor`，就必须把这 12 个方法全都重写一遍，哪怕绝大多数方法我们根本用不上（代码会变得非常臃肿）。



## PropertyEditorSupport

`PropertyEditorSupport` 是 JDK 提供的一个抽象类，它已经帮我们把 `PropertyEditor` 接口里的那十几个繁琐的方法全部做了默认实现（空实现或基本实现）。

我们继承它之后，**只需要聚焦于我们关心的核心方法即可**。在 Spring MVC 参数绑定场景下，我们通常只需要重写以下两个方法（甚至通常只需要重写一个）：

### setAsText

```java
setAsText(String text)
```

【核心】入参text是前端传来的字符串，你要在这里把它转成 Java 对象，并调用 `setValue(obj)` 存起来。

```java
    @InitBinder
    public void initBinder(WebDataBinder binder)
    {
        // Date 类型转换
        binder.registerCustomEditor(Date.class, new PropertyEditorSupport()
        {
            @Override
            public void setAsText(String text)
            {
                setValue(DateUtils.parseDate(text));
            }
        });
    }
```

::: tip 为什么要将值传给setValue？

PropertyEditor之所以不设计成 `Object setAsText(String text)` 这种带返回值的直观形式，而是分成 `setAsText` 和 `setValue` 两个步骤，是因为它**最初的定位是“状态监听器”，而不是一个“纯粹的函数式转换器”**。

:::

### getAsText

【可选】把 Java 对象转回字符串。
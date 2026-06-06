# Iterator

Iterator 是一个“迭代器”，用于按顺序访问集合中的元素

## Iterator接口

```java
boolean hasNext();  // 是否还有下一个元素
E next();           // 获取下一个元素
void remove();      // 删除当前元素（可选操作）
```

`Iterator` 的指针（cursor）**初始位置在第一个元素之前**

## 获取迭代器

```java
Collection<String> list = new ArrayList<>();
list.add("A");
list.add("B");

Iterator<String> it = list.iterator();
```



## 迭代

迭代通常与`while`搭配

```java
Iterator<String> it = list.iterator();

while (it.hasNext()) {
    String val = it.next();
    System.out.println(val);
}
```



## 增强for

在 **Java** 中，**增强 `for` 循环**（也叫 **foreach 循环**）是对普通 `for` 循环的简化

```java
for (元素类型 变量名 : 数组或集合) {
    // 使用变量名操作元素
}
```

- 冒号左边是 **元素类型 + 临时变量名**

- 冒号右边是 **数组或集合**

- 循环中 **变量名只是元素的副本**（对基本类型修改不会影响原数组，对对象类型修改对象属性会影响原对象，但不能修改引用本身）【浅拷贝】

增强for的本质是`Iterator`接口：

::: code-group

```java [编译前]
for (String s : list) {
    System.out.println(s);
}
```

编译后：

```java[编译后]
Iterator<String> it = list.iterator();
while (it.hasNext()) {
    String s = it.next();//浅拷贝
}
```

:::

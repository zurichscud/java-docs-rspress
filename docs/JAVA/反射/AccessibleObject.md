# AccessibleObject



## Methods

### `setAccessible(boolean flag)`

- 作用：临时取消访问检查
- 注意：通常用于访问 `private` 构造器、属性、方法

```java
Class<Person> clazz = Person.class;
Field field = clazz.getDeclaredField("name");

field.setAccessible(true);
```


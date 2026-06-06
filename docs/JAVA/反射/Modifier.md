# Modifier

`Modifier` 是一个工具类，用来解析类、属性、方法、构造器上的修饰符。

```java
public final class Person {
    private String name;
    public static final int MAX_AGE = 120;

    protected void show() {
    }
}
```

## Methods

### `toString(int mod)`

- 作用：将修饰符的整数值转换为可读字符串
- 返回值：`String`

```java
Class<Person> clazz = Person.class;
int modifiers = clazz.getModifiers();

System.out.println(Modifier.toString(modifiers)); // public final
```

### `isPublic(int mod)`

- 作用：判断是否包含 `public`
- 返回值：`boolean`

```java
Class<Person> clazz = Person.class;
int modifiers = clazz.getModifiers();

System.out.println(Modifier.isPublic(modifiers)); // true
```

### `isPrivate(int mod)`

- 作用：判断是否包含 `private`
- 返回值：`boolean`

```java
Field field = Person.class.getDeclaredField("name");
int modifiers = field.getModifiers();

System.out.println(Modifier.isPrivate(modifiers)); // true
```

### `isProtected(int mod)`

- 作用：判断是否包含 `protected`
- 返回值：`boolean`

```java
Method method = Person.class.getDeclaredMethod("show");
int modifiers = method.getModifiers();

System.out.println(Modifier.isProtected(modifiers)); // true
```

### `isStatic(int mod)`

- 作用：判断是否包含 `static`
- 返回值：`boolean`

```java
Field field = Person.class.getDeclaredField("MAX_AGE");
int modifiers = field.getModifiers();

System.out.println(Modifier.isStatic(modifiers)); // true
```

### `isFinal(int mod)`

- 作用：判断是否包含 `final`
- 返回值：`boolean`

```java
Field field = Person.class.getDeclaredField("MAX_AGE");
int modifiers = field.getModifiers();

System.out.println(Modifier.isFinal(modifiers)); // true
```

### `isAbstract(int mod)`

- 作用：判断是否包含 `abstract`
- 返回值：`boolean`

```java
System.out.println(Modifier.isAbstract(Person.class.getModifiers())); // false
System.out.println(Modifier.isAbstract(AbstractList.class.getModifiers())); // true
```

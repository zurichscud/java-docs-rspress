# Parameter

## implments

AnnotatedElement

```java
class Demo {
    public void test(final List<String> names) {
    }
}
```

## Methods

### `getName()`

- 作用：获取参数名
- 返回值：`String`
- 注意：如果编译时没有加 `-parameters`，通常拿到的是 `arg0`、`arg1`

```java
Class<Person> clazz = Person.class;
Method method = clazz.getDeclaredMethod("getInfo", String.class);
Parameter parameter = method.getParameters()[0];

System.out.println(parameter.getName()); // arg0
```

### `getType()`

- 作用：获取参数类型
- 返回值：`Class<?>`

```java
Class<Person> clazz = Person.class;
Method method = clazz.getDeclaredMethod("getInfo", String.class);
Parameter parameter = method.getParameters()[0];

System.out.println(parameter.getType().getSimpleName()); // String
```

### `getParameterizedType()`

- 作用：获取参数的完整泛型类型
- 返回值：`Type`

```java
Method method = Demo.class.getDeclaredMethod("test", List.class);
Parameter parameter = method.getParameters()[0];

System.out.println(parameter.getParameterizedType().getTypeName());
// java.util.List<java.lang.String>
```

### `getModifiers()`

- 作用：获取参数的修饰符
- 返回值：`int`
- 注意：通常配合 `Modifier.toString` 解析

```java
Method method = Demo.class.getDeclaredMethod("test", List.class);
Parameter parameter = method.getParameters()[0];

int modifiers = parameter.getModifiers();
System.out.println(Modifier.toString(modifiers)); // final
```

### `isNamePresent()`

- 作用：判断参数名是否保留在字节码中
- 返回值：`boolean`

```java
Class<Person> clazz = Person.class;
Method method = clazz.getDeclaredMethod("getInfo", String.class);
Parameter parameter = method.getParameters()[0];

System.out.println(parameter.isNamePresent()); // false
```

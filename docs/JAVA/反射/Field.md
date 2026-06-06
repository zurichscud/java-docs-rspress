# Field

## implments

AnnotatedElement

## extends

AccessibleObject

## Methods

### `get(Object obj)`

- 作用：读取对象的属性值

```java
Person person = new Person("Tom", 18);
Class<Person> clazz = Person.class;
Field field = clazz.getDeclaredField("name");

field.setAccessible(true);
Object value = field.get(person);

System.out.println(value); // Tom
```

### `set(Object obj, Object value)`

- 作用：修改对象的属性值

```java
Person person = new Person("Tom", 18);
Class<Person> clazz = Person.class;
Field field = clazz.getDeclaredField("name");

field.setAccessible(true);
field.set(person, "Jerry");

person.show(); // name=Jerry, age=18
```

### `getName()`

- 作用：获取属性名
- 返回值：`String`

```java
Class<Person> clazz = Person.class;
Field field = clazz.getDeclaredField("name");

System.out.println(field.getName()); // name
```

### `getType()`

- 作用：获取属性的类型
- 返回值：`Class<?>`

```java
Class<Person> clazz = Person.class;
Field field = clazz.getDeclaredField("age");

Class<?> type = field.getType();
System.out.println(type); // int
```


### `getModifiers()`

- 作用：获取属性的修饰符
- 返回值：`int`
- 注意：通常配合 `Modifier.toString` 解析

```java
Class<Person> clazz = Person.class;
Field field = clazz.getDeclaredField("name");

int modifiers = field.getModifiers();
System.out.println(Modifier.toString(modifiers)); // private
```

# Constructor

## implments

AnnotatedElement

## extends

AccessibleObject

## Methods

### `newInstance()`

- 作用：通过无参构造器创建对象
- 返回值：`T`

```java
Class<Person> clazz = Person.class;

Person person = clazz.getDeclaredConstructor().newInstance();
System.out.println(person);
```

### `newInstance(Object... initargs)`

- 作用：通过指定构造器创建对象
- 返回值：`T`

```java
Class<Person> clazz = Person.class;

Person person = clazz.getConstructor(String.class, int.class)
        .newInstance("Tom", 18);

person.show(); // name=Tom, age=18
```
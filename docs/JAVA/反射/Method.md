# Method

## implments

AnnotatedElement

## extends

AccessibleObject

## Methods

### `invoke(Object obj, Object... args)`

- 作用：执行方法
- 注意：根据传入的args确定调用哪一个方法

```java
Person person = new Person("Tom", 18);
Class<Person> clazz = Person.class;
Method method = clazz.getMethod("show");

method.invoke(person); // name=Tom, age=18
```

通过反射执行私有方法

```java
Person person = new Person("Tom", 18);
Class<Person> clazz = Person.class;
Method method = clazz.getDeclaredMethod("getInfo", String.class);

method.setAccessible(true);
Object result = method.invoke(person, "info:");

System.out.println(result); // info:Tom-18
```



### `getName()`

- 作用：获取方法名
- 返回值：`String`

```java
Class<Person> clazz = Person.class;
Method method = clazz.getMethod("show");

System.out.println(method.getName()); // show
```


### `getParameters()`

- 作用：获取方法的参数对象列表
- 返回值：`Parameter[]`
- 注意：如果想获取源码中的参数名，编译时通常需要加 `-parameters`

```java
Class<Person> clazz = Person.class;
Method method = clazz.getDeclaredMethod("getInfo", String.class);

Parameter[] parameters = method.getParameters();
for (Parameter parameter : parameters) {
    System.out.println(parameter.getType().getSimpleName());
}

// String
```


### `getParameterTypes()`

- 作用：获取方法参数类型列表
- 返回值：`Class<?>[]`

```java
Class<Person> clazz = Person.class;
Method method = clazz.getDeclaredMethod("getInfo", String.class);

Class<?>[] parameterTypes = method.getParameterTypes();
for (Class<?> parameterType : parameterTypes) {
    System.out.println(parameterType.getSimpleName());
}

// String
```


### `getModifiers()`

- 作用：获取方法的修饰符
- 返回值：`int`
- 注意：通常配合 `Modifier.toString` 解析

```java
Class<Person> clazz = Person.class;
Method method = clazz.getDeclaredMethod("getInfo", String.class);

int modifiers = method.getModifiers();
System.out.println(Modifier.toString(modifiers)); // private
```


### `getReturnType()`

- 作用：获取方法返回值类型
- 返回值：`Class<?>`

```java
Class<Person> clazz = Person.class;
Method method = clazz.getDeclaredMethod("getInfo", String.class);

Class<?> returnType = method.getReturnType();
System.out.println(returnType.getSimpleName()); // String
```

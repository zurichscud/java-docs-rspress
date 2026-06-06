# Class

```java
@Deprecated
public class Person {
    private String name;
    public int age;

    public Person() {
    }

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void show() {
        System.out.println("name=" + name + ", age=" + age);
    }

    private String getInfo(String prefix) {
        return prefix + name + "-" + age;
    }
}
```

## 获取 `Class` 对象

### `类名.class`

- 作用：已知具体类型时，直接获取 `Class` 对象
- 返回值：`Class<T>`

```java
Class<Person> clazz = Person.class;
```

### `getClass()`

- 作用：通过对象实例获取运行时类型
- 返回值：`Class<? extends T>`

```java
Person person = new Person("Tom", 18);
Class<? extends Person> clazz = person.getClass();
```

### `Class.forName(String className)`

- 作用：通过全类名动态加载类
- 返回值：`Class<?>`

```java
Class<?> clazz = Class.forName("com.ai.Person");
```

## 基本信息

### `getName()`

- 作用：获取类的全类名
- 返回值：`String`

```java
Class<Person> clazz = Person.class;

System.out.println(clazz.getName()); // com.ai.Person
```

### `getSimpleName()`

- 作用：获取不带包名的类名
- 返回值：`String`

```java
Class<Person> clazz = Person.class;

System.out.println(clazz.getSimpleName()); // Person
```

### `getPackage()`

- 作用：获取类所在的包
- 返回值：`Package`

```java
Class<Person> clazz = Person.class;

System.out.println(clazz.getPackage().getName()); // com.ai
```

### `getModifiers()`

- 作用：获取类的修饰符
- 返回值：`int`
- 注意：通常配合 `Modifier.toString` 解析

```java
Class<Person> clazz = Person.class;
int modifiers = clazz.getModifiers();

System.out.println(Modifier.toString(modifiers)); // public
```

### `getSuperclass()`

- 作用：获取父类的 `Class` 对象
- 返回值：`Class<? super T>`

```java
Class<Person> clazz = Person.class;

System.out.println(clazz.getSuperclass().getName()); // java.lang.Object
```

### `getInterfaces()`

- 作用：获取当前类实现的所有接口
- 返回值：`Class<?>[]`

```java
Class<ArrayList> clazz = ArrayList.class;

Class<?>[] interfaces = clazz.getInterfaces();
for (Class<?> anInterface : interfaces) {
    System.out.println(anInterface.getName());
}
```

### `isInterface()`

- 作用：判断当前类型是否为接口
- 返回值：`boolean`

```java
System.out.println(List.class.isInterface());   // true
System.out.println(Person.class.isInterface()); // false
```

### `isArray()`

- 作用：判断当前类型是否为数组类型
- 返回值：`boolean`

```java
System.out.println(String[].class.isArray()); // true
System.out.println(Person.class.isArray());   // false
```


## 构造器

### `getConstructors()`

- 作用：获取所有 `public` 构造器
- 返回值：`Constructor<?>[]`

```java
Class<Person> clazz = Person.class;

Constructor<?>[] constructors = clazz.getConstructors();
for (Constructor<?> constructor : constructors) {
    System.out.println(constructor);
}
```

### `getDeclaredConstructors()`

- 作用：获取当前类声明的所有构造器，包括 `private`
- 返回值：`Constructor<?>[]`

```java
Class<Person> clazz = Person.class;

Constructor<?>[] constructors = clazz.getDeclaredConstructors();
for (Constructor<?> constructor : constructors) {
    System.out.println(constructor);
}
```

### `getConstructor(Class<?>... parameterTypes)`

- 作用：获取指定参数列表的 `public` 构造器
- 返回值：`Constructor<T>`

```java
Class<Person> clazz = Person.class;

Constructor<Person> constructor = clazz.getConstructor(String.class, int.class);
System.out.println(constructor);
```

### `getDeclaredConstructor(Class<?>... parameterTypes)`

- 作用：获取指定参数列表的构造器，包括 `private`
- 返回值：`Constructor<T>`

```java
Class<Person> clazz = Person.class;

Constructor<Person> constructor = clazz.getDeclaredConstructor();
System.out.println(constructor);
```


## 方法

### `getMethods()`

- 作用：获取所有 `public` 方法，包括继承自父类的方法
- 返回值：`Method[]`

```java
Class<Person> clazz = Person.class;

Method[] methods = clazz.getMethods();
for (Method method : methods) {
    System.out.println(method.getName());
}
```

### `getDeclaredMethods()`

- 作用：获取当前类声明的所有方法，包括 `private`
- 返回值：`Method[]`

```java
Class<Person> clazz = Person.class;

Method[] methods = clazz.getDeclaredMethods();
for (Method method : methods) {
    System.out.println(method.getName());
}
```

### `getMethod(String name, Class<?>... parameterTypes)`

- 作用：获取指定名称和参数列表的 `public` 方法
- 返回值：`Method`

```java
Class<Person> clazz = Person.class;

Method method = clazz.getMethod("show");
System.out.println(method.getName()); // show
```

### `getDeclaredMethod(String name, Class<?>... parameterTypes)`

- 作用：获取指定名称和参数列表的方法，包括 `private`
- 返回值：`Method`

```java
Class<Person> clazz = Person.class;

Method method = clazz.getDeclaredMethod("getInfo", String.class);
System.out.println(method.getName()); // getInfo
```

## 属性

### `getFields()`

- 作用：获取所有 `public` 属性，包括继承的 `public` 属性
- 返回值：`Field[]`

```java
Class<Person> clazz = Person.class;

Field[] fields = clazz.getFields();
for (Field field : fields) {
    System.out.println(field.getName());
}
```

### `getDeclaredFields()`

- 作用：获取当前类声明的所有属性，包括 `private`
- 返回值：`Field[]`

```java
Class<Person> clazz = Person.class;

Field[] fields = clazz.getDeclaredFields();
for (Field field : fields) {
    System.out.println(field.getName());
}
```

### `getField(String name)`

- 作用：获取指定名称的 `public` 属性
- 返回值：`Field`

```java
Class<Person> clazz = Person.class;

Field field = clazz.getField("age");
System.out.println(field.getName()); // age
```

### `getDeclaredField(String name)`

- 作用：获取指定名称的属性，包括 `private`
- 返回值：`Field`

```java
Class<Person> clazz = Person.class;

Field field = clazz.getDeclaredField("name");
System.out.println(field.getName()); // name
```

## 注解

Class实现了`AnnotatedElement`

# AnnotatedElement

 **注解相关能力**

```java
public interface AnnotatedElement {}
```



## API

::: code-group

```java [A]
@Inherited
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@interface A {}
```

```java [B]
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@interface B {}
```

```java [Parent]
@A
@B
class Parent {}
```

```java [Child]
class Child extends Parent {}
```

:::



### `getAnnotations()`

- 作用：获取当前类上的所有运行时注解
- 返回值：`Annotation[]`

```java
Class<Child> clazz = Child.class;

Annotation[] annotations = clazz.getAnnotations();
for (Annotation annotation : annotations) {
    System.out.println(annotation);
}

// 可以获取到 @A
// 因为 @A 带有 @Inherited，会被 Child 继承
// 不能获取到 @B，因为 @B 没有 @Inherited
```

### `getDeclaredAnnotations()`

- 作用：获取当前类直接声明的所有注解
- 返回值：`Annotation[]`

```java
Class<Child> clazz = Child.class;

Annotation[] annotations = clazz.getDeclaredAnnotations();
for (Annotation annotation : annotations) {
    System.out.println(annotation);
}

System.out.println(annotations.length); // 0
```

### `getAnnotation(Class<A> annotationClass)`

- 作用：获取指定类型的注解
- 返回值：`A`

```java
Class<Child> clazz = Child.class;

A annotationA = clazz.getAnnotation(A.class);
B annotationB = clazz.getAnnotation(B.class);

System.out.println(annotationA != null); // true
System.out.println(annotationB != null); // false
```

### `isAnnotationPresent(Class<? extends Annotation> annotationClass)`

- 作用：判断当前类上是否存在某个注解
- 返回值：`boolean`

```java
Class<Child> clazz = Child.class;

boolean hasA = clazz.isAnnotationPresent(A.class);
boolean hasB = clazz.isAnnotationPresent(B.class);

System.out.println(hasA); // true
System.out.println(hasB); // false
```
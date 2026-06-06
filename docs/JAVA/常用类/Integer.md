# Integer

```java
public final class Integer extends Number implements Comparable<Integer>
```

## compare

```java
Integer.compare(10, 20); // -1
Integer.compare(20, 10); // 1
Integer.compare(10, 10); // 0
```

## equals

```java
Integer a = 100;
Integer b = 100;

a.equals(b); // true
```



```java
Integer.toBinaryString(10);  // "1010"
Integer.toHexString(10);     // "a"
Integer.toOctalString(10);   // "12"
```

## parseInt

字符串转为int

```java
int a = Integer.parseInt("123");
```

## valueOf

字符串转`Integer`

```java
Integer b = Integer.valueOf("123");
```


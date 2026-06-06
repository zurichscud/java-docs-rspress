# Comparable

`Comparable` 用于**定义“默认排序规则”**

## 接口定义

```java
public interface Comparable<T> {
    int compareTo(T o);
}
```



本质就是：**“当前对象 - 比较对象”**

| 返回值 | 含义          |
| --- | ----------- |
| > 0 | 当前对象 > 参数对象 |
| = 0 | 当前对象 = 参数对象 |
| < 0 | 当前对象 < 参数对象 |



## String

String已实现了Comparable接口，使用的是升序排序。

```java
String a = "apple";
String b = "banana";

System.out.println(a.compareTo(b)); // 负数（a < b）
```



## 自定义实现类



```java
    @Override
    public int compareTo(Object obj) {
        if (this == obj) return 0; // 引用相等直接返回 0
        if (!(obj instanceof Person)) {
            throw new IllegalArgumentException("Cannot compare Person with " + obj.getClass());
        }

        Person other = (Person) obj;

        // 按年龄升序
        int ageCompare = Integer.compare(this.age, other.age);
        if (ageCompare != 0) {
            return ageCompare;
        }

        // 年龄相等时按名字字母顺序
        return Objects.compare(this.name, other.name, String::compareTo);
    }
```


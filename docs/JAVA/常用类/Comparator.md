# Comparator

`Comparator` 用于**定义“临时 / 多种排序规则”**

## 为什么需要Comparator

| 对比点     | Comparable         | Comparator           |
| ---------- | ------------------ | -------------------- |
| 定义位置   | 类内部             | 类外部               |
| 方法       | compareTo          | compare              |
| 排序规则   | 只能有一个（默认） | 可以有多个比较器对象 |
| 是否侵入类 | 需要修改类         | 不需要               |
| 使用场景   | 自然排序           | 灵活排序             |

## 接口定义

```java
@FunctionalInterface
public interface Comparator<T> {
    int compare(T o1, T o2);
}
```

`o1` 和 `o2` 是要比较的两个对象

返回值规则跟 `compareTo` 一样：

| 返回值 | 含义    |
| ------ | ------- |
| > 0    | o1 > o2 |
| = 0    | o1 = o2 |
| < 0    | o1 < o2 |

## Example

```java
import java.util.*;

List<Integer> list = Arrays.asList(5, 2, 8, 1);

// 使用 Comparator
list.sort(new Comparator<Integer>() {
    @Override
    public int compare(Integer o1, Integer o2) {
        return Integer.compare(o1, o2);
    }
});

System.out.println(list); // [1, 2, 5, 8]
```

- 自定义对象：

```java
List<Person> people = new ArrayList<>();
people.add(new Person("Alice", 30));
people.add(new Person("Bob", 25));
people.add(new Person("Charlie", 30));

// 按年龄升序排序
people.sort(new Comparator<Person>() {
    @Override
    public int compare(Person p1, Person p2) {
        int ageCompare = Integer.compare(p1.getAge(), p2.getAge());
        if (ageCompare != 0) return ageCompare;
        return p1.getName().compareTo(p2.getName());
    }
});
```


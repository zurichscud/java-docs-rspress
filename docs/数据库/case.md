# case

## CASE VALUE

根据某个字段的值进行匹配。

```sql
CASE column_name
    WHEN value1 THEN result1
    WHEN value2 THEN result2
    ELSE result3
END
```

```sql
SELECT 
    name,
    CASE gender
        WHEN 1 THEN '男'
        WHEN 2 THEN '女'
        ELSE '未知'
    END AS gender_text
FROM user;
```

- 数据

| name | gender |
| ---- | ------ |
| 张三 | 1      |
| 李四 | 2      |
| 王五 | 3      |

- 查询结果

| name | gender_text |
| ---- | ----------- |
| 张三 | 男          |
| 李四 | 女          |
| 王五 | 未知        |

## CASE WHEN

可以写 **任意条件判断**。

```sql
CASE
    WHEN condition1 THEN result1
    WHEN condition2 THEN result2
    ELSE result3
END
```

```sql
SELECT 
    name,
    CASE
        WHEN score >= 90 THEN '优秀'
        WHEN score >= 60 THEN '及格'
        ELSE '不及格'
    END AS level
FROM student;
```

| name | score | level  |
| ---- | ----- | ------ |
| 张三 | 95    | 优秀   |
| 李四 | 70    | 及格   |
| 王五 | 50    | 不及格 |
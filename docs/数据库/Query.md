# Query

```sql
SELECT 字段
FROM 表名
WHERE 条件
GROUP BY 分组字段
HAVING 分组条件
ORDER BY 排序字段
LIMIT 分页;
```



## 基本查询

查询所有

```sql
SELECT * FROM user;
```

查询指定字段

```sql
SELECT id, name, age FROM user;
```

字段别名

```sql
SELECT name AS username, age AS user_age
FROM user;
```

计算字段

```sql
SELECT name, salary * 12 AS year_salary
FROM employee;
```

## 条件查询

```sql
SELECT * FROM user WHERE age = 18;
SELECT * FROM user WHERE age > 18;
SELECT * FROM user WHERE age != 18;
```

`AND / OR`连接多个条件

```sql
SELECT * FROM user
WHERE age > 18
AND status = 1;
```

`IN`

```sql
SELECT * FROM user
WHERE id IN (1,2,3);
```



## 聚合函数

对一组数据进行“汇总计算”，返回一个结果值。

| 函数    | 作用 |
| ------- | ---- |
| COUNT() | 数量 |
| SUM()   | 求和 |
| AVG()   | 平均 |
| MAX()   | 最大 |
| MIN()   | 最小 |

```sql
SELECT 
COUNT(*) AS total,
SUM(money) AS total_money,
AVG(money) AS avg_money
FROM orders;
```

`COUNT(*)` 是 **统计查询结果的行数（记录条数）**。

## 分页LIMIT

```sql
SELECT * FROM user
LIMIT 0, 10;   -- 第1页
```

公式：

```sql
LIMIT (page - 1) * size, size
```



## 排序

```sql
SELECT * FROM user
ORDER BY create_time DESC;
```

多个字段排序：

```sql
ORDER BY status ASC, create_time DESC;
```

## 分组

把某个字段值相同的数据放到一组，然后对每组做统计计算。

```sql
SELECT 分组字段, 聚合函数
FROM 表名
GROUP BY 分组字段;
```

| id   | name | status |
| ---- | ---- | ------ |
| 1    | 张三 | 1      |
| 2    | 李四 | 1      |
| 3    | 王五 | 0      |
| 4    | 赵六 | 0      |
| 5    | 小明 | 1      |

```sql
SELECT status, COUNT(*) AS total
FROM user
GROUP BY status;
```

| status | total |
| ------ | ----- |
| 0      | 2     |
| 1      | 3     |



## 多表查询

| **连接类型**   | **包含的内容** | **结果说明**                    |
| -------------- | -------------- | ------------------------------- |
| **INNER JOIN** | 仅交集         | 必须两边都有才显示              |
| **LEFT JOIN**  | 左全集 + 交集  | 左边一定有，右边没匹配则补 NULL |
| **RIGHT JOIN** | 右全集 + 交集  | 右边一定有，左边没匹配则补 NULL |

- user表

| id   | name |
| ---- | ---- |
| 1    | 张三 |
| 2    | 李四 |
| 3    | 王五 |
| 4    | 赵六 |

- orders 表

| id   | user_id | amount |
| ---- | ------- | ------ |
| 1    | 1       | 100    |
| 2    | 1       | 200    |
| 3    | 2       | 300    |
| 4    | 5       | 400    |

### INNER JOIN

它只返回两个表中**完全匹配**的行。

```sql
SELECT u.name, o.amount
FROM user u
INNER JOIN orders o
ON u.id = o.user_id;
```

| name | amount |
| ---- | ------ |
| 张三 | 100    |
| 张三 | 200    |
| 李四 | 300    |

### LEFT JOIN

返回左表全部，匹配不到则为`NULL`

```sql
SELECT u.name, o.amount
FROM user u
LEFT JOIN orders o
ON u.id = o.user_id;
```

| id   | name | amount |
| ---- | ---- | ------ |
| 1    | 张三 | 100    |
| 1    | 张三 | 200    |
| 2    | 李四 | 300    |
| 3    | 王五 | NULL   |
| 4    | 赵六 | NULL   |



### RIGHT JOIN

返回右表全部，匹配不到则为`NULL`

```sql
SELECT u.id, u.name, o.amount
FROM user u
RIGHT JOIN orders o
ON u.id = o.user_id;
```

| id   | name | amount |
| ---- | ---- | ------ |
| 1    | 张三 | 100    |
| 1    | 张三 | 200    |
| 2    | 李四 | 300    |
| NULL | NULL | 400    |

# DDL

## INSERT

- 插入单条记录

```sql
INSERT INTO user (username, password, age) VALUES ('zhangsan', '123456', 20);
```

- 插入多条记录

```sql
INSERT INTO user (name, age) VALUES 
('张三', 20),
('李四', 25);
```



## UPDATE

- 修改单个字段

```sql
UPDATE user SET age = 25 WHERE id = 1;
```

- 修改多个字段

```sql
UPDATE user  SET name = '王五',age = 30,status = 0 WHERE id = 1;
```

- 使用表达式修改

```sql
UPDATE 表名
SET stock = stock - 1
WHERE id = 1;
```



## DELETE

```sql
DELETE FROM user WHERE id = 1;
```


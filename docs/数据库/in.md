# in

```sql
id IN (1, 2, NULL)
```

```sql
id = 1 OR id = 2 OR id = NULL
```

但：

```sql
id = NULL   ❌ 永远是 false（严格说是 UNKNOWN）
```

即两者的效果相同：

```sql
id IN (1, 2)
```


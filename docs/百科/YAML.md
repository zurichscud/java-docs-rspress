# YAML

YAML（**YAML Ain't Markup Language**）是一种常用于配置文件的语言，例如 `application.yml`、`docker-compose.yml` 等。它的特点是**简洁、可读性强、使用缩进表示层级结构**。

YAML文件后缀可以是`.yml`或者`.yaml`

## 基本语法

### 键值对（Key-Value）

- `:` 后面必须有 **空格**

- 键值之间用冒号分隔

```yaml
name: Tom
age: 20
city: Beijing
```

### 使用缩进表示层级

```yaml
person:
  name: Tom
  age: 20
  address:
    city: Beijing
    street: Chaoyang Road
```

### 注释

```yaml
name: Tom # 用户名称
age: 20
```



## 数据类型

### 对象
YAML 使用**缩进表示对象结构**（通常 2 个空格）。

```yaml
person:
  name: Tom
  age: 20
  address:
    city: Beijing
    street: Chaoyang Road
```

等价 JSON：

```json
{
  "person": {
    "name": "Tom",
    "age": 20,
    "address": {
      "city": "Beijing",
      "street": "Chaoyang Road"
    }
  }
}
```


### 数组

使用 `-` 表示数组元素。

```yaml
fruits:
  - apple
  - banana
  - orange
```

等价：

```yaml
{
  "fruits": ["apple", "banana", "orange"]
}
```

对象数组

```yaml
users:
  - name: Tom
    age: 20
  - name: Jerry
    age: 18
```

等价 JSON：

```yaml
{
  "users": [
    {"name": "Tom", "age": 20},
    {"name": "Jerry", "age": 18}
  ]
}
```

### 字面量

字符串可以：

- 不加引号

```yaml
name: Tom
```

- 单引号：单引号中不会解析转义字符

```yaml
name: 'Tom'
```

- 双引号：可以解析 `\n`、`\t` 等

```yaml
name: "Tom"
```


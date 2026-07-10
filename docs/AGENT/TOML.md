# TOML

**TOML**（Tom's Obvious, Minimal Language）是一种旨在成为**易于阅读和编写的配置文件格式**。它的目标是提供一种比 XML、JSON 甚至 YAML 更直观、映射更清晰的配置结构。

TOML对空格、缩进不关心

## 基本语法

### 键值对（Key-Value）

最基础的单元，使用等号连接：

**等号（`=`）两边的空格不是必需的，它是完全可选的。**

```toml
title = "TOML 示例"
owner = "Tom"
enabled = true
database_port = 3306
```

### 注释

下面几种也都是合法的：

```toml
# 数据库配置
[database]
host = "localhost"
```

```toml
[database] # 数据库配置
host = "localhost" # 地址
```



### 表（Tables / Sections）

在 TOML 中，表的概念可以直接对应到你熟悉的编程语言中的 对象

它本质上就是一组**键值对的命名分组**。用来避免所有的配置项都堆在最顶层，从而让配置文件具备清晰的层级结构。

```toml
[database]
host = "127.0.0.1"
port = 3306

[server]
ip = "192.168.1.1"
```

```java
public class Config {
    private Database database;
    private Server server;
}

public class Database {
    private String host; // "127.0.0.1"
    private int port;    // 3306
}
```

::: tip 语法细节

- TOML 中定义一个表（Table）使用 **方括号 `[]`**。
- TOML 中**同一个表不能重复定义**。

```toml

[database.pool]
# 定义了一张表名为：database.pool
max_size = 20

...

[database.pool]
# 又定义了一张表名为：database.pool
min_size = 20
```

:::

### 嵌套表

如果你想在一个表里面再定义一个表，可以使用 **点号（`.`）** 分隔。

```toml
[servers]
host = "127.0.0.1"

[servers.alpha]
ip = "10.0.0.1"
dc = "eqdc10"

[servers.beta]
ip = "10.0.0.2"
```



### 内联表（Inline Tables）

如果你的表非常简单，只有一两个属性，又不想单独写一行 `[...]` 标题，可以使用花括号 `{...}` 把它写成一行：

```toml
name = { first = "Tom", last = "Preston-Werner" }
```

### 数组（Arrays）

```toml
languages = [ "Java", "Vue", "Go" ]
data = [ [1, 2], [3, 4] ] # 嵌套数组
```

## 对比

| **特性**     | **TOML**           | **JSON**           | **YAML**                      |
| ------------ | ------------------ | ------------------ | ----------------------------- |
| **可读性**   | 极高（人类友好）   | 一般（符号较多）   | 高（依赖缩进）                |
| **数据密度** | 中等               | 高                 | 中等                          |
| **复杂嵌套** | 较差（偏扁平化）   | 极好               | 极好                          |
| **注释支持** | 支持（使用 `#`）   | **不支持**         | 支持（使用 `#`）              |
| **主要用途** | 应用程序、工具配置 | 数据传输、API 交互 | 复杂部署配置（如 K8s、CI/CD） |
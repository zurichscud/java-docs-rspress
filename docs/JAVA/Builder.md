# Builder

## 为什么使用Builder

**Java 用 Builder 模式是因为“不得不”**（受限于语言特性）

在 Java 中，一个类的构造函数参数是**固定顺序**且**没有命名参数**（Named Arguments）的。 如果一个对象有 10 个可选属性，如果你不用 Builder，你将面临以下痛苦：

- **重载地狱（Telescoping Constructor）：** 你得写 `O(N)` 个构造函数来排列组合各种可选参数。

- 可读性灾难

```java
// 谁能一眼看出这几个 true/false 和数字代表什么？
User user = new User("张三", "18", true, false, 1, 0);
```

JS 拥有极其强大的**对象解构（Destructuring）和字面量**支持，并且参数天然支持“命名参数”的效果。

```java
// JS 的日常：清晰、无序、自带默认值
function createUser({ name, age, isAdmin = false, theme = 'dark' }) { ... }

createUser({ name: '张三', age: 18, theme: 'light' }); // 传入的就是一个“配置项对象”
```

在 JS 中，你传进去的 `{ name: '张三' }` 本身就是一个轻量级的对象，不需要像 Java 那样专门为了传递参数去定义一个 `Config` 类。

## 实现

使用Java和JS去创建同一个User对象：

### Java

```java
public class User {
    // 1. 核心属性（设为 final，一旦创建不可修改）
    private final Long id;
    private final String username;
    private final String email;
    private final int age;
    private final String status;

    // 2. 私有构造函数：只接受 Builder 对象，把 Builder 缓存的值赋给 User
    private User(Builder builder) {
        this.id = builder.id;
        this.username = builder.username;
        this.email = builder.email;
        this.age = builder.age;
        this.status = builder.status;
    }

    // 3. 静态内部类：专门负责收集参数
    public static class Builder {
        // 临时变量，用来存放链式调用的数据
        private Long id;
        private String username;
        private String email;
        
        // 在这里设置 Java 的默认值
        private int age = 18;
        private String status = "ACTIVE";

        // 构造器（如果有必填项，可以直接放在这里迫使外部传入）
        public Builder() {}

        // 4. 链式调用方法：关键在于每次都返回 this (Builder 自己)
        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder username(String username) {
            this.username = username;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder age(int age) {
            this.age = age;
            return this;
        }

        public Builder status(String status) {
            this.status = status;
            return this;
        }
      
      public static Builder builder() {
        return new Builder();
    }

        // 5. 核心：build 方法，真正实例化外部的 User 对象
        public User build() {
            // 在这里还可以做参数校验，比如：
            if (this.id == null || this.username == null) {
                throw new IllegalStateException("id 和 username 不能为空");
            }
            return new User(this);
        }
    }

    // 方便测试打印
    @Override
    public String toString() {
        return "User{id=" + id + ", username='" + username + "', email='" + email + "', age=" + age + ", status='" + status + "'}";
    }
}
```



```java
import lombok.Builder;
import lombok.ToString;

@Builder
@ToString
public class User {
    // 必填属性通常在业务层校验，或者通过 Builder 的初始化来处理
    private final Long id;
    private final String username;
    
    // 可选属性，可以设置默认值
    private final String email;
    @Builder.Default 
    private final int age = 18;
    @Builder.Default 
    private final String status = "ACTIVE";
}
```

```java
public class Main {
    public static void main(String[] args) {
        // 场景 A：只传必填项，可选项走默认值
        User userA = User.builder()
                .id(1L)
                .username("张三")
                .build();

        // 场景 B：传部分可选项，顺序可以完全打乱
        User userB = User.builder()
                .username("李四")
                .email("lisi@example.com")
                .id(2L)
                // age 和 status 自动使用默认值
                .build();
    }
}
```

### JS



```java
// 1. 定义配置项接口 (Options)
interface UserOptions {
    id: number;
    username: string;
    email?: string;     // ? 表示可选
    age?: number;       // ? 表示可选
    status?: string;    // ? 表示可选
}

// 2. 一个标准的 JS 类
class User {
    id: number;
    username: string;
    email?: string;
    age: number;
    status: string;

    // 构造函数直接接收一个配置项对象，并利用解构赋值设置默认值
    constructor({ id, username, email, age = 18, status = 'ACTIVE' }: UserOptions) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.age = age;
        this.status = status;
    }
}
```

在 JS 中，你只需要传一个大括号 `{}`（即对象字面量）作为配置项：

```java
// 场景 A：只传必填项
const userA = new User({
    id: 1,
    username: '张三'
});

// 场景 B：传部分可选项，键值对顺序无所谓
const userB = new User({
    username: '李四',
    email: 'lisi@example.com',
    id: 2
    // age 和 status 自动解构出默认值
});
```


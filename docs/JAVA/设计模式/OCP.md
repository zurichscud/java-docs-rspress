# OCP

对扩展开放，对修改关闭

## 依赖倒置

高层模块不应该依赖低层模块，二者都应该依赖抽象。

```java
class UserService {
    private MysqlUserDao userDao = new MysqlUserDao();
}
```

- UserService（高层）直接依赖具体实现`MysqlUserDao`

- 如果换成 Oracle / MongoDB **必须修改代码**

- 只要下一改动，上就收到牵连

使用依赖倒置：面向接口编程，面向抽象编程，不要面向具体编程

```java
interface UserDao {
    void save();
}

class MysqlUserDao implements UserDao {
    public void save() {
        System.out.println("save by mysql");
    }
}

class UserService {
    private UserDao userDao;

    public UserService(UserDao userDao) {
        this.userDao = userDao;
    }
}
```



## 控制反转

IOC

- 不再程序中使用硬编码的方式创建对象了
- 不再程序中采用硬编码的方式维护对象的关系了

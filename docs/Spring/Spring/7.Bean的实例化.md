# Bean的实例化



## 构造方法

默认调用无参的构造函数



## 简单工厂

使用简单工厂模式

```xml
<bean id="user" class="com.xxx.UserFactory" factory-method="createUser"/>
```

- `factory-method`：工厂中创建bean的方法

## factory-bean

使用工厂方法模式

因为是工厂方法模式，因此需要创建具体的Factory对象。

```xml
<bean id="userFactory" class="com.xxx.UserFactory"/>

<bean id="user" factory-bean="userFactory" factory-method="createUser"/>
```

- `factory-method`：工厂中创建bean的方法

## FactoryBean接口

使用工厂方法模式

### 接口定义

```java
public interface FactoryBean<T> {

    T getObject() throws Exception;      // 返回真正的对象

    Class<?> getObjectType();            // 返回对象类型

    default boolean isSingleton() {
        return true;                     // 是否单例
    }
}
```

### 实现接口

```java
public class MyFactoryBean implements FactoryBean<User> {

    @Override
    public User getObject() {
        return new User("张三");
    }

    @Override
    public Class<?> getObjectType() {
        return User.class;
    }
}
```

MyFactoryBean实现了FactoryBean，因此无需`factory-bean`和`factory-method`

```xml
<bean id="user" class="com.example.MyFactoryBean"/>
```

当一个类实现了 `FactoryBean<T>` 接口后：

- Spring 容器中注册的 **不是这个工厂类本身**
- 而是它 `getObject()` 返回的对象

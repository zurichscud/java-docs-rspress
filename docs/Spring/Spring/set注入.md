# set注入

Setter注入依赖于Setter方法。如果没有指定构造注入，将使用默认的无参构造函数创建对象

## 注入Bean

### 外部Bean

外部 Bean：依赖对象单独定义，多个地方可复用。

```xml
<bean id="userDao" class="com.demo.UserDao"/>

<bean id="userService" class="com.demo.UserService">
    <property name="userDao" ref="userDao"/>
</bean>
```

### 内部 Bean

内部 Bean：依赖对象直接写在 property 里面。

```xml
<bean id="userService" class="com.demo.UserService">
    <property name="userDao">
        <bean class="com.demo.UserDao"/>
    </property>
</bean>
```

| 对比         | 外部 Bean | 内部 Bean    |
| ------------ | --------- | ------------ |
| 是否独立定义 | 是        | 否           |
| 是否可复用   | 可以      | 不可以       |
| 配置清晰度   | 高        | 一般         |
| 生命周期     | 独立      | 跟随外部Bean |
| 推荐程度     | 高        | 一般         |

## 注入简单类型

### 常见类型

```xml
<bean id="user" class="com.test.User">
    <property name="name" value="张三"/>
    <property name="age" value="18"/>
</bean>
```

### 包装类

Spring 会自动处理包装类

```java
public class User {
    private Integer age;

    public void setAge(Integer age) {
        this.age = age;
    }
}
```



```java
<bean id="user" class="com.test.User">
    <property name="age" value="18"/>
</bean>
```



### 枚举类

在 Spring XML 中，枚举类型本质上也属于“简单类型注入”的一种，但写法和普通字符串稍有区别。

```java
public enum Gender {
    MALE,
    FEMALE
}
```

```xml
<bean id="user" class="com.test.User">
    <property name="gender" value="MALE"/>
</bean>
```

Spring 会自动调用：

```java
Gender.valueOf("MALE")
```

所以：

- 必须和枚举常量名一致
- 区分大小写

## 级联属性赋值

```java
public class Address {
    private String city;

    public void setCity(String city) {
        this.city = city;
    }
}
```

```java
public class Person {
    private String name;
    private Address address;

    public void setName(String name) {
        this.name = name;
    }

    public void setAddress(Address address) {
        this.address = address;
    }
}
```

- 普通方式

```java
<bean id="address" class="com.test.Address">
    <property name="city" value="上海"/>
</bean>

<bean id="person" class="com.test.Person">
    <property name="name" value="张三"/>
    <property name="address" ref="address"/>
</bean>
```



- 级联属性赋值：

```java
<bean id="person" class="com.test.Person">
    <property name="name" value="张三"/>
    <property name="address.city" value="上海"/>
</bean>
```

Spring会帮助你调用getAddress，然后调用setCity



## 注入数组










## 注入Array/List/Set

### Array

- 基本数据类型

```xml
<bean id="user" class="com.test.User">
    <property name="hobbies">
        <array>
            <value>打球</value>
            <value>游戏</value>
            <value>看书</value>
        </array>
    </property>
</bean>
```

- 引用数据类型

```xml
<bean id="addr1" class="com.test.Address">
    <property name="city" value="上海"/>
</bean>

<bean id="addr2" class="com.test.Address">
    <property name="city" value="北京"/>
</bean>

<bean id="user" class="com.test.User">
    <property name="addresses">
        <array>
            <ref bean="addr1"/>
            <ref bean="addr2"/>
        </array>
    </property>
</bean>
```


### List

```xml
<bean id="user" class="com.test.User">
    <property name="hobbies">
        <list>
            <value>打球</value>
            <value>看书</value>
            <value>游戏</value>
        </list>
    </property>
</bean>
```



### Set

```xml
<bean id="user" class="com.test.User">
    <property name="tags">
        <set>
            <value>VIP</value>
            <value>普通用户</value>
            <value>VIP</value>
        </set>
    </property>
</bean>
```

## 注入Map

```xml
<bean id="user" class="com.test.User">
    <property name="settings">
        <map>
            <entry key="theme" value="dark"/>
            <entry key="language" value="zh-CN"/>
        </map>
    </property>
</bean>
```

```xml
<bean id="addr1" class="com.test.Address">
    <property name="city" value="上海"/>
</bean>

<bean id="addr2" class="com.test.Address">
    <property name="city" value="北京"/>
</bean>

<bean id="user" class="com.test.User">
    <property name="addressMap">
        <map>
            <entry key="home" value-ref="addr1"/>
            <entry key="company" value-ref="addr2"/>
        </map>
    </property>
</bean>
```




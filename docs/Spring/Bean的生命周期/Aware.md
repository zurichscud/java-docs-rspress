# Aware接口
这里的 Aware 可以理解为：

> “知道某件事的”、“能够获取某种信息的”、“感知某种上下文的”。

## 常见接口
`xxxAware`接口让 Bean 在创建过程中“可以拿到 Spring 容器的环境参数”。

| 接口                    | 作用             |
| ----------------------- | ---------------- |
| BeanNameAware           | 获取 Bean 的名字 |
| BeanFactoryAware        | 获取 BeanFactory |
| ApplicationContextAware | 获取容器上下文   |
| EnvironmentAware        | 获取环境变量     |
| ResourceLoaderAware     | 获取资源加载器   |

## 示例
例如我想让user这个bean在创建时感知Spring环境，就可以让User实现Aware接口。
```java
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanNameAware;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class User implements BeanNameAware, ApplicationContextAware {

    private String name;

    private String beanName;
    private ApplicationContext applicationContext;

    public User(String name) {
        this.name = name;
    }

    @Override
    public void setBeanName(String name) {
        this.beanName = name;
        System.out.println("当前 BeanName：" + name);
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
        System.out.println("拿到了 Spring 容器：" + applicationContext.getDisplayName());
    }

    public void show() {
        System.out.println("user name = " + name);
        System.out.println("beanName = " + beanName);

        // 从容器中获取自己（演示用）
        User self = applicationContext.getBean(beanName, User.class);
        System.out.println("从容器拿到自己：" + self);
    }
}
```

一般不推荐业务代码使用 Aware。
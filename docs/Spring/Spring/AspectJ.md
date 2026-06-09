# AspectJ

AspectJ是独立于Spring的AOP框架。

## 切面

```java
@Aspect // 声明这是一个切面类
@Component // Spring管理这个bean
public class LogAspect {

    // 前置通知
    @Before("execution(* com.example.service.*.*(..))")
    public void beforeMethod(JoinPoint joinPoint) {
        System.out.println("方法执行前：" + joinPoint.getSignature());
    }

    // 后置通知
    @After("execution(* com.example.service.*.*(..))")
    public void afterMethod(JoinPoint joinPoint) {
        System.out.println("方法执行后：" + joinPoint.getSignature());
    }

    // 返回通知
    @AfterReturning(pointcut = "execution(* com.example.service.*.*(..))", returning = "result")
    public void afterReturning(JoinPoint joinPoint, Object result) {
        System.out.println("方法返回值：" + result);
    }

    // 异常通知
    @AfterThrowing(pointcut = "execution(* com.example.service.*.*(..))", throwing = "ex")
    public void afterThrowing(JoinPoint joinPoint, Exception ex) {
        System.out.println("方法异常：" + ex.getMessage());
    }

    // 环绕通知
    @Around("execution(* com.example.service.*.*(..))")
    public Object aroundMethod(ProceedingJoinPoint pjp) throws Throwable {
        System.out.println("环绕通知前");
        Object result = pjp.proceed(); // 执行目标方法
        System.out.println("环绕通知后");
        return result;
    }
}
```



## 切点表达式

用于精准地定义“在哪里”织入增强代码。

### execution

用于匹配方法执行。这是最细粒度的控制方式。

```java
execution(modifiers-pattern? ret-type-pattern declaring-type-pattern? name-pattern(param-pattern) throws-pattern?)
```

- `modifiers-pattern`：方法修饰符，可选，例如 `public`、`private`。
- `ret-type-pattern`：返回类型，例如 `*`（任意类型）。
- `declaring-type-pattern`：类名或包名，例如 `com.example.service.*`。
- `name-pattern`：方法名，例如 `get*` 匹配所有以 get 开头的方法。
- `param-pattern`：参数列表，例如 `(..)` 匹配任意参数，`(String,int)` 精确匹配。
- `throws-pattern`：异常，可选。

```java
@Before("execution(* com.example.service.*.*(..))")
public void before() {
    System.out.println("方法执行前...");
}
```



### @annotation

用于匹配带有特定注解的方法。例如`@DataScope`

```java
@Before("@annotation(注解变量名)")
void doBefore(注解类名 注解变量名)
```

注解变量名：用于标注在切点表达式中哪个变量名是注解，AOP会读取该变量的类名作为需要匹配的注解。

```java
ypDataScope --> YPDataScope -->@YPDataScope
```



```java
    @Before("@annotation(ypDataScope)")
    public void doBefore(JoinPoint point, YPDataScope ypDataScope)
    {
        clearDataScope(point);
        handleDataScope(point, ypDataScope);
    }
```




## 通知（Advice）

| 注解              | 执行时机                   |
| ----------------- | -------------------------- |
| `@Before`         | 方法执行前                 |
| `@After`          | 方法执行后（无论是否异常） |
| `@AfterReturning` | 方法正常返回后             |
| `@AfterThrowing`  | 方法抛异常后               |
| `@Around`         | 方法执行前与后             |

### Before

方法执行前

```java
@Before("execution(* com.example.service.*.*(..))")
public void before(JoinPoint joinPoint) {
    Object[] args = joinPoint.getArgs();
    System.out.println("参数：" + Arrays.toString(args));
}
```



### AfterReturning

方法正常返回后

```java
@Aspect
@Component
public class LogAspect {

    // 匹配 OrderService 的 createOrder 方法
    @AfterReturning(
            pointcut = "execution(* com.example.service.OrderService.createOrder(..))",
            returning = "result"
    )
    public void afterReturning(JoinPoint joinPoint, Object result) {

        String methodName = joinPoint.getSignature().getName();

        System.out.println("方法正常返回：" + methodName);
        System.out.println("返回值：" + result);
    }
}
```

- returning：方法返回值的占位符，方法参数里必须有同名变量
- pointcut/value：切点

### Around

环绕通知，我们需要手动调用目标方法，否则将不会执行

```java
@Aspect
@Component
public class LogAspect {

    @Around("execution(* com.example.service.OrderService.createOrder(..))")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {

        long start = System.currentTimeMillis();

        // 1. 获取方法信息
        String methodName = joinPoint.getSignature().getName();

        System.out.println("方法开始执行：" + methodName);

        // 2. 执行目标方法（关键！！）
        Object result = joinPoint.proceed();

        long time = System.currentTimeMillis() - start;

        System.out.println("方法执行结束：" + methodName);
        System.out.println("返回结果：" + result);
        System.out.println("耗时：" + time + "ms");

        return result;
    }
}
```



### After

finally语句块中的通知，不管方法是否成功执行（正常返回 or 抛异常），都会执行。

```java
@Aspect
@Component
public class LogAspect {

    @After("execution(* com.example.service.OrderService.createOrder(..))")
    public void after(JoinPoint joinPoint) {

        String methodName = joinPoint.getSignature().getName();

        System.out.println("方法执行结束（不管成功还是异常）：" + methodName);
    }
}
```





### AfterThrowing

只有当目标方法**抛出异常时才会执行**。

```java
@Aspect
@Component
public class LogAspect {

    @AfterThrowing(
            pointcut = "execution(* com.example.service.OrderService.createOrder(..))",
            throwing = "ex"
    )
    public void afterThrowing(JoinPoint joinPoint, Exception ex) {

        String methodName = joinPoint.getSignature().getName();

        System.out.println("方法发生异常：" + methodName);
        System.out.println("异常信息：" + ex.getMessage());
    }
}
```

- throwing：抛出异常对象的占位符，方法参数里必须有同名变量



## JoinPoint（连接点）

`JoinPoint` 可以拿到当前被 AOP 拦截到的方法信息

- 方法参数

```java
Object[] args = joinPoint.getArgs();
```

- 方法签名

```java
joinPoint.getSignature()
```

- 目标对象（被代理的真实对象）

```java
joinPoint.getTarget()
```

- 当前代理对象

```java
joinPoint.getThis()
```



## AOP生效问题

**类内部调用**不会触发 AOP：`@Before` / `@Around`都不会生效

```java
public void A() {
    B(); // ❌ 直接调用，不走代理
}
```

### 方案一

通过aop框架暴露该代理对象，AopContext能够访问

```java
@EnableAspectJAutoProxy(exposeProxy = true)
```

将类内部调用改成使用AopContext进行调用

```java
import org.springframework.aop.framework.AopContext;

public void A() {
    ((YourService) AopContext.currentProxy()).B(); // ✅ 走代理
}
```

### 方案二（推荐）

拆成两个 Bean：

```java
@Service
class AService {
    @Autowired
    private BService bService;

    public void A() {
        bService.B(); // ✅ 走代理
    }
}
```

### 方案三

自己注入自己

```java
@Autowired
private YourService self;

public void A() {
    self.B(); // ✅ 走代理
}
```

## 切面的顺序

切面的执行可以看作是一个“同心圆”或者“剥洋葱”的模型。高优先级的切面在最外层，低优先级的在内层。

**使用 `@Order` 注解**：在切面类上添加 `@Order(value)`。`value` 的值越**小**，切面越外面。

| **场景**            | **顺序规律**                           |
| ------------------- | -------------------------------------- |
| **入站 (Inbound)**  | `Order(1)` -> `Order(2)` -> `Order(3)` |
| **到达目标方法**    | 执行目标逻辑                           |
| **出站 (Outbound)** | `Order(3)` -> `Order(2)` -> `Order(1)` |

以最复杂的`@Around`举例：

```java
A Around before   (Order=1)
  B Around before (Order=2)
    目标方法
  B Around after
A Around after
```

## 通用切点

```java
@Before("execution(* com.xxx.service..*(..))")
public void before() {}

@After("execution(* com.xxx.service..*(..))")
public void after() {}
```

- 重复写

- 改包路径要改很多地方

使用 `@Pointcut` 定义通用切点：

```java
@Aspect
@Component
public class LogAspect {

    // ✅ 通用切点
    @Pointcut("execution(* com.xxx.service..*(..))")
    public void servicePointcut() {}

    @Before("servicePointcut()")
    public void before() {
        System.out.println("before");
    }

    @After("servicePointcut()")
    public void after() {
        System.out.println("after");
    }
}
```

跨切面复用通用切点必须用“全限定方法名”引用：

```java
@Aspect
@Component
public class LogAspect {

    @Before("com.xxx.config.PointcutConfig.servicePointcut()")
    public void before() {
        System.out.println("log before");
    }
}
```

如果存在多个复用的切点，可以创建一个PointcutConfig / CommonPointcut / GlobalPointcut统一管理

```java
@Aspect
public class PointcutConfig {

    @Pointcut("execution(* com.xxx.service..*(..))")
    public void service(){}

    @Pointcut("@annotation(com.xxx.annotation.Log)")
    public void log(){}

    @Pointcut("service() && log()")
    public void serviceWithLog(){}
}
```

## 案例：事务切面

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface MyTransactional {

    // 传播行为（简化版）
    String propagation() default "REQUIRED";

    // 是否只读
    boolean readOnly() default false;

    // 回滚规则
    Class<? extends Throwable>[] rollbackFor() default {Exception.class};
}
```



```java
@Aspect
@Component
public class MyTransactionAspect {

    private TransactionManager txManager = new TransactionManager();

    @Around("@annotation(myTx)")
    public Object around(ProceedingJoinPoint pjp, MyTransactional myTx) throws Throwable {

        Object result = null;

        try {
            // 1. 开启事务
            txManager.begin();

            // 2. 执行目标方法
            result = pjp.proceed();

            // 3. 提交事务
            txManager.commit();

        } catch (Throwable ex) {

            // 4. 判断是否需要回滚
            for (Class<? extends Throwable> clazz : myTx.rollbackFor()) {
                if (clazz.isAssignableFrom(ex.getClass())) {
                    txManager.rollback();
                    break;
                }
            }

            throw ex;
        }

        return result;
    }
}
```


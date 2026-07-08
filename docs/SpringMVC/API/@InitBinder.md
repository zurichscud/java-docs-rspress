# @InitBinder

## 核心场景

它主要用于**在控制器（Controller）级别自定义请求参数的绑定和数据转换规则**。

简单来说，当系统收到前端传来的请求参数时，`@InitBinder` 可以在这些参数注入到 Controller 的方法参数之前，对它们进行“预处理”。

前端传来的日期可能多种多样（如 `2026-07-08` 或 `2026/07/08`），如果直接用 `Date` 接收可能会报错。

```java
@InitBinder
public void initBinder(WebDataBinder binder) {
    // 定义日期格式
    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    dateFormat.setLenient(false); // 严格解析日期
    
    // 注册自定义编辑器：将 String 自动转换为 Date 类型
    binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));
}
```



## 作用范围

- **局部（Controller 级别）：** 如果你直接把 `@InitBinder` 写在某个特定的 `@RestController` 或 `@Controller` 类中，它**只会对当前 Controller 中的接口生效**。

- **全局（应用级别）：** 如果你希望全局所有的 Controller 都生效，可以配合 `@ControllerAdvice` 注解使用：

```java
@ControllerAdvice
public class GlobalBindingAdvice {

    @InitBinder
    public void globalInitBinder(WebDataBinder binder) {
        // 全局修剪字符串空格
        binder.registerCustomEditor(String.class, new StringTrimmerEditor(true));
    }
}
```

## registerCustomEditor

### 第一个参数：requiredType（目标类型）

**含义**：指定当前自定义编辑器要拦截并处理的**目标数据类型**。

**作用**：当 Spring MVC 在解析 HTTP 请求参数时，一旦发现 Controller 方法中的入参类型（或者 JavaBean 对象的属性类型）与这个 `requiredType` 匹配，就会把处理权交给第二个参数指定的编辑器。

### 第二个参数：propertyEditor（属性编辑器）

- **含义**：具体的**转换逻辑执行者**。它是一个来自 JDK 标准库（`java.beans.PropertyEditor`）的接口。

- **作用**：负责将 HTTP 请求传过来的**字符串（String）\**数据，转换成目标类型的\**对象（Object）**，或者反过来。

**工作原理**： Spring 内部主要调用该接口的两个方法来进行文本与对象之间的互转：

- `setAsText(String text)`：String->Object。
- `getAsText()`：Object->String。
# @ControllerAdvice

`@ControllerAdvice` 是 Spring 提供的一个**控制器增强器**，用于给多个 Controller 统一添加功能。

被`@ControllerAdvice` 接口标注的类将被注册为Spring组件

## 源码

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface ControllerAdvice {

	/**
	 * Alias for the {@link #basePackages} attribute.
	 * <p>Allows for more concise annotation declarations &mdash; for example,
	 * {@code @ControllerAdvice("org.my.pkg")} is equivalent to
	 * {@code @ControllerAdvice(basePackages = "org.my.pkg")}.
	 * @since 4.0
	 * @see #basePackages
	 */
	@AliasFor("basePackages")
	String[] value() default {};

	/**
	 * Array of base packages.
	 * <p>Controllers that belong to those base packages or sub-packages thereof
	 * will be included &mdash; for example,
	 * {@code @ControllerAdvice(basePackages = "org.my.pkg")} or
	 * {@code @ControllerAdvice(basePackages = {"org.my.pkg", "org.my.other.pkg"})}.
	 * <p>{@link #value} is an alias for this attribute, simply allowing for
	 * more concise use of the annotation.
	 * <p>Also consider using {@link #basePackageClasses} as a type-safe
	 * alternative to String-based package names.
	 * @since 4.0
	 */
	@AliasFor("value")
	String[] basePackages() default {};

	/**
	 * Type-safe alternative to {@link #basePackages} for specifying the packages
	 * in which to select controllers to be advised by the {@code @ControllerAdvice}
	 * annotated class.
	 * <p>Consider creating a special no-op marker class or interface in each package
	 * that serves no purpose other than being referenced by this attribute.
	 * @since 4.0
	 */
	Class<?>[] basePackageClasses() default {};

	/**
	 * Array of classes.
	 * <p>Controllers that are assignable to at least one of the given types
	 * will be advised by the {@code @ControllerAdvice} annotated class.
	 * @since 4.0
	 */
	Class<?>[] assignableTypes() default {};

	/**
	 * Array of annotation types.
	 * <p>Controllers that are annotated with at least one of the supplied annotation
	 * types will be advised by the {@code @ControllerAdvice} annotated class.
	 * <p>Consider creating a custom composed annotation or use a predefined one,
	 * like {@link RestController @RestController}.
	 * @since 4.0
	 */
	Class<? extends Annotation>[] annotations() default {};

}

```

- basePackages：`basePackages` 允许你指定一个或多个包名，只有这些包下的 Controller 抛出的异常或返回的数据，才会触发该 Advice。

## 执行节点

```mermaid
sequenceDiagram
    autonumber
    participant DS as DispatcherServlet
    participant HA as HandlerAdapter
    participant CA as @ControllerAdvice
    participant AR as ArgumentResolver
    participant Controller as Controller
    participant VH as ReturnValueHandler

    %% 1. 请求进入与准备阶段
    DS->>HA: 分发请求
    
    note over HA, CA: 【准备阶段】
    HA->>CA: 1. 执行 @ModelAttribute (填充全局数据)
    CA-->>HA: 返回 Model 数据
    HA->>CA: 2. 执行 @InitBinder (初始化数据绑定器)
    CA-->>HA: 返回 WebDataBinder

    %% 2. 参数解析阶段
    note over HA, AR: 【参数解析阶段】
    HA->>AR: 3. 解析方法参数
    rect rgb(240, 248, 255)
        note over AR, CA: 如果参数带有 @RequestBody
        AR->>AR: 4. 根据 Content-Type 选定 HttpMessageConverter
        AR->>CA: 5. 触发 RequestBodyAdvice (读取前/后拦截)
        note right of CA: beforeBodyRead → HttpMessageConverter 读取 → afterBodyRead
        CA-->>AR: 返回处理后的请求体
    end
    AR-->>HA: 返回解析后的参数对象

    %% 3. 控制器执行阶段
    note over HA, Controller: 【业务执行阶段】
    HA->>Controller: 6. 调用 Controller 目标方法

    Controller-->>HA: 7. 返回结果对象 (比如 User)

    %% 4. 返回值处理阶段
    note over HA, VH: 【响应处理阶段】
    HA->>VH: 8. 处理返回值
    rect rgb(240, 255, 240)
        note over VH, CA: 如果使用了 @ResponseBody / RestController
        VH->>VH: 9. 根据返回值类型选定 HttpMessageConverter
        VH->>CA: 10. 触发 ResponseBodyAdvice (序列化前拦截修改)
        CA-->>VH: 返回处理后的对象
    end
    VH-->>DS: 用已选定的 HttpMessageConverter 序列化响应
```




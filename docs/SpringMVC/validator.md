# validator

`hibernate-validator` 是 Java 后端参数校验的绝对主力，它实现了 Jakarta Bean Validation（以前叫 JSR-380）规范。

Spring Boot 的 Web 依赖中引入了这个包：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```



## 核心注解

###  空值检查

- **`@Null` / `@NotNull`**：针对任何类型。`@NotNull` 确保值不能为 `null`，但如果是空字符串 `""` 或带空格的 `" "`，它能放行。

- **`@NotEmpty`**：针对字符串、集合、数组。不能为 `null` 且长度/大小必须大于 0。

- **`@NotBlank`**：**专用于字符串**。不能为 `null`，且去除前后空格后长度必须大于 0（常用于校验用户名、密码）。



### 数值与范围检查

- **`@Min(value)` / `@Max(value)`**：限制数值的最小/最大值。

- **`@Size(min, max)`**：限制字符串长度、或集合/数组的元素个数范围。

- **`@Digits(integer, fraction)`**：限制数值的整数位数和小数位数（例如金额校验）。



### 业务格式检查

- **`@Email`**：验证是否符合邮箱格式。

- **`@Pattern(regexp = "...")`**：功能最强大，直接使用**正则表达式**校验（如手机号、身份证号）。



## 基础用法

在 Spring Boot 中，校验通常是在 Controller 接收 DTO 对象时触发。

- 步骤一：在实体类/DTO 上加注解

```java
public class UserDTO {
    @NotBlank(message = "用户名不能为空")
    private String username;

    @Size(min = 6, max = 20, message = "密码长度必须在6-20位之间")
    private String password;

    @Min(value = 18, message = "年龄必须大于等于18岁")
    private Integer age;
}
```

- 步骤二：在 Controller 方法中开启校验

必须在入参前加上 **`@Validated`**（或 `@Valid`）注解，否则校验不会生效。

```java
@PostMapping("/register")
public Result<String> register(@Validated @RequestBody UserDTO userDTO) {
    // 如果校验失败，Spring 会自动抛出 MethodArgumentNotValidException 异常
    userService.register(userDTO);
    return Result.success("注册成功");
}
```

## 分组校验

**痛点：** 新增用户时，`id` 必须为主空；修改用户时，`id` 必须有值。但它们共用同一个 `UserDTO`。

解决方案：

1. 定义两个标识接口（仅作为标签）：

```
public interface CreateGroup {}
public interface UpdateGroup {}
```



2. 在 DTO 的注解中指定 `groups`：

```java
public class UserDTO {
    @NotNull(message = "修改时ID不能为空", groups = UpdateGroup.class)
    @Null(message = "新增时不需要指定ID", groups = CreateGroup.class)
    private Long id;

    @NotBlank(message = "用户名不能为空", groups = {CreateGroup.class, UpdateGroup.class})
    private String username;
}
```



3. 在 Controller 中指定当前接口使用哪组校验：

```java
@PostMapping("/add")
public Result add(@Validated(CreateGroup.class) @RequestBody UserDTO dto) {...}
```



## 自定义校验注解

1. 自定义注解

```java
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = GenderValidator.class) // 指定校验逻辑类
public @interface IsGender {
    String message() default "性别取值不合法";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
```



2. 实现校验逻辑

```java
public class GenderValidator implements ConstraintValidator<IsGender, Integer> {
    private final Set<Integer> ALLOWED_GENDER = Set.of(0, 1, 2); // 0未知, 1男, 2女

    @Override
    public boolean isValid(Integer value, ConstraintValidatorContext context) {
        if (value == null) return true; // 通常空值交给 @NotNull 处理
        return ALLOWED_GENDER.contains(value);
    }
}
```



3. 在 DTO 中直接使用 `@IsGender` 即可


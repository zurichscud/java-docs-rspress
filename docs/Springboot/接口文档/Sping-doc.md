# Spring-doc

## install

- springboot2

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-ui</artifactId>
    <version>1.8.0</version>
</dependency>
```

- springboot3

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.6.0</version> 
</dependency>
```

项目启动之后，我们可以直接访问：http://项目地址/swagger-ui/index.html ，就能看到我们的开发文档了

## Config



```yaml
# 生产环境中需要关闭
springdoc:
  api-docs:
    enabled: true
```



```java
@Bean
public OpenAPI springDocOpenAPI() {
        return new OpenAPI().info(new Info()
                        .title("图书管理系统 - 在线API接口文档")   //设置API文档网站标题
                        .description("这是一个图书管理系统的后端API文档，欢迎前端人员查阅！") //网站介绍
                        .version("2.0")   //当前API版本
                        .license(new License().name("我的B站个人主页")  //遵循的协议，这里拿来写其他的也行
                                .url("https://space.bilibili.com/37737161")));
}
```



## Use

```java
//使用@Tag注解来添加Controller描述信息
@Tag(name = "账户验证相关", description = "包括用户登录、注册、验证码请求等操作。")
public class TestController {
	...
}
```



```java
@ApiResponses({
       @ApiResponse(responseCode = "200", description = "测试成功"),
       @ApiResponse(responseCode = "500", description = "测试失败")   //不同返回状态码描述
})
@Operation(summary = "请求用户数据测试接口")   //接口功能描述
@ResponseBody
@GetMapping("/hello")
//请求参数描述和样例
public String hello(@Parameter(description = "测试文本数据", example = "KFCvivo50") @RequestParam String text) {
    return "Hello World";
}
```



```java
@Data
@Schema(description = "用户信息实体类")
public class User {
    @Schema(description = "用户编号")
    int id;
    @Schema(description = "用户名称")
    String name;
    @Schema(description = "用户邮箱")
    String email;
    @Schema(description = "用户密码")
    String password;
}
```

## Anncation

### Controller

| **注解**         | **作用位置**     | **常用属性说明**                                             | **示例**                                                     |
| ---------------- | ---------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **`@Tag`**       | 类 (Controller)  | `name`: 模块名称 `description`: 模块详细描述                 | `@Tag(name = "会员管理", description = "会员注册、查询与追踪")` |
| **`@Operation`** | 方法 (Interface) | `summary`: 接口简要标题 `description`: 详细功能描述          | `@Operation(summary = "根据手机号查询会员", description = "用于唯一性校验与身份追踪")` |
| **`@Hidden`**    | 类 / 方法        | 无属性。标记后，该接口或整个控制器将**不会**显示在 Swagger 文档中。 | `@Hidden`                                                    |



### 请求参数处理

| **注解**               | **作用位置** | **常用属性说明**                                             | **示例**                                                     |
| ---------------------- | ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **`@Parameter`**       | 方法形参     | `description`: 参数含义描述 `required`: 是否必填 (`true`/`false`) `example`: 示例值 | `public Member get(@Parameter(description = "会员ID", required = true, example = "1001") Long id)` |
| **`@ParameterObject`** | 方法形参     | 如果用一个对象来接收 **Query 参数**，此注解可以让 Swagger 把对象的属性拆解为平铺的输入框。 | `public List<Member> list(@ParameterObject MemberQuery query)` |



### 数据模型

| **注解**                 | **作用位置** | **常用属性说明**                                             | **示例**                                                     |
| ------------------------ | ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **`@Schema` (修饰类)**   | 实体类       | `description`: 描述                                          | `@Schema(description = "会员信息交互DTO")`                   |
| **`@Schema` (修饰属性)** | 实体类字段   | `description`: 描述 `requiredMode`: 必填模式 `example`: 示例值 `hidden`: 是否在文档中隐藏该字段 | `@Schema(description = "手机号", requiredMode = Schema.RequiredMode.REQUIRED, example = "13800000000")` `private String phone;` |

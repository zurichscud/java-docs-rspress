# RequestBodyAdvice

> 请求体拦截钩子

它的设计理念和 ResponseBodyAdvice 完全对称。

## 它在 Spring MVC 中的位置



## Example

RequestBodyAdvice 同样需要配合 `@ControllerAdvice`（或 `@RestControllerAdvice`）使用。它专门用来拦截使用`@RequestBody `注解的参数。


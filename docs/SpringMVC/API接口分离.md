# API接口分离

## 定义 API 接口

在接口上编写 Spring MVC 的注解（如 @RequestMapping、@RequestParam、参数校验等）。
```java
package com.yourproject.api;

import com.yourproject.dto.UserSaveDTO;
import com.yourproject.vo.UserVO;
import com.yourproject.common.Result;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/v1/users")
public interface UserApi {

    @GetMapping("/{id}")
    Result<UserVO> getUserById(@PathVariable("id") Long id);

    @PostMapping
    Result<Void> saveUser(@Valid @RequestBody UserSaveDTO userSaveDTO);
}
```

## 实现 Controller 类
实现类只需要加上 @RestController 注解，并实现上面的接口。注意：方法上的 @GetMapping 等路径注解不需要重复写，Spring 会自动继承接口上的配置。
```java
package com.yourproject.controller;

import com.yourproject.api.UserApi;
import com.yourproject.dto.UserSaveDTO;
import com.yourproject.vo.UserVO;
import com.yourproject.common.Result;
import com.yourproject.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor // Lombok 自动注入 Service
public class UserController implements UserApi {

    private final UserService userService;

    @Override
    public Result<UserVO> getUserById(Long id) {
        UserVO userVO = userService.getUserById(id);
        return Result.success(userVO);
    }

    @Override
    public Result<Void> saveUser(UserSaveDTO userSaveDTO) {
        userService.saveUser(userSaveDTO);
        return Result.success(null);
    }
}
```

## 为什么要这么做
如果你未来考虑将模块拆分为微服务，这种设计是标准的 Feign 契约模式。

- 你可以把 UserApi 接口、DTO、VO 单独打包成一个 common-api.jar。
- 服务提供方：你的 UserController 依赖这个 jar 并实现 UserApi。
- 服务消费方：其他微服务只需要引入这个 jar，并在代码里写：

```java
@FeignClient(name = "user-service")
public interface UserFeignClient extends UserApi { ... }
```

这样消费方就能直接像调用本地方法一样调用你的接口，**不需要在两个服务里重复写两遍一模一样的 URL 和参数定义**。
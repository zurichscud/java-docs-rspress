# MultipartFile

在 **Spring Boot** 中，文件上传可以通过 `MultipartFile` 来处理

## 配置

```yaml [application.yml]
spring:
  servlet:
    multipart:
      max-file-size: 10MB       # 单个文件最大值
      max-request-size: 20MB    # 总请求大小
      file-size-threshold: 1MB  # 超过阈值写临时文件，小于阈值存在内存
```
## MultipartFile

在 **Spring Boot / Spring MVC** 中，`MultipartFile` 是处理文件上传的核心接口，它封装了上传的文件信息和操作方法。可以理解成 **Spring 对 HTTP multipart/form-data 请求中上传文件的抽象**。

### 存储位置

文件如果超过 `spring.servlet.multipart.file-size-threshold`（默认 0 或 1MB），Spring 会先写到 **临时文件**（默认在 `/tmp` 目录）`MultipartFile` 只是封装了文件信息和临时文件路径。

### API

| 方法                           | 说明                                   |
| ------------------------------ | -------------------------------------- |
| `String getName()`             | 获取表单中 `<input>` 的 name 属性      |
| `String getOriginalFilename()` | 获取上传文件的原始名称（客户端文件名） |
| `String getContentType()`      | 获取文件的 MIME 类型，如 `image/png`   |
| `boolean isEmpty()`            | 文件是否为空（0 字节或未选择文件）     |
| `long getSize()`               | 文件大小（字节）                       |
| `byte[] getBytes()`            | 获取文件内容的字节数组                 |
| `InputStream getInputStream()` | 获取文件内容的输入流                   |
| `void transferTo(File dest)`   | 将文件保存到指定目录（直接写入磁盘）   |

## 获取MultipartFile

### 直接获取

如果请求是

```http
Content-Type: multipart/form-data
```

Spring 就会认为这是**文件上传请求**，MultipartResolver可以自动解析得到文件

```java
@PostMapping("/upload")
public AjaxResult uploadFile(MultipartFile file)
```

等价于你写了：

```java
@RequestParam("file") MultipartFile file
```

完整流程：

1. 前端发起 `multipart/form-data` 请求
2. `MultipartResolver` 解析请求
3. 把文件封装成 `MultipartFile``
4. ``HandlerMethodArgumentResolver` 进行参数绑定
5. 按参数名匹配 `file` → 注入到方法

### @RequestParam

`@RequestParam`指定Form表单中存储文件的key，通常是`file`，我们也可以指定为别的key

```java
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/upload")
public class FileUploadController {

    private final String UPLOAD_DIR = "/tmp/uploads/"; // 服务器存储目录

    @PostMapping
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("上传文件不能为空");
        }

        try {
            // 保存文件到指定目录
            File dest = new File(UPLOAD_DIR + file.getOriginalFilename());
            dest.getParentFile().mkdirs(); // 创建目录
            file.transferTo(dest);

            return ResponseEntity.ok("上传成功: " + dest.getAbsolutePath());
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("上传失败: " + e.getMessage());
        }
    }
}
```



### @RequestPart

用于 **multipart/form-data** 请求中，将请求体中的 **部分数据（part）** 绑定到方法参数。

支持 **文件 + JSON 对象同时上传** 的场景，**这是 `@RequestParam` 无法直接绑定对象的**。

- 前端：

```js
import axios from 'axios';

const uploadData = async () => {
  const formData = new FormData();
  const file = document.querySelector<HTMLInputElement>('#file')!.files![0];
  const jsonData = { name: '赖', age: 28 };

  formData.append('file', file);
  formData.append('info', new Blob([JSON.stringify(jsonData)], { type: 'application/json' }));

  const res = await axios.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  console.log(res.data);
};
```

- 后端 Controller

```java
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/upload")
public class FileUploadController {

    @PostMapping
    public String upload(
        @RequestPart("file") MultipartFile file,
        @RequestPart("info") UserInfo info // 绑定 JSON 对象
    ) {
        System.out.println("文件名: " + file.getOriginalFilename());
        System.out.println("用户名: " + info.getName() + ", 年龄: " + info.getAge());
        return "上传成功";
    }

    public static class UserInfo {
        private String name;
        private int age;

        // getter & setter
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public int getAge() { return age; }
        public void setAge(int age) { this.age = age; }
    }
}
```

## 文件上传流程

1. 前端发送 `multipart/form-data` 请求

2. Spring 解析请求，把每个 part 转成 `MultipartFile`

- 小文件 → 存内存
- 大文件 → 存临时文件，`MultipartFile` 只是一个引用

3. 调用 `file.getBytes()` → 会把文件内容读到内存

4. 调用 `file.transferTo(dest)` → 从内存或临时文件写到目标磁盘

## 多文件上传

```http
POST /uploadBatch HTTP/1.1
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="files"; filename="a.png"
Content-Type: image/png

(文件内容)
------WebKitFormBoundary
Content-Disposition: form-data; name="files"; filename="b.png"
Content-Type: image/png

(文件内容)
------WebKitFormBoundary--
```

### @RequestParam

```java
@PostMapping("/upload/multi")
public String uploadMultiple(@RequestParam("files") MultipartFile[] files) throws IOException {
    for (MultipartFile file : files) {
        if (!file.isEmpty()) {
            File dest = new File("/tmp/uploads/" + file.getOriginalFilename());
            dest.getParentFile().mkdirs();
            file.transferTo(dest);
        }
    }
    return "多文件上传完成";
}
```

### 直接获取

```java
@PostMapping("/uploadBatch")
public AjaxResult uploadBatch(MultipartFile[] files) {
    return AjaxResult.success();
}
```


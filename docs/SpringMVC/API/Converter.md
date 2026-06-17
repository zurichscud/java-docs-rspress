# Converter

当系统需要将前端传入的特殊格式字符串（如：`"192.168.1.1:8080"` 或 `"120x80"`）直接绑定到后端的复杂对象（如 `IpAddress` 或 `Size`）时，就需要自定义 Spring 的 `Converter`。

假设前端传一个分辨率字符串 `1920x1080`，后端需要直接用 `ScreenSize` 对象接收。

## 定义目标实体

```java
// 1. 定义目标实体
public class ScreenSize {
    private Integer width;
    private Integer height;
    // 构造函数、Getter/Setter 省略
    public ScreenSize(Integer width, Integer height) {
        this.width = width;
        this.height = height;
    }
}
```



## 实现接口

```java
// 2. 实现 Spring 的 Converter 接口
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class StringToScreenSizeConverter implements Converter<String, ScreenSize> {
    
    @Override
    public ScreenSize convert(String source) {
        if (!StringUtils.hasText(source)) {
            return null;
        }
        try {
            String[] parts = source.split("x");
            if (parts.length == 2) {
                int width = Integer.parseInt(parts[0].trim());
                int height = Integer.parseInt(parts[1].trim());
                return new ScreenSize(width, height);
            }
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("无法解析的分辨率格式: " + source, e);
        }
        throw new IllegalArgumentException("分辨率格式必须为 '宽x高'，例如: 1920x1080");
    }
}
```



## 使用

```java
public Result getLayout(@RequestParam ScreenSize size)
```


# xAxis 为什么会被序列化成 xaxis

## 背景

前后端联调图表接口时，后端 Java 对象里字段明明叫 `xAxis`，前端却收到：

```json
{
  "data": {
    "series": [],
    "xaxis": ["1月", "2月", "3月"]
  }
}
```

预期本来应该是：

```json
{
  "data": {
    "series": [],
    "xAxis": ["1月", "2月", "3月"]
  }
}
```

这个问题表面上看像是“框架把驼峰弄丢了”，但根因其实更具体：**JavaBean getter 命名 + 序列化框架属性推断规则**叠在一起，导致 `xAxis` 这种字段名天然容易出问题。

---

## 复现场景

以一个最简单的 VO 为例：

```java
@Data
public class ChartTrendVO {

    private List<String> xAxis;

    private List<BigDecimal> series;
}
```

如果使用 Lombok `@Data`，它会为 `xAxis` 生成 getter：

```java
getXAxis()
```

注意这里不是 `getxAxis()`，而是 `getXAxis()`。

很多序列化框架在输出 JSON 时，并不是直接拿“字段名”序列化，而是先扫描 getter，再根据 getter 名字反推出属性名。问题就出在这一步。

---

## 根因分析

### 1. Java 字段名是 `xAxis`

我们写代码时的直觉是：

- 字段名：`xAxis`
- JSON 名：`xAxis`

这没有问题。

### 2. Lombok 生成的是 `getXAxis()`

但是按 JavaBean 风格，getter 生成后，`xAxis` 会变成：

```java
getXAxis()
```

也就是说，原来字段里的 `xA` 这个驼峰边界，在 getter 名上已经不再明显。

### 3. 序列化框架按 getter 反推属性名

Jackson、Fastjson 这类框架经常会走这样的流程：

1. 扫描 getter
2. 找到 `getXAxis()`
3. 去掉 `get`
4. 再按自己的 JavaBean 规则反推出属性名

这一步里，`XAxis` 很容易被压成：

```json
"xaxis"
```

而不是：

```json
"xAxis"
```

所以真正的问题不是“字段名写错了”，而是：

**getter 方法名已经丢失了原字段中细粒度的驼峰边界，框架再反推时无法稳定还原。**

---

## Jackson 会这样，Fastjson 会不会

会，Fastjson 也可能遇到同类问题。

这不是 Jackson 独有的问题，而是“按 getter 推断属性名”这一类机制的共性问题。只要框架不是完全按字段名直出，而是经过 JavaBean 属性推断，这类命名都有风险。

也就是说：

- Jackson 可能把 `xAxis` 输出成 `xaxis`
- Fastjson 也可能在类似命名上出现不符合预期的结果

所以这类字段名不要依赖框架“自动猜对”。

---

## 推荐修复方案

### 方案一：显式指定 JSON 字段名

这是最稳妥、成本最低、可读性也最好的方案。

#### Jackson

```java
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class ChartTrendVO {

    @JsonProperty("xAxis")
    private List<String> xAxis;

    private List<ChartSeriesVO<BigDecimal>> series;
}
```

#### Fastjson 1.x

```java
import com.alibaba.fastjson.annotation.JSONField;

@Data
public class ChartTrendVO {

    @JSONField(name = "xAxis")
    private List<String> xAxis;

    private List<ChartSeriesVO<BigDecimal>> series;
}
```

优点：

- 最直接
- 不依赖框架猜测
- 切换序列化框架时风险更低

---

### 方案二：改字段名，避开高风险命名

例如把：

```java
private List<String> xAxis;
```

改成：

```java
private List<String> monthAxis;
```

或者：

```java
private List<String> xAxisLabels;
```

这样 getter 会变成：

- `getMonthAxis()`
- `getXAxisLabels()`

这类名字反推时歧义更小。

优点：

- 不需要额外注解

缺点：

- 会影响前后端接口契约
- 对图表语义来说，有时不如 `xAxis` 直观

如果前端已经依赖 `xAxis`，通常不如直接加注解稳。

---

## 项目里的建议

对于图表类返回对象，建议统一遵守下面两条：

### 1. 图表协议字段显式声明 JSON 名称

像下面这些常见字段，建议直接显式标注：

- `xAxis`
- `yAxis`
- `series`
- `legend`

其中 `xAxis` / `yAxis` 最值得优先处理。

### 2. 不要把“前端协议稳定”建立在框架猜测上

接口字段只要是前后端约定的一部分，就应该让它：

- 在代码里可读
- 在 JSON 里稳定
- 在框架切换时不漂移

所以像 `xAxis` 这种字段，显式注解是值得的。

---

## 一个完整示例

```java
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@ApiModel("图表趋势数据")
public class ChartTrendVO {

    @JsonProperty("xAxis")
    @ApiModelProperty("X 轴")
    private List<String> xAxis;

    @ApiModelProperty("图表序列")
    private List<ChartSeriesVO<BigDecimal>> series;
}
```

这样后端输出就会稳定为：

```json
{
  "xAxis": ["1月", "2月", "3月"],
  "series": []
}
```

---

## 总结

`xAxis` 被序列化成 `xaxis`，本质上不是业务问题，而是：

**字段名 `xAxis` -> Lombok getter `getXAxis()` -> 序列化框架按 getter 反推属性名时丢失原始驼峰边界。**

记住一句话就够了：

> 只要字段名是 `xAxis`、`yAxis`、`uId` 这类“前缀很短 + 后面紧跟大写字母”的形式，就不要把 JSON 字段名交给框架猜。

最推荐的做法是：

- Jackson 用 `@JsonProperty("xAxis")`
- Fastjson 用 `@JSONField(name = "xAxis")`

这样接口最稳，前后端联调也最省心。

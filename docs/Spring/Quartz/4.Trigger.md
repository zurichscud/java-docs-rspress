# Trigger

## 基本概念

虽然一个 Job 可以像“公用工具”一样被多个闹钟（Trigger）共用，但每一个闹钟在设计时，**必须且只能指向一个明确的任务**。

想象一下你手机里的闹钟：

- **Trigger（闹钟）**：早上 7:00 响。
- **Job（动作）**：起床。

一个闹钟响的时候，它必须对应一个明确的动作。如果你设定了 7:00 的闹钟，它不能既让你“起床”又让你“去洗车”——除非你把这两个动作封装成了一个“早起套餐任务”。在 Quartz 的底层逻辑中，Trigger 内部持有一个 `jobKey` 属性，这个属性就像一个导航指针，**只能存储一个 Job 的坐标**。

如果早上7:00有两个不同的动作，我们应该创建两个Trigger。

虽然这两个 Trigger 的触发时间（早上 7:00）完全一样，但在 Quartz 的逻辑里，它们是两条独立的“调度线”。

::: info 为什么创建两个相同的 Trigger 是最佳实践？

- **独立控制**：你可以单独暂停（Pause）其中一个任务，而不影响另一个。例如，如果你只想临时关掉“发送报表”，但保留“清理缓存”，只需停止对应的那个 Trigger 即可。

- **异常隔离**：如果 Job A 因为代码报错崩了，Job B 的 Trigger 依然会准时触发，两者互不干扰。

- **参数差异**：你可以给两个 Trigger 设置不同的 `JobDataMap`。比如 Job A 需要传入 `type=fast`，Job B 需要传入 `type=slow`，独立的 Trigger 可以携带各自的私有参数。

- **并行能力**：Quartz 的线程池会自动处理这两个 Trigger。在 7:00:00，调度器会从线程池取出两个线程，同时启动这两个 Job。

:::

## 绑定关系

在代码实现上，Job 和 Trigger 并不是直接引用的，而是通过 **Scheduler（调度器）** 将它们关联起来：

```java
// 1. 定义 Job 细节
JobDetail job = JobBuilder.newJob(MailJob.class)
    .withIdentity("mailJob", "group1")
    .build();

// 2. 定义触发器 A (每分钟执行)
Trigger triggerA = TriggerBuilder.newTrigger()
    .withIdentity("triggerA", "group1")
    .startNow()
    .withSchedule(SimpleScheduleBuilder.repeatMinutelyForever())
    .forJob(job) // 绑定 Job
    .build();

// 3. 调度器协调两者
scheduler.scheduleJob(job, triggerA);
```



## 我想同时跑两个任务怎么办？

如果你有“一到 9:00 就同时发送邮件和备份数据库”的需求，你有两种标准方案：

1. **方案 A（推荐）**：创建**两个 Trigger**，时间设定完全一样，分别指向 `EmailJob` 和 `BackupJob`。它们会同时触发。
2. **方案 B**：创建一个 `CompositeJob`（组合任务），在它的 `execute` 方法里同时调用发送邮件和备份数据库的逻辑。然后用**一个 Trigger** 指向这个组合任务。



## SimpleTrigger

### 适用场景

如果你需要的是“每隔多长时间执行一次”这种简单的周期性任务，而不是复杂的日历规则（如每月最后一个周五），那么 **SimpleTrigger** 就是最合适的选择。

它的核心逻辑非常直观：**开始时间、结束时间、重复次数、重复间隔**。

- 延时任务：当用户提交订单之后启动任务，延时30min检查订单状态，如果未支付则取消订单释放库存
- 循环任务：每个指定的时间周期执行一次任务，任务可以循环指定次数，或循环执行到指定的时间点
- 定时任务：在指定的时间点调度任务

### Use

BuilderAPI支持链式调用

- startAt：指定开始时间

```java
// 设置为 2026年6月1日 早上 8:00:00
Date startTime = new GregorianCalendar(2026, Calendar.JUNE, 1, 8, 0, 0).getTime();

Trigger trigger = TriggerBuilder.newTrigger()
    .withIdentity("myTrigger")
    .startAt(startTime) // 在这个特定时间点开始
    .withSchedule(SimpleScheduleBuilder.simpleSchedule()
        .withIntervalInMinutes(30)
        .repeatForever())
    .build();
```

- **`startNow()`**: 将开始时间设为“当前系统时间”。

```java
Trigger trigger = TriggerBuilder.newTrigger()
    .withIdentity("simpleTrigger1", "group1")
    .startNow() // 立即开始
    .withSchedule(SimpleScheduleBuilder.simpleSchedule()
        .withIntervalInSeconds(10) // 每10秒
        .repeatForever())          // 无限循环
    .build();
```

- endAt：指定结束时间

```java
Date endTime = DateBuilder.tomorrowAt(0, 0, 0); // 明天凌晨 0:0:0

Trigger trigger = TriggerBuilder.newTrigger()
    .withIdentity("promoTrigger")
    .startNow()
    .endAt(endTime) // 无论跑了多少次，明天凌晨必停
    .withSchedule(SimpleScheduleBuilder.simpleSchedule()
        .withIntervalInHours(1)
        .repeatForever())
    .build();
```

- **Repeat Count**: 重复执行的次数。可以是 0，也可以是具体的数字，或者 `SimpleScheduleBuilder.repeatForever()`（无限循环）。

```java
Date startTime = DateBuilder.futureDate(5, IntervalUnit.MINUTE); // 5分钟后开始

Trigger trigger = TriggerBuilder.newTrigger()
    .withIdentity("simpleTrigger2", "group1")
    .startAt(startTime) 
    .withSchedule(SimpleScheduleBuilder.simpleSchedule()
        .withIntervalInMinutes(1) // 每隔1分钟
        .withRepeatCount(5))      // 总共重复执行5次（总共跑6次，1次初始+5次重复）
    .build();
```

::: danger

**第一次执行（初始触发）不算在“重复次数”之内。**

在 Quartz 的 `SimpleTrigger` 中，`Repeat Count` 指的是**额外重复**的次数。

:::

- **重复间隔（Repeat Interval）** 定义了两次任务触发之间的“休息时间”。

```java
// 每隔 10 秒执行一次
.withIntervalInSeconds(10)

// 每隔 2 小时执行一次
.withIntervalInHours(2)

// 每隔 5 分钟执行一次
.withIntervalInMinutes(5)

// 直接指定毫秒（最底层的方法）
.withIntervalInMilliseconds(5000)
```



## DateBuilder

Quartz 是一个存在了很久的经典框架（早于 Java 8），它的 API 设计主要基于传统的 **`java.util.Date`**。不支持直接传入 `LocalDate` 或 `LocalDateTime`

`DateBuilder` 是 Quartz 提供的一个非常实用的工具类，专门用来简化 **`java.util.Date`** 的计算和生成。

### futureDate

```java
// 5分钟后
Date start = DateBuilder.futureDate(5, IntervalUnit.MINUTE);

// 2小时后
Date start = DateBuilder.futureDate(2, IntervalUnit.HOUR);

// 10秒后
Date start = DateBuilder.futureDate(10, IntervalUnit.SECOND);
```

### 对齐整点

很多时候我们希望任务在整点启动，比如“下一个小时的 0 分 0 秒”。

```java
// 离现在最近的下一个整点（如现在 10:15，返回 11:00）
Date start = DateBuilder.evenHourDate(new Date());

// 离现在最近的下一个分钟整点（如现在 10:15:20，返回 10:16:00）
Date start = DateBuilder.evenMinuteDate(new Date());
```

### 语义化构造时间

```java
// 今天 18:00:00
Date todayAtSix = DateBuilder.todayAt(18, 0, 0);

// 明天早上 9:30:00
Date tomorrowAtNine = DateBuilder.tomorrowAt(9, 30, 0);

// 在特定的某一天
Date specificDate = DateBuilder.dateOf(10, 30, 0, 1, 6, 2026); // 2026年6月1日 10:30:00
```



## CronTrigger

如果你需要处理像“每月最后一个工作日的 18:00”或“每天凌晨 2 点到 4 点，每 15 分钟触发一次”这类需求，`SimpleTrigger` 就无能为力了，这时候必须用 `CronTrigger`。

`CronTrigger`除了Cron表达式，其他参数的设置与`SimpleTrigger`相同

Cron 表达式由 6 或 7 个字段组成，从左到右依次为：**秒、分、小时、日期、月份、星期、(年份-可选)**。

| **字段**                | **允许值**      | **通配符**                  |
| ----------------------- | --------------- | --------------------------- |
| **秒 (Seconds)**        | 0-59            | `*` `,` `-` `/`             |
| **分 (Minutes)**        | 0-59            | `*` `,` `-` `/`             |
| **小时 (Hours)**        | 0-23            | `*` `,` `-` `/`             |
| **日期 (Day-of-Month)** | 1-31            | `*` `,` `-` `?` `L` `W` `C` |
| **月份 (Months)**       | 1-12 或 JAN-DEC | `*` `,` `-` `/`             |
| **星期 (Day-of-Week)**  | 1-7 或 SUN-SAT  | `*` `,` `,` `?` `L` `#`     |

```java
Trigger cronTrigger = TriggerBuilder.newTrigger()
    .withIdentity("myCronTrigger", "group1")
    // 语法：秒 分 时 日 月 周
    .withSchedule(CronScheduleBuilder.cronSchedule("0 15 10 ? * MON-FRI")) 
    .build();
```

为了处理特殊的日期逻辑，CronTrigger 提供了强大的符号：

- **`?` (问号)**：只能用在“日期”和“星期”字段。因为这两者逻辑有冲突（如果你指定了每月 15 号，就不需要关心星期几），所以不用的时候用 `?` 代替。
- **`L` (Last)**：表示“最后”。用在日期字段代表月底，用在星期字段代表周六。
- **`W` (Weekday)**：表示离给定日期最近的工作日（周一至周五）。例如 `15W`，如果 15 号是周六，则在 14 号（周五）触发；如果是周日，则在 16 号（周一）触发。
- **`#` (第几个)**：如 `2#3` 表示“本月第 3 个周一”。

```java
Trigger trigger = TriggerBuilder.newTrigger()
    .withIdentity("lastBusinessDayTrigger", "group1")
    .withSchedule(CronScheduleBuilder.cronSchedule("0 0 18 LW * ?")) // 每个月最后一个工作日的 18:00 执行
    .build();
```

 Cron 表达式建议使用AI编写


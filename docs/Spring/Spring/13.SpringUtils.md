# SpringUtils

spring工具类 ，适用于**非 Spring 管理的对象**中需要用到 Spring Bean。

```java
/**
 * Quartz 庭审结束任务。
 */
@DisallowConcurrentExecution
public class TrialEndQuartzJob implements Job {

    public static final String PROGRESS_RECORD_ID = "progressRecordId";

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        long progressRecordId = context.getMergedJobDataMap().getLongValue(PROGRESS_RECORD_ID);
        SpringUtils.getBean(TrialEndJobService.class).executeTrialEndJob(progressRecordId);
    }
}
```


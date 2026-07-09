# LLM记忆问题

> MethodArgumentNotValidException会被BindException异常处理器处理吗

- **Spring 5.3 之前**：`MethodArgumentNotValidException` 和 `BindException` 是**平级**关系，各自独立，需要分别捕获。
- **Spring 5.3 之后**：`MethodArgumentNotValidException` 改为**继承** `BindException`，所以只捕获 `BindException` 就能覆盖两者。



| 模型        | 回答结论                                  | 判断                          |
| ----------- | ----------------------------------------- | ----------------------------- |
| GPT-5.4     | 认为是子类关系，会被 `BindException` 处理 | ✅ 正确                        |
| GPT Instant | 认为是子类关系，会被 `BindException` 处理 | ✅ 正确                        |
| Qwen        | 认为是子类关系，会被 `BindException` 处理 | ✅ 正确                        |
| Gemini      | 认为不是子类关系                          | ❌ 错误（针对 Spring 5.x/6.x） |
| Mimo        | 认为不是子类关系                          | ❌ 错误（针对 Spring 5.x/6.x） |
| DeepSeek    | 认为不是子类关系                          | ❌ 错误（针对 Spring 5.x/6.x） |
| KIMI        | 认为不是子类关系                          | ❌                             |
| 豆包        | 认为是子类关系，会被 `BindException` 处理 | ✅                             |

综合表现，GPT的表现是最好的

LLM的记忆库必定是存在这两条知识记录。因为LLM流行前，这两种知识就已经都存在了。但是不同的LLM的回答却不同，说明模型在检索能力上存在差异，

例如Deepseek，在提醒之后就会激活这部分的知识，Deepseek给出未能一开始检索到的原因是知识管理和调用机制上的缺陷。
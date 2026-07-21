# Springboot规范

1. **Controller 直接调用 Mapper** — 必须经 Service 层
2. **Service 层暴露 Entity 给前端** — 必须转 VO/DTO
3. **在 DTO/VO/Entity 中写业务逻辑** — 纯数据容器
4. **魔法字符串/数字散落** — 统一收拢到 `constants` 包
5. **SQL 写在 Java 字符串中** — 必须用 XML Mapper 或 `@Select` 注解（简单查询）
6. **跨业务域直接调用 Mapper** — 通过 Service 或 RPC 解耦
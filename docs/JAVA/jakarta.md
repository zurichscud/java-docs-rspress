# jakarta

甲骨文（Oracle）把 Java EE 移交给了 Eclipse 基金会，但不允许他们继续使用 `javax` 商标。因此，从 Java EE 9 开始，所有的官方规范包名全部从 `javax.*` 整体重命名为了 `jakarta.*`。

- **JDK 1.8 确实自带 `javax`**，但主要是一些像加密（`javax.crypto`）、图形界面（`javax.swing`）的核心扩展。

- **企业级包（如校验、Servlet、JPA）不在 JDK 中**，即使在 Java 8 时代，也是通过 Maven 依赖引入的“外来户”。

- **未来的趋势**：到了 Java 9 及之后的模块化时代，JDK 把绝大多数非核心的 `javax` 彻底剥离了。而到了现今的 **Spring Boot 3.x + Java 17/21** 时代，企业级规范全面更名为 `jakarta.*`，以前的 `javax.validation` 已经正式彻底退役。
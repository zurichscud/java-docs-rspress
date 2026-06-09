# Bean的作用域（scope）

**Scope（作用域）** 决定了容器如何创建 Bean 实例，以及这个实例的生命周期。

## singleton

单例-默认

- **行为**：在整个 Spring IOC 容器中，**只有一个** Bean 实例。每次请求该 Bean 时，Spring 都会返回同一个对象。

- **生命周期**：随容器启动而创建，随容器关闭而销毁。

- **注意**：由于是共享的，**必须保证线程安全**。通常 Service 层和 Controller 层都是 Singleton。

## prototype

原型（多例）

- **行为**：每次获取（调用 `getBean()`）时，Spring 都会**创建一个新的** Bean 实例。

- **生命周期**：Spring 只负责创建，不负责后续的销毁。

- **场景**：适用于有状态的 Bean（例如多线程中的资源分配）。


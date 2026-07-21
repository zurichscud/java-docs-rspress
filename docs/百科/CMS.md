# CMS

CMS（Content Management System，内容管理系统） 是一种用来 创建、管理和发布网站内容 的系统。

## 本地 CMS

vitePress 是一个静态站点生成器（SSG），属于“本地内容系统”。

VitePress = Markdown + Vue3 + Vite 构建的静态文档系统

## 远程 CMS

“远程” 一般是相对“本地 CMS”而言的。内容数据不是存放在你的项目代码里，而是托管在一个独立的服务器或云端 CMS 服务中，通过 API（REST / GraphQL）远程获取内容。

换句话说，前端只负责展示，而所有内容（文章、图片、配置等）都来自远程 CMS。

这些系统通常提供一个后台界面，让非开发者也能轻松编辑网站内容。

## WordPress

现在越来越多前端项目（比如 Vue、Nuxt、Next.js、VitePress）喜欢把 WordPress 当作 内容数据源 来用：

WordPress 只负责管理内容（后台编辑器、数据库）；

前端网站是独立项目；

通过 WordPress REST API 或 GraphQL 接口 获取内容。

## 应用

假设你在做一个用 Vue3 + VitePress 的文档站点，
你不想每次改文案都重新构建。
于是你接入了一个远程 CMS（比如 Strapi 或 Sanity）。

你的前端会：

```ts
// 示例：在前端远程请求 CMS 内容
fetch("https://mycms.com/api/posts")
  .then((res) => res.json())
  .then((data) => {
    console.log(data); // CMS 返回的文章列表
  });
```

CMS 后台的内容编辑人员可以登录管理界面修改文章，
你的网站前端会自动展示最新内容，而无需重新部署。

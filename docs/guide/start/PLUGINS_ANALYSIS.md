# Rspress Plugins 分析文档

## 目录 <Tag tag="new" />
123

## 🔧 开发工具

### rspress-plugin-devkit — 插件开发工具包

其他所有插件的底层依赖库，不直接面向用户使用。

**提供的能力：**

| 模块 | 说明 |
|------|------|
| `RemarkCodeBlockToGlobalComponentPluginFactory` | 将代码块转为全局组件的工厂 |
| `RemarkInsertComponentPluginFactory` | 在文档特定位置插入组件的工厂 |
| `PresetConfigMutator` | 预设配置修改器 |
| `remarkParseDirective` / `remarkTransformDirective` | 指令语法解析与转换 |
| `MDASTNodeFactory` / `ESTreeNodeFactory` / `MdxJsxElementFactory` | 各种 AST 节点工厂 |
| `TSSourceParser` | TypeScript 源码解析器 |
| 工具函数 | `ensureArray`、`uniqArray`、`createTuple`、`resolveSourcePath` 等 |

---

## 📝 Markdown 增强类

### rspress-plugin-katex — 数学公式渲染

用 [KaTeX](https://katex.org/) 渲染数学公式。

- 支持行内公式 `$...$` 和代码块 `` ```math ```
- 通过 `remark-math` + `rehype-katex` 实现
- 自动注入 `katex.min.css` 样式
- 附加 `remarkCodeBlockToMath` 将 `math` 代码块转为 `<div class="math math-display">`

```ts
plugins: [
  katex({
    macros: { '\\f': '#1f(#2)' },
  }),
]
```

---

### rspress-plugin-mermaid — 图表渲染

将 `` ```mermaid ``` ` 代码块渲染为 SVG 图表。

- 支持流程图、时序图、甘特图等所有 Mermaid 图表类型
- 可传入自定义 `mermaidConfig` 配置主题等
- 使用 `RemarkCodeBlockToGlobalComponentPluginFactory` 将代码块转为 `<MermaidRender>` 组件

```ts
plugins: [
  mermaid({
    mermaidConfig: { theme: 'forest' },
  }),
]
```

---

### rspress-plugin-supersub — 上标/下标支持

在 Markdown 中使用上标和下标语法。

| 语法 | 渲染结果 | 示例 |
|------|----------|------|
| `^sup^` | `<sup>sup</sup>` | `2^10^` → 2¹⁰ |
| `_sub_` | `<sub>sub</sub>` | `H_2_O` → H₂O |

> **注意：** 下标用 `_` 而非 `~`，因为 `~` 与删除线语法 `<del>` 冲突。

可自定义符号：

```ts
plugins: [
  supersub({
    superSyntax: '^',  // 默认
    subSyntax: '_',    // 默认
  }),
]
```

---

### rspress-plugin-directives — 自定义指令

扩展 `:::` 指令语法，允许自定义指令到组件的映射。

**核心价值：** 免去在 MDX 中手动 import 组件的麻烦，直接用 `:::name` 语法引用全局组件。

```ts
plugins: [
  directives({
    directive: 'guide',
    transformer: {
      type: 'globalComponent',
      getComponentName: (meta) => 'Guide',
      componentPath: path.join(__dirname, './components/Guide.tsx'),
    },
  }),
]
```

使用效果：

```markdown
:::guide
Skip this section if you are already familiar with the topic.
:::
```

转换为：

```mdx
<Guide>Skip this section if you are already familiar with the topic.</Guide>
```

---

### rspress-plugin-file-tree — 文件树视图

将 `` ```tree ``` ` 代码块渲染为可视化文件树。

- 支持文件/文件夹图标、展开/折叠
- 解析树形文本格式（`├──`、`└──`、`│` 符号）
- 渲染组件 fork 自 [Geist UI](https://geist-ui.dev/)
- 可配置 `initialExpandDepth` 控制初始展开深度

````markdown
```tree
.
├── src
│   ├── components
│   │   └── FileTree.tsx
│   └── index.ts
└── tsconfig.json
```
````

```ts
plugins: [
  fileTree({ initialExpandDepth: 0 }),
]
```

---

### rspress-plugin-align-image — 图片对齐

自动将单图段落 `<p><img/></p>` 包裹为 flex 容器 div，实现图片对齐。

- 支持 `center`（默认）、`left`、`right` 对齐
- 可自定义容器 CSS 类名
- 基于 rehype 插件，检测独占一个段落的图片元素

```ts
plugins: [
  alignImage({
    justify: 'left',
    containerClassNames: ['my-class'],
  }),
]
```

---

## 🎨 UI 功能类

### rspress-plugin-back-to-top — 回到顶部按钮

页面滚动超过阈值后显示回到顶部按钮。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `threshold` | `number` | `300` | 显示按钮的滚动距离（px） |

```ts
plugins: [back2Top({ threshold: 500 })]
```

通过 `globalUIComponents` 注入 `Back2Top.tsx` 组件。

---

### rspress-plugin-reading-time — 阅读时间估算

在文档标题下方自动显示预计阅读时间。

- 使用 [reading-time](https://www.npmjs.com/package/reading-time) 库计算
- 通过 `extendPageData` 钩子将 `readingTimeData` 注入页面数据
- 通过 `RemarkInsertComponentPluginFactory` 在首个标题后插入组件
- 支持自定义 locale（如 `zh-CN`）

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `getReadingTime` | `(content: string) => ReadTimeResults` | `reading-time` | 自定义阅读时间计算函数 |
| `defaultLocale` | `string` | `en-US` | 默认语言区域 |

```ts
plugins: [readingTime({ defaultLocale: 'zh-CN' })]
```

---

### rspress-plugin-live2d — Live2D 看板娘

在页面右下角显示 Live2D 虚拟角色动画。

- 基于 [on-my-live2d](https://oml2d.com/) 实现
- 通过 `globalUIComponents` 注入 `Live2DWidget` 组件
- 可配置模型路径、位置、缩放等

```ts
plugins: [
  live2d({
    models: [{
      path: 'https://model.oml2d.com/HK416-1-normal/model.json',
      position: [0, 60],
      scale: 0.08,
      stageStyle: { height: 450 },
    }],
  }),
]
```

更多模型和配置见 [On My Live2D](https://oml2d.com/guide/models.html)。

---

## 🚀 部署 & 分析类

### rspress-plugin-gh-pages — GitHub Pages 自动部署

`rspress build` 完成后自动将构建产物推送到 `gh-pages` 分支。

**核心能力：**

- 无需手动 push 和等待 CI，构建即部署
- 自动从 repo URL 解析 `siteBase`
  - `github.io` 仓库 → `siteBase = /`
  - 其他仓库 → `siteBase = /<repo-name>`
- 支持自定义分支、目录、静默模式

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `repo` | `string` | ✅ | — | GitHub 仓库地址 |
| `branch` | `string` | — | `gh-pages` | 目标分支 |
| `directory` | `string` | — | `config.outDir` | 要推送的目录 |
| `siteBase` | `string` | — | 自动解析 | 站点 base 路径 |
| `silent` | `boolean` | — | `false` | 静默模式 |

```ts
plugins: [
  ghPages({
    repo: 'https://github.com/user/repo.git',
    branch: 'website',
  }),
]
```

---

### rspress-plugin-google-analytics — Google Analytics 集成

自动注入 Google Analytics (gtag.js) 跟踪代码。

- 注入 `gtag.js` 脚本和预连接 `<link>` 标签
- 支持多个跟踪 ID（`string | string[]`）
- 支持 IP 匿名化
- 通过 `SendGTagEvent` 组件跟踪 SPA 路由切换事件

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `id` | `string \| string[]` | ✅ | — | GA 跟踪 ID |
| `anonymizeIP` | `boolean` | — | `false` | IP 匿名化 |

```ts
plugins: [ga({ id: 'UA-123456789-0', anonymizeIP: true })]
```

---

### rspress-plugin-vercel-analytics — Vercel Analytics 集成

注入 [Vercel Analytics](https://vercel.com/docs/analytics) 组件。

- 自动根据 `NODE_ENV` 区分 production/development 模式
- 通过 `globalUIComponents` 注入 `VercelAnalytics` 组件
- 基于 `@vercel/analytics` SDK

```ts
plugins: [vercelAnalytics()]
```

---

## 📊 总结

| 分类 | 插件 | 核心依赖/技术 |
|------|------|---------------|
| 开发工具 | `devkit` | remark/rehype 生态、unified |
| Markdown 增强 | `katex` | remark-math + rehype-katex |
| | `mermaid` | mermaid.js |
| | `supersub` | 自定义 remark 插件 |
| | `directives` | remark-directive + 自定义转换器 |
| | `file-tree` | 自定义 remark + React 组件 |
| | `align-image` | rehype 插件 |
| UI 功能 | `back-to-top` | globalUIComponents |
| | `reading-time` | reading-time + remark 插件 |
| | `live2d` | on-my-live2d |
| 部署/分析 | `gh-pages` | gh-pages npm 包 |
| | `google-analytics` | gtag.js |
| | `vercel-analytics` | @vercel/analytics |

**插件架构模式：**

1. **Remark/Rehype 插件模式** — 通过 Markdown AST 转换实现（katex、mermaid、supersub、align-image）
2. **Code Block → 全组件模式** — 用 `RemarkCodeBlockToGlobalComponentPluginFactory` 将特定语言代码块转为 React 组件（file-tree、mermaid）
3. **Global UI Components 模式** — 注入全局 UI 组件（back-to-top、live2d、google-analytics、vercel-analytics）
4. **构建钩子模式** — 利用 `afterBuild`、`extendPageData` 等生命周期钩子（gh-pages、reading-time）

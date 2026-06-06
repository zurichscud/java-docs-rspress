const highlights = [
  {
    label: 'MDX Lab',
    title: '把文档写成可交互的产品说明',
    text: '组合 MDX、代码块元信息、文件树和组件示例，让教程不只是文字，而是能直接验证的工作台。',
  },
  {
    label: 'Design System',
    title: '统一站点气质与阅读节奏',
    text: '通过 Rspress 自定义主题入口覆盖首页和 CSS 变量，保留默认主题能力，同时拥有独立视觉表达。',
  },
  {
    label: 'Plugin Ready',
    title: '为复杂技术内容准备好插件位',
    text: '文件树、Mermaid、JSON Schema 与 API 文档可以在同一个信息架构中自然展开。',
  },
];

const docs = [
  { title: '快速开始', text: '了解站点结构、导航配置和 Rspress 基础能力。', href: '/guide/start/getting-started' },
  { title: 'MDX 使用', text: '使用组件、容器、代码块标题和元信息增强文档。', href: '/guide/use-mdx/' },
  { title: '文件树示例', text: '展示项目目录、状态和技术层级关系。', href: '/guide/file-tree-example' },
  { title: 'API 命令', text: '查阅 CLI 命令与站点运行方式。', href: '/api/commands' },
];

const stats = [
  ['4', '核心文档入口'],
  ['2', '插件能力已接入'],
  ['100%', 'Rspress v2 主题兼容'],
];

export function HomeLayout() {
  return (
    <main className="home-shell" aria-labelledby="home-title">
      <section className="home-hero">
        <div className="home-hero__copy">
          <p className="home-kicker">Rspress Custom Theme</p>
          <h1 id="home-title">一个面向技术创作的高质感文档主页</h1>
          <p className="home-lede">
            用清晰的信息架构、克制的视觉层次和可扩展的主题入口，把知识库变成一个真正好逛、好读、好维护的产品界面。
          </p>
          <div className="home-actions" aria-label="主页操作">
            <a className="home-button home-button--primary" href="/guide/start/getting-started">
              开始阅读
            </a>
            <a className="home-button home-button--ghost" href="/guide/use-mdx/">
              查看 MDX 能力
            </a>
          </div>
        </div>

        <div className="home-console" aria-label="Rspress 主题定制摘要">
          <div className="home-console__bar">
            <span />
            <span />
            <span />
          </div>
          <div className="home-console__content">
            <p className="home-console__eyebrow">theme/index.tsx</p>
            <pre>
              <code>{`import './index.css';
export * from '@rspress/core/theme-original';
export { HomeLayout } from './components/HomeLayout';`}</code>
            </pre>
            <div className="home-console__footer">
              <span>home layout override</span>
              <strong>v2 ready</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="home-stats" aria-label="站点概览">
        {stats.map(([value, label]) => (
          <div className="home-stat" key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="home-section" aria-labelledby="highlights-title">
        <div className="home-section__header">
          <p className="home-kicker">What It Enables</p>
          <h2 id="highlights-title">为文档站准备的三个设计支点</h2>
        </div>
        <div className="home-highlight-grid">
          {highlights.map((item) => (
            <article className="home-highlight" key={item.label}>
              <span>{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section home-section--route" aria-labelledby="route-title">
        <div className="home-section__header">
          <p className="home-kicker">Doc Route</p>
          <h2 id="route-title">从这里进入你的内容系统</h2>
        </div>
        <div className="home-doc-grid">
          {docs.map((item, index) => (
            <a className="home-doc-card" href={item.href} key={item.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

import {
  siMarkdown,
  siOpenapiinitiative,
  siOpenjdk,
  siSpring,
  siSpringboot,
  type SimpleIcon,
} from 'simple-icons';

const modules = [
  {
    name: 'guide',
    title: 'Guide',
    text: 'Rspress、MDX、文件树与站点使用说明。',
    href: '/guide/start/introduction',
    count: '8 topics',
    icon: siMarkdown,
  },
  {
    name: 'Springboot',
    title: 'Spring Boot',
    text: '入门、请求处理、自动配置、日志、整合与异常处理。',
    href: '/Springboot/入门/1.QuickStart',
    count: '34 notes',
    icon: siSpringboot,
  },
  {
    name: 'JAVA',
    title: 'Java',
    text: '基础语法、集合、泛型、反射、注解、日期与面向对象。',
    href: '/JAVA/1.JAVA运行',
    count: '70+ notes',
    icon: siOpenjdk,
  },
  {
    name: 'api',
    title: 'API',
    text: '站点命令与 API 参考。',
    href: '/api/',
    count: '2 pages',
    icon: siOpenapiinitiative,
  },
  {
    name: 'Spring',
    title: 'Spring',
    text: 'Spring 容器、AOP、Quartz、XXL-Job、支付与短信服务。',
    href: '/Spring/Spring/1.QuickStart',
    count: '40+ notes',
    icon: siSpring,
  },
];

function SimpleIconMark({ icon }: { icon: SimpleIcon }) {
  return (
    <svg viewBox="0 0 24 24" focusable="false">
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}

const stats = [
  ['5', '一级模块'],
  ['docs', '内容根目录'],
  ['public', '静态资源目录已排除'],
];

export function HomeLayout() {
  return (
    <main className="home-shell" aria-labelledby="home-title">
      <section className="home-hero">
        <div className="home-hero__copy">
          <p className="home-kicker">Docs Modules</p>
          <h1 id="home-title">莫听穿林打叶声，何妨吟啸且徐行。</h1>
          <p className="home-lede">竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。</p>
          <div className="home-actions" aria-label="主页操作">
            <a className="home-button home-button--primary" href="/Springboot/入门/1.QuickStart">
              进入 Spring Boot
            </a>
            <a className="home-button home-button--ghost" href="/JAVA/1.JAVA运行">
              进入 Java
            </a>
          </div>
        </div>

        <div className="home-console" aria-label="docs 一级目录模块摘要">
          <div className="home-console__bar">
            <span />
            <span />
            <span />
          </div>
          <div className="home-console__content">
            <p className="home-console__eyebrow">docs/</p>
            <ul className="home-module-list">
              {modules.map((item) => (
                <li key={item.name}>
                  <span>{item.name}</span>
                  <strong>{item.title}</strong>
                </li>
              ))}
            </ul>
            <div className="home-console__footer">
              <span>first-level directories</span>
              <strong>{modules.length} modules</strong>
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

      <section className="home-section home-section--route" aria-labelledby="route-title">
        <div className="home-section__header">
          <p className="home-kicker">Module Route</p>
          <h2 id="route-title">快速进入 docs 目录下的模块</h2>
        </div>
        <div className="home-doc-grid">
          {modules.map((item, index) => (
            <a
              className="home-doc-card"
              data-module={item.name}
              href={item.href}
              key={item.title}
            >
              <div className="home-doc-card__body">
                <div className="home-doc-card__head">
                  <span className="home-doc-card__index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="home-doc-card__icon" aria-hidden="true">
                    <SimpleIconMark icon={item.icon} />
                  </span>
                </div>
                <div className="home-doc-card__content">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
                <div className="home-doc-card__footer">
                  <span>{item.count}</span>
                  <i aria-hidden="true">↗</i>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

import { type SimpleIcon } from 'simple-icons';
import recentUpdates from '../../data/recent-updates.json';
import statsData from '../../data/stats.json';
import { modules } from '../../data/modules';

const moduleIconMap: Record<string, SimpleIcon> = Object.fromEntries(
  modules.map((m) => [m.name, m.icon])
);

function SimpleIconMark({ icon }: { icon: SimpleIcon }) {
  return (
    <svg viewBox="0 0 24 24" focusable="false">
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}

const stats = [
  [String(statsData.moduleCount), '模块数'],
  [String(statsData.fileCount), '文件数'],
  [statsData.lastUpdateAgo, '距离上一次更新已过'],
];

export function HomeLayout() {
  return (
    <main className="home-shell" aria-labelledby="home-title">
      <section className="home-hero">
        <div className="home-hero__copy">
          <p className="home-kicker">Docs Modules</p>
          <h1 id="home-title">莫听穿林打叶声，何妨吟啸且徐行。</h1>
          <p className="home-lede">竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。</p>
        </div>

        <div className="home-console" aria-label="最近更新文件">
          <div className="home-console__bar">
            <span />
            <span />
            <span />
          </div>
          <div className="home-console__content">
            <p className="home-console__eyebrow">recent files</p>
            <ul className="home-update-list">
              {recentUpdates.slice(0, 5).map((item) => (
                <li key={item.path}>
                  <a href={item.href}>
                    <span className="home-update-list__badge">
                      {moduleIconMap[item.module] && (
                        <span className="home-update-list__icon" aria-hidden="true">
                          <SimpleIconMark icon={moduleIconMap[item.module]} />
                        </span>
                      )}
                      <span className="home-update-list__module">{item.module}</span>
                    </span>
                    <span className="home-update-list__body">
                      <strong>{item.title}</strong>
                      <time className="home-update-list__time">{item.updatedAt}</time>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
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

import { useEffect, useMemo, useRef, useState } from 'react';

export interface ApiIndexItem {
  name: string;
  label?: string;
  href?: string;
}

export interface ApiIndexProps {
  items: ApiIndexItem[];
  basePath?: string;
  eyebrow?: string;
  ariaLabel?: string;
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.75" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

export function ApiIndex({
  items,
  basePath = '',
  eyebrow = 'API Directory',
  ariaLabel = 'API 索引',
}: ApiIndexProps) {
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      const target = event.target;
      const isEditing =
        target instanceof HTMLElement &&
        (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

      if (event.key === '/' && !isEditing) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', focusSearch);
    return () => window.removeEventListener('keydown', focusSearch);
  }, []);

  const documents = useMemo(() => {
    const normalizedBasePath = basePath.replace(/\/+$/, '');

    return items.map((item) => ({
      label: item.label ?? item.name,
      href:
        item.href ??
        `${normalizedBasePath ? `${normalizedBasePath}/` : ''}${encodeURIComponent(item.name)}`,
    }));
  }, [basePath, items]);

  const filteredDocuments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return normalizedQuery
      ? documents.filter((document) => document.label.toLowerCase().includes(normalizedQuery))
      : documents;
  }, [documents, query]);

  return (
    <section className="api-index" aria-label={ariaLabel}>
      <div className="api-index__summary">
        <div>
          <p className="api-index__eyebrow">{eyebrow}</p>
          <strong>浏览全部条目</strong>
        </div>
        <dl aria-label="API 文档统计">
          <div>
            <dt>文档</dt>
            <dd>{documents.length}</dd>
          </div>
        </dl>
      </div>

      <label className="api-index__search">
        <SearchIcon />
        <span className="api-index__sr-only">搜索 API</span>
        <input
          ref={searchInputRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索 API 名称"
        />
        <kbd>/</kbd>
      </label>

      <div className="api-index__result-bar" aria-live="polite">
        <span>{filteredDocuments.length} 个结果</span>
      </div>

      {filteredDocuments.length > 0 ? (
        <div className="api-index__grid">
          {filteredDocuments.map((document) => (
            <a className="api-index__card" href={document.href} key={document.href}>
              <h3>{document.label}</h3>
            </a>
          ))}
        </div>
      ) : (
        <div className="api-index__empty">
          <strong>没有找到相关 API</strong>
          <button type="button" onClick={() => setQuery('')}>
            清空搜索
          </button>
        </div>
      )}
    </section>
  );
}

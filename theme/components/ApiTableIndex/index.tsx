import type { ApiIndexItem } from '../ApiIndex';

export interface ApiTableIndexProps {
  items: ApiIndexItem[];
  basePath?: string;
  ariaLabel?: string;
}

export function ApiTableIndex({
  items,
  basePath = '',
  ariaLabel = 'API 索引',
}: ApiTableIndexProps) {
  const normalizedBasePath = basePath.replace(/\/+$/, '');
  const documents = items.map((item) => ({
    label: item.label ?? item.name,
    href:
      item.href ??
      `${normalizedBasePath ? `${normalizedBasePath}/` : ''}${encodeURIComponent(item.name)}`,
  }));

  return (
    <table aria-label={ariaLabel}>
      <thead>
        <tr>
          <th>API</th>
        </tr>
      </thead>
      <tbody>
        {documents.map((document) => (
          <tr key={document.href}>
            <td>
              <a href={document.href}>{document.label}</a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

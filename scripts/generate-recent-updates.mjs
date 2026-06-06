import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, join, relative, basename, dirname } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const DOCS_DIR = join(ROOT, 'docs');
const RECENT_OUTPUT = join(ROOT, 'theme/data/recent-updates.json');
const STATS_OUTPUT = join(ROOT, 'theme/data/stats.json');

// 获取 docs 下所有 .md / .mdx 文件
function getAllMarkdownFiles(dir) {
  const files = [];
  const entries = execSync(`find "${dir}" -name "*.md" -o -name "*.mdx"`, {
    encoding: 'utf-8',
    cwd: ROOT,
  })
    .trim()
    .split('\n')
    .filter(Boolean);
  return entries;
}

// 从文件内容提取标题：优先 frontmatter title，其次首个 # 标题，最后用文件名
function extractTitle(filePath) {
  const content = readFileSync(filePath, 'utf-8');

  // frontmatter title
  const fmMatch = content.match(/^---\s*\n[\s\S]*?title:\s*["']?(.+?)["']?\s*\n[\s\S]*?---/);
  if (fmMatch) return fmMatch[1].trim();

  // 首个 # 标题
  const headingMatch = content.match(/^#\s+(.+)$/m);
  if (headingMatch) return headingMatch[1].trim();

  // 兜底：去掉扩展名的文件名
  return basename(filePath).replace(/\.(md|mdx)$/, '');
}

// 用 git log 获取文件最后修改时间
function getUpdatedAt(filePath) {
  try {
    const iso = execSync(
      `git log -1 --format="%ci" -- "${relative(ROOT, filePath)}"`,
      { encoding: 'utf-8', cwd: ROOT },
    ).trim();
    if (!iso) return null;
    // 转为 YYYY-MM-DD HH:mm
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return null;
  }
}

// 构建 href：去掉 docs/ 前缀和文件扩展名
function buildHref(filePath) {
  const rel = relative(DOCS_DIR, filePath).replace(/\.(md|mdx)$/, '');
  return '/' + rel.replace(/\\/g, '/');
}

// 提取模块名：docs 下的第一级目录
function extractModule(filePath) {
  const rel = relative(DOCS_DIR, filePath);
  const parts = rel.split('/');
  return parts.length > 1 ? parts[0] : '';
}

// 计算距今的相对时间
function timeAgo(dateStr) {
  const now = new Date();
  const then = new Date(dateStr.replace(' ', 'T'));
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin} 分钟`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} 小时 ${diffMin % 60} 分钟`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} 天 ${diffHr % 24} 小时`;
}

// 获取仓库最后一次 git commit 时间
function getLastCommitTime() {
  try {
    const iso = execSync('git log -1 --format="%ci"', {
      encoding: 'utf-8',
      cwd: ROOT,
    }).trim();
    if (!iso) return null;
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return null;
  }
}

function main() {
  const files = getAllMarkdownFiles(DOCS_DIR);

  // ── recent-updates.json ──
  const entries = files
    .map((f) => {
      const updatedAt = getUpdatedAt(f);
      if (!updatedAt) return null;
      return {
        title: extractTitle(f),
        path: relative(ROOT, f),
        href: buildHref(f),
        module: extractModule(f),
        updatedAt,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  writeFileSync(RECENT_OUTPUT, JSON.stringify(entries, null, 2) + '\n', 'utf-8');
  console.log(`✅ Generated ${RECENT_OUTPUT} — ${entries.length} entries`);

  // ── stats.json ──
  const modules = new Set(entries.map((e) => e.module).filter(Boolean));
  const lastCommit = getLastCommitTime();

  const stats = {
    moduleCount: modules.size,
    fileCount: files.length,
    lastUpdate: lastCommit,
    lastUpdateAgo: lastCommit ? timeAgo(lastCommit) : '',
  };

  writeFileSync(STATS_OUTPUT, JSON.stringify(stats, null, 2) + '\n', 'utf-8');
  console.log(`✅ Generated ${STATS_OUTPUT} — ${stats.moduleCount} modules, ${stats.fileCount} files`);
}

main();

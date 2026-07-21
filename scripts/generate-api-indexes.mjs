import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const DOCS_DIR = join(ROOT, 'docs');
const OUTPUT = join(ROOT, 'theme', 'data', 'api-indexes.json');

function findApiDirectories(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (!entry.isDirectory()) {
      return [];
    }

    const childDirectory = join(directory, entry.name);
    return entry.name === 'API' ? [childDirectory] : findApiDirectories(childDirectory);
  });
}

function getApiItems(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.mdx?$/.test(entry.name))
    .map((entry) => ({ name: entry.name.replace(/\.mdx?$/, '') }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

function main() {
  const indexes = Object.fromEntries(
    findApiDirectories(DOCS_DIR)
      .sort()
      .map((directory) => [relative(DOCS_DIR, directory).split(sep).join('/'), getApiItems(directory)]),
  );

  mkdirSync(join(ROOT, 'theme', 'data'), { recursive: true });
  writeFileSync(OUTPUT, `${JSON.stringify(indexes, null, 2)}\n`, 'utf-8');
  console.log(`Generated ${OUTPUT} — ${Object.keys(indexes).length} API directories`);
}

main();

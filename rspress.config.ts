import * as path from 'node:path';
import { defineConfig } from '@rspress/core';
import pluginFileTree from 'rspress-plugin-file-tree';
import { visit } from 'unist-util-visit';

import mermaidZoom from './plugins/mermaid-zoom';

function remarkNormalizeCodeLang() {
  const aliasMap: Record<string, string> = {
    SQL: 'sql',
    JAVA: 'java',
    'java[编译后]': 'java',
    '[lombok.config]': 'properties',
  };

  return (tree: unknown) => {
    visit(tree, 'code', (node: { lang?: string }) => {
      if (!node.lang) {
        return;
      }

      const normalizedLang =
        aliasMap[node.lang] ??
        (/^[A-Z0-9_+#-]+$/.test(node.lang) ? node.lang.toLowerCase() : undefined);

      if (normalizedLang) {
        node.lang = normalizedLang;
      }
    });
  };
}

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'My Site',
  icon: '/rspress-icon.png',
  logo: {
    light: '/rspress-light-logo.png',
    dark: '/rspress-dark-logo.png',
  },
  plugins: [
    pluginFileTree(),
    mermaidZoom(),
  ],
  builderConfig: {
    dev: {
      // Avoid stale lazy-compilation proxies after docs or global MDX components change.
      lazyCompilation: false,
    },
  },
  markdown: {
    remarkPlugins: [remarkNormalizeCodeLang],
    link:{
      checkDeadLinks:true
    },
    image:{
      checkDeadImages:true
    },
    shiki: {
      langs: ['tsx', 'ts', 'js', 'java', 'properties'],
      langAlias: {
        SQL: 'sql',
        JAVA: 'java',
        'java[编译后]': 'java',
        '[lombok.config]': 'properties',
      },
    },
  },
  themeConfig: {
    lastUpdated: true,
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/zurichscud/java-docs-rspress',
      },
    ],
  },
});

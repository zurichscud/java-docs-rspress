import * as path from 'node:path';
import { defineConfig } from '@rspress/core';
import pluginFileTree from 'rspress-plugin-file-tree';
import mermaid from 'rspress-plugin-mermaid';

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
    mermaid(),
  ],
  markdown: {
    shiki: {
      langs: ['tsx', 'ts', 'js', 'java', 'properties'],
      transformers: [
        {
          preprocess(code, { lang }) {
            if (lang) {
              const aliasMap: Record<string, string> = {
                JAVA: 'java',
                'java[编译后]': 'java',
                '[lombok.config]': 'properties',
              };
              if (aliasMap[lang]) {
                this.options.lang = aliasMap[lang];
              }
            }
            return code;
          },
        },
      ],
    },
  },
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/web-infra-dev/rspress',
      },
    ],
  },
});

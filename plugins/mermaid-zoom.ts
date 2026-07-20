import * as path from 'node:path';
import type { RspressPlugin } from '@rspress/core';
import { RemarkCodeBlockToGlobalComponentPluginFactory } from 'rspress-plugin-devkit';
import type { MermaidConfig } from 'mermaid';

interface MermaidZoomOptions {
  mermaidConfig?: MermaidConfig;
}

export default function mermaidZoom(
  options: MermaidZoomOptions = {},
): RspressPlugin {
  const { mermaidConfig = {} } = options;
  const remarkMermaid = new RemarkCodeBlockToGlobalComponentPluginFactory({
    components: [
      {
        lang: 'mermaid',
        componentPath: path.join(
          __dirname,
          '../theme/components/MermaidDiagram/MermaidDiagram.tsx',
        ),
        childrenProvider() {
          return [];
        },
        propsProvider(code) {
          return {
            code,
            config: mermaidConfig,
          };
        },
      },
    ],
  });

  return {
    name: 'mermaid-zoom',
    markdown: {
      remarkPlugins: [remarkMermaid.remarkPlugin],
      globalComponents: remarkMermaid.mdxComponents,
    },
    builderConfig: remarkMermaid.builderConfig,
  };
}

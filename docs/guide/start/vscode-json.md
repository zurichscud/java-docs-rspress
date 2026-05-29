# JSON schema 类型提示

为了更好地编辑 _nav.json 和 _meta.json 文件，Rspress 提供了 @rspress/core/meta-json-schema.json 和 @rspress/core/nav-json-schema.json 两个 schema 文件用于 IDE 的类型提示。

以 VSCode 为例，可以在 .vscode/settings.json 中添加如下配置:

```json title=.vscode/settings.json
{
  //...
  "json.schemas": [
    {
      "fileMatch": ["**/_meta.json"],
      "url": "./node_modules/@rspress/core/meta-json-schema.json"
      // 或者 "url": "https://unpkg.com/@rspress/core@2.0.0/meta-json-schema.json"
    },
    {
      "fileMatch": ["**/_nav.json"],
      "url": "./node_modules/@rspress/core/nav-json-schema.json"
      // 或者 "url": "https://unpkg.com/@rspress/core@2.0.0/nav-json-schema.json"
    }
  ]
  // ...
}


```
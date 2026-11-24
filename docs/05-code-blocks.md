---
title: "05. 高阶代码块与语法高亮"
description: "实测经典 VuePress v1 (1.9.10) 基于 Prism.js 的 {3,7-9} 行高亮开创性设计，以及缺失原生 [title] 标题栏与 ::: code-group 容器的历史局限。"
---

# 05. 高阶代码块与语法高亮 <Badge text="vuepress@1.9.10 · Prism.js" type="tip" vertical="middle" />

与 `vuepress-v2` 及 `vitepress-v1` 对照阅读本页，可以清晰看到初代 **VuePress v1 (`1.9.10`)** 在代码展示演进史上的承上启下地位：它开创了后来被整个前端文档生态效仿的 `{3,7-9}` 行高亮方言，但在代码块标题栏、词法级 Diff 与 Markdown 代码组容器上仍受限于早期 **Prism.js** 管线。

## 1. 缺乏原生文件名标题栏（仅支持 Prism 语法高亮与全局行号）

VuePress v1 在 `docs/.vuepress/config.js` 开启 `markdown: { lineNumbers: true }` 后可输出左侧行号列，但**不支持 `[scripts/resolve-route.ts]` 或 `title="..."` 标题栏属性**（若强行写在语言标识后会被 Prism 当作未知语言类名导致语法高亮失效！），因此派生时只能保留母版的上方粗体路径标注：

**`scripts/resolve-route.ts`**

```ts
export interface RouteContext {
  basePath: string
  slug: string
  cleanUrls: boolean
}

export function formatDocRoute(ctx: RouteContext): string {
  const prefix = ctx.basePath.endsWith('/') ? ctx.basePath : `${ctx.basePath}/`
  const normalized = ctx.slug.replace(/^\/+|\/+$/g, '')
  if (!normalized || normalized === 'index') return prefix
  return ctx.cleanUrls ? `${prefix}${normalized}/` : `${prefix}${normalized}.html`
}
```

## 2. 关键行聚焦与高亮（`{3,7-9}` 方言的鼻祖）

VuePress v1 内置的 `@vuepress/markdown/lib/highlightLines.js` 率先引入了紧随围栏语言名的 `{3,7-9}` 语法——通过在代码块底层叠加等高 `<div class="highlight-lines">` 遮罩层，零客户端开销高亮第 `3` 行与第 `7–9` 行：

```json{3,7-9}
{
  "id": "ssg-benchmark",
  "routeStyle": "clean",
  "strictZeroCdn": true,
  "markdown": {
    "mathEngine": "katex",
    "diagramEngine": "mermaid",
    "lineHighlight": true,
    "codeTransformers": ["diff", "focus"]
  }
}
```

## 3. 代码增删对比着色（仅支持独立 `diff` 语言块）

由于 Prism.js 不具备 Shiki 的 AST Transformer 注释拦截能力，VuePress v1 **不支持 `// [!code --]` 与 `// [!code ++]`**，只能使用标准 `diff` 语言标识（保留增删符号着色，但牺牲了底层 TypeScript 语法词法高亮）：

```diff
 export function mountSubsite(baseDir: string, subPath: string): string | null {
-  const cleanRel = decodeURIComponent(subPath).replace(/\.\./g, '')
-  return `${baseDir}/${cleanRel}`
+  const resolvedBase = path.resolve(baseDir)
+  const target = path.resolve(resolvedBase, decodeURIComponent(subPath).replace(/^\/+/, ''))
+  return target.startsWith(`${resolvedBase}${path.sep}`) ? target : null
 }
```

## 4. 多语言运行时命令组（无 `::: code-group` 容器）

经典 VuePress v1 并未内置 `::: code-group` 或 `::: code-tabs` Markdown 容器语法（直至 VuePress v2 才由官方 `@vuepress/plugin-markdown-tab` 引入 `::: code-tabs`），因此在纯 Markdown 规范下只能顺序平铺或借助 `::: details` 折叠次要运行时：

- **Node.js (`package.json`)**

```bash
npm ci && npm run build
```

- **Deno 2 (`deno.json`)**

```bash
deno task build
```

- **Python (`requirements.txt`)**

```bash
pip install -r requirements.txt && sphinx-build -b dirhtml . _build/dirhtml
```

- **Ruby (`Gemfile`)**

```bash
bundle install && bundle exec jekyll build
```

## 5. 四大底层高亮引擎能力对照小结

| 高亮引擎代表 | 典型采用框架 | 构建期零运行时 JS | 原生行号 / 行高亮 | 保留词法着色的 Diff |
| :--- | :--- | :--- | :--- | :--- |
| **Shiki / Expressive Code** | VitePress v1/v2、VuePress v2、Starlight、Fumadocs、Nuxt | ✅ 纯静态内联样式 | ✅ `{3,7-9}` / `[!code highlight]` | ✅ `// [!code ++]` |
| **Prism.js** | **VuePress v1**、Docusaurus、Eleventy (plugin) | ✅ 静态 Token 类名 | ✅ `{3,7-9}` 遮罩层 | ⚠️ 仅标准 `diff` 块着色 |
| **Pygments / Rouge** | MkDocs Material、Sphinx、Pelican、Jekyll | ✅ Python/Ruby 编译直出 | ✅ `hl_lines` / `emphasize-lines` | ⚠️ 仅标准 `diff` 块红绿 |
| **Chroma / Giallo / hljs** | Hugo (Go Chroma)、Zola (Rust Giallo)、mdBook (hljs) | ✅ (mdBook 为客户端 hljs) | ✅ Hugo/Zola 原生 `hl_lines` | ⚠️ 仅标准 `diff` 块红绿 |

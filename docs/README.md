---
home: true
heroText: VuePress v1
tagline: "锁定版本 vuepress@1.9.10 · Vue 2 + Webpack 4 经典架构实测"
actionText: "01. 专属标注与元数据 →"
actionLink: /01-annotations.html
features:
  - title: "01. 仅内置三类提示框 (缺 info 与 GFM)"
    details: "开箱仅支持 ::: tip / warning / danger / details，原生不支持 ::: info，亦不识别 GitHub > [!NOTE] 警报。"
  - title: "02. Webpack 4 无法打包现代 Mermaid"
    details: "内置 Webpack 4 遇到现代 ES2022 语法直接崩溃，只能锁定最后一代带 UMD 产物的 mermaid@10.9.8 静态脚本注入。"
  - title: "03. extendMarkdown 扩展 KaTeX"
    details: "社区旧版公式插件多已年久失修，通过在 config.js 的 extendMarkdown 编写 30 行规则直连 katex@0.19.1 构建期渲染。"
  - title: "04. OpenSSL 3 时代包袱与自动组件注册"
    details: "在 Node 18/20/22 下必须传入 NODE_OPTIONS=--openssl-legacy-provider；但拥有独特的 .vuepress/components 自动全局注册约定。"
footer: "独立子模块仓库 page2401/vuepress-v1 · main 存源码 / page 发产物"
---

## 子模块版本档案（对比 `vuepress-v2`）

| 依赖模块 | 精确锁定版本 | 时代特征与工程约束 |
| :--- | :--- | :--- |
| `vuepress` | `1.9.10` | 基于 Vue 2 + Webpack 4，仅支持 CommonJS (`module.exports`)，Node 22 需开启旧版 OpenSSL 提供程序 |
| `katex` | `0.19.1` | 在 `extendMarkdown` 构建阶段调用 `katex.renderToString` 生成静态公式 |
| `mermaid` | `10.9.8` | 锁定最后提供 `dist/mermaid.min.js` UMD 单文件产物的 v10 分支，规避 Webpack 4 Acorn 解析崩溃 |

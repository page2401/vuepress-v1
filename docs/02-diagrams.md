---
title: "02. 流程图与时序图"
description: "实测 VuePress v1 (1.9.10) 规避 Webpack 4 语法崩溃接入 Mermaid 10 UMD 的方案。"
---

# 02. 流程图与时序图（Mermaid） <Badge text="mermaid@10.9.8 UMD" type="warning" vertical="middle" />

::: warning Webpack 4 时代包袱实录
若在 VuePress v1 组件中直接 `import mermaid from 'mermaid'`（v10/v11/v12），内置的 **Webpack 4 + 旧版 Acorn** 会在解析现代 ES2022 私有字段语法时直接编译崩溃！本子站锁定了最后一代提供预编译单文件 UMD 产物的 `mermaid@10.9.8`，在 `prebuild` 阶段将其复制为静态脚本注入并配合 `.vuepress/components/MermaidLegacy.vue` 渲染。
:::

## 1. 复杂子图与架构流程图（`flowchart TD`）

```mermaid
flowchart TD
    subgraph MainRepo["主仓库 page2401.github.io"]
        Spec["相似 *.md 基准规范"]
        SubPtr["Git Submodule 指针 (sites/*)"]
        Workbench["对比工作台源码 (main)"]
    end

    subgraph SubRepo["独立子仓库 (vuepress-v1)"]
        SrcBranch["main 分支: Vue 2 + Webpack 4 源码"]
        Actions{"GitHub Actions (OpenSSL Legacy)"}
        PageBranch["page 孤儿分支: docs/.vuepress/dist"]
        SrcBranch --> Actions
        Actions -->|"构建通过 + .nojekyll"| PageBranch
    end

    SubPtr -.->|"跟踪最新提交"| SrcBranch
    Workbench -->|"构建期提取真实 *.md"| Portal["https://page.2401.xyz/"]
    PageBranch -->|"GitHub Organization Pages"| SubSite["https://page.2401.xyz/vuepress-v1/"]
```

## 2. 编译管线交互时序图（`sequenceDiagram`）

```mermaid
sequenceDiagram
    autonumber
    actor Author as 文档作者
    participant Git as 子模块 main 分支
    participant CI as GitHub Actions (Node 22)
    participant Engine as VuePress 1.9.10 (Webpack 4)
    participant Pages as GitHub Pages (page 分支)

    Author->>Git: 提交 docs/*.md 文档
    Git->>CI: 触发 deploy-page.yml (--openssl-legacy-provider)
    activate CI
    CI->>Engine: 执行 vuepress build docs
    activate Engine
    alt 包含数学公式 ($...$ / $$...$$)
        Engine->>Engine: extendMarkdown 调用 katex.renderToString
    else 包含 Mermaid 代码块
        Engine->>Engine: 转换为 <MermaidLegacy> 挂载 UMD mermaid@10.9.8
    end
    Engine-->>CI: 输出静态产物至 docs/.vuepress/dist
    deactivate Engine
    CI->>Pages: force_orphan 推送产物与 .nojekyll
    deactivate CI
    Pages-->>Author: 子路径 /vuepress-v1/ 即刻生效
```

## 3. 子模块同步状态机（`stateDiagram-v2`）

```mermaid
stateDiagram-v2
    [*] --> CleanSubmodule: git clone --recurse-submodules
    CleanSubmodule --> SubmoduleModified: 编辑子模块 *.md 基准文档
    SubmoduleModified --> SubmodulePushed: 子模块 commit & push origin main
    SubmodulePushed --> PageDeploying: 子仓库 Actions 自动更新 page 分支
    SubmodulePushed --> MainRepoUpdated: 主仓库 git add sites/* 更新指针
    PageDeploying --> LiveSynced: 子站实测渲染已就绪
    MainRepoUpdated --> LiveSynced: 主站源码差异视图已同步
    LiveSynced --> [*]
```

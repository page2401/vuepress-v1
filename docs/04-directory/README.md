---
title: "04. 目录结构与路由取舍"
description: "实测 VuePress v1 经典的 .vuepress/components 自动注册目录与 README.md 路由约定。"
---

# 04. 目录结构与路由取舍 <Badge text="经典目录约定" type="warning" vertical="middle" />

VuePress v1 的目录模型深刻影响了后续一代文档工具，它同时具备极高便利性与历史局限：

## 1. 独树一帜的 `.vuepress/components/` 自动注册目录

在 VuePress v1 中，只要把任意 `.vue` 文件放进 `docs/.vuepress/components/` 目录（例如本项目的 `MermaidLegacy.vue`），框架就会按文件路径自动将其注册为全局异步组件，在所有 `.md` 中免导入直接使用——这一隐式魔法在 VuePress v2 和 VitePress 中因不利于 Tree-shaking 与类型推导已被默认移除。

## 2. 强制 `README.md` 与手写元组侧边栏

- 目录首页必须命名为 `README.md`（在 VuePress v1 中写 `index.md` 会生成 `/index.html` 甚至与 `README.md` 冲突）。
- 侧边栏配置采用独特的二维元组语法 `['/01-annotations', '01. 专属标注与元数据']`（注意拼写甚至还是 `collapsable` 而非 v2 修正后的 `collapsible`！）。

- [进入嵌套子页 A：`nested/01-auto-components.html`](./nested/01-auto-components.html)
- [进入嵌套子页 B：`nested/02-legacy-webpack4.html`](./nested/02-legacy-webpack4.html)

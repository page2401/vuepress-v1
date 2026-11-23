---
title: "01. 专属标注与元数据"
description: "实测经典 VuePress v1 (1.9.10) 默认缺失 ::: info 与 GFM Alert 的真实表现。"
---

# 01. 专属标注与元数据 <Badge text="vuepress@1.9.10" type="tip" vertical="middle" />

与 `vuepress-v2` 并排观察本页，可以直观看到经典 **VuePress v1 (`1.9.10`)** 在标注语法上的历史局限。

## 1. Frontmatter 元数据机制

VuePress v1 首页使用单按钮 `actionText` + `actionLink`（v2 升级为了多按钮数组 `actions`）。内置 `<Badge>` 组件属性名为 `text` + `type="tip|warning|error"`（注意：危险色在 v1 叫 `error` 而非 `danger`：<Badge text="Tip" type="tip" /> <Badge text="Warning" type="warning" /> <Badge text="Error" type="error" />）。

## 2. 标准提示容器（注意观察 `::: info` 的缺失！）

下面第一段保留了与其它子模块完全相同的 `::: info` 原始写法——可以看到 **VuePress v1 默认并不认识 `info` 容器，直接把 `::: info` 当成了普通段落原样输出**：

::: info
默认信息提示块：静态站点对比平台的每个子模块均独立维护 `main`（源码）与 `page`（构建产物）双分支，互不污染提交历史。
:::

而 `tip`、`warning`、`danger` 三种容器则是默认内置的：

::: tip 性能优化建议（自定义标题）
在 VuePress v1 中，`::: tip`、`::: warning`、`::: danger` 开箱可用，自定义标题直接跟在空格后。
:::

::: warning 版本边界注意
若要在 VuePress v1 中支持 `::: info`，必须额外手动配置 `vuepress-plugin-container`。
:::

::: danger 不可逆分支覆盖警告
自动化流水线在向 `page` 分支推送构建产物时会启用 `force_orphan: true`，切勿在 `page` 分支直接手工修改代码！
:::

## 3. 原生可折叠详情容器（Details Block）

VuePress `1.4.0+` 起内置了 `::: details` 折叠容器：

::: details 点击展开查看 VuePress v1 容器语法源码结构
```markdown
::: tip 性能优化建议（自定义标题）
自定义标题直接跟在类型关键字空格后。
:::
```
除了代码块，折叠容器内同样支持列表、表格与数学公式 $f(x) = x^2 + 1$。
:::

## 4. GitHub 风格引用警报（GFM Alerts）兼容性

VuePress v1 发布早于 GitHub 推出 `[!NOTE]` 语法，因此**完全不解析 GFM Alerts**，全部退化为普通引用块：

> [!NOTE]
> 这是一段标准的 GitHub Flavored Markdown `[!NOTE]` 警报文本。在 VuePress v1 下会原样露出 `[!NOTE]` 字符串。

> [!IMPORTANT]
> 跨平台迁移 Markdown 文档时，是否原生兼容 `> [!IMPORTANT]` 与 `> [!WARNING]` 直接决定了旧文档的改造成本。

> [!CAUTION]
> 若目标生成器未内置 GFM Alert 解析器，上方标记会退化为普通引用块并原样露出 `[!CAUTION]` 字符串。

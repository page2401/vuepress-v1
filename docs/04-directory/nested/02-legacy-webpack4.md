---
title: "嵌套实测 B：Node 22 下的 OpenSSL 3 构建包袱"
---

# 嵌套实测 B：Node 22 下的 OpenSSL 3 构建包袱

维护遗留 VuePress v1 站点最大的工程痛点在于底层锁死了 **Webpack 4**：在 Node.js 18 / 20 / 22 环境下，如果不显式注入环境变量 `NODE_OPTIONS=--openssl-legacy-provider`，构建进程会在初始化哈希算法时直接抛出 `ERR_OSSL_EVP_UNSUPPORTED` 异常退出。

- [返回《04. 目录结构与路由取舍》](../)

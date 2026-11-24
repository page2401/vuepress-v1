const katex = require('katex')

const rawBase = process.env.BASE_PATH || '/vuepress-v1/'
const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`

function registerKatexRules(md) {
  // Block math $$ ... $$
  md.block.ruler.before(
    'fence',
    'math_block',
    (state, startLine, endLine, silent) => {
      const startPos = state.bMarks[startLine] + state.tShift[startLine]
      const maxPos = state.eMarks[startLine]
      if (startPos + 2 > maxPos) return false
      if (state.src.slice(startPos, startPos + 2) !== '$$') return false

      let nextLine = startLine
      let content = ''
      const firstLineRest = state.src.slice(startPos + 2, maxPos).trim()
      if (firstLineRest.endsWith('$$') && firstLineRest.length > 2) {
        content = firstLineRest.slice(0, -2)
      } else {
        for (;;) {
          nextLine++
          if (nextLine >= endLine) return false
          const lStart = state.bMarks[nextLine] + state.tShift[nextLine]
          const lMax = state.eMarks[nextLine]
          const lineText = state.src.slice(lStart, lMax)
          if (lineText.trim() === '$$') break
          content += lineText + '\n'
        }
      }
      if (silent) return true
      state.line = nextLine + 1
      const token = state.push('math_block', 'math', 0)
      token.block = true
      token.content = content.trim()
      return true
    },
    { alt: ['paragraph', 'reference', 'blockquote', 'list'] }
  )

  // Inline math $ ... $
  md.inline.ruler.after('escape', 'math_inline', (state, silent) => {
    if (state.src[state.pos] !== '$') return false
    const start = state.pos + 1
    if (start >= state.posMax || state.src[start] === '$') return false
    let match = start
    while ((match = state.src.indexOf('$', match)) !== -1) {
      let esc = match - 1
      while (state.src[esc] === '\\') esc--
      if ((match - esc) % 2 === 1) break
      match++
    }
    if (match === -1 || match === start) return false
    if (!silent) {
      const token = state.push('math_inline', 'math', 0)
      token.content = state.src.slice(start, match)
    }
    state.pos = match + 1
    return true
  })

  md.renderer.rules.math_inline = (tokens, idx) =>
    katex.renderToString(tokens[idx].content, { throwOnError: false, displayMode: false })

  md.renderer.rules.math_block = (tokens, idx) =>
    `<div class="katex-block">${katex.renderToString(tokens[idx].content, {
      throwOnError: false,
      displayMode: true
    })}</div>`
}

module.exports = {
  title: 'VuePress v1 (1.9.10)',
  description: 'SSG 多版本实测基准子站 — 经典 VuePress 1.9.10 (Vue 2 + Webpack 4)',
  base,
  head: [
    ['link', { rel: 'stylesheet', href: 'vendor/katex.min.css' }],
    ['script', { src: 'vendor/mermaid.min.js' }]
  ],
  markdown: {
    lineNumbers: true,
    extendMarkdown: (md) => {
      registerKatexRules(md)
      const defaultFence = md.renderer.rules.fence.bind(md.renderer.rules)
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        if (token.info.trim() === 'mermaid') {
          const b64 = Buffer.from(token.content, 'utf-8').toString('base64')
          return `<MermaidLegacy code="${b64}" />`
        }
        return defaultFence(tokens, idx, options, env, self)
      }
    }
  },
  themeConfig: {
    repo: 'page2401/vuepress-v1',
    nav: [
      { text: '← 返回对比总站', link: 'https://page.2401.xyz/' },
      { text: '01. 标注', link: '/01-annotations.html' },
      { text: '02. 流程图', link: '/02-diagrams.html' },
      { text: '03. 公式', link: '/03-math.html' },
      { text: '04. 目录结构', link: '/04-directory/' },
      { text: '05. 代码高亮', link: '/05-code-blocks.html' }
    ],
    sidebar: [
      {
        title: 'VuePress v1 基准套件',
        collapsable: false,
        children: [
          ['/', '00. 版本与基准概览'],
          ['/01-annotations', '01. 专属标注与元数据'],
          ['/02-diagrams', '02. 流程图与时序图'],
          ['/03-math', '03. 数学公式排版'],
          {
            title: '04. 目录结构与路由取舍',
            collapsable: false,
            children: [
              ['/04-directory/', '经典 components 自动注册与目录约定'],
              ['/04-directory/nested/01-auto-components', 'A. .vuepress/components 自动全局注册'],
              ['/04-directory/nested/02-legacy-webpack4', 'B. Webpack 4 与 OpenSSL 3 时代包袱']
            ]
          },
          ['/05-code-blocks', '05. 高阶代码块与语法高亮']
        ]
      }
    ]
  }
}

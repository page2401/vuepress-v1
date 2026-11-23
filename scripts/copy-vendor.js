const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const vendorDir = path.join(root, 'docs', '.vuepress', 'public', 'vendor')
const fontsDest = path.join(vendorDir, 'fonts')

fs.mkdirSync(fontsDest, { recursive: true })

fs.copyFileSync(
  path.join(root, 'node_modules', 'mermaid', 'dist', 'mermaid.min.js'),
  path.join(vendorDir, 'mermaid.min.js')
)
fs.copyFileSync(
  path.join(root, 'node_modules', 'katex', 'dist', 'katex.min.css'),
  path.join(vendorDir, 'katex.min.css')
)

const fontsSrc = path.join(root, 'node_modules', 'katex', 'dist', 'fonts')
for (const file of fs.readdirSync(fontsSrc)) {
  fs.copyFileSync(path.join(fontsSrc, file), path.join(fontsDest, file))
}

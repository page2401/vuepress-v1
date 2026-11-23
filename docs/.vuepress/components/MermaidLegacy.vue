<template>
  <div class="vp1-mermaid-wrap" v-html="svgHtml"></div>
</template>

<script>
export default {
  name: 'MermaidLegacy',
  props: {
    code: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      svgHtml: ''
    }
  },
  mounted() {
    this.renderGraph()
  },
  methods: {
    decodeB64(b64) {
      const bin = window.atob(b64)
      const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
      return new TextDecoder().decode(bytes)
    },
    async renderGraph() {
      if (typeof window === 'undefined' || !window.mermaid) return
      window.mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose'
      })
      const src = this.decodeB64(this.code)
      const id = 'vp1-mmd-' + Math.random().toString(36).slice(2, 9)
      try {
        const res = await window.mermaid.render(id, src)
        this.svgHtml = typeof res === 'string' ? res : res.svg
      } catch (e) {
        console.error('Mermaid v10 error:', e)
      }
    }
  }
}
</script>

<style scoped>
.vp1-mermaid-wrap {
  margin: 1.2rem 0;
  padding: 1rem;
  border: 1px solid #eaecef;
  border-radius: 6px;
  background: #fafbfc;
  overflow-x: auto;
  text-align: center;
}
</style>

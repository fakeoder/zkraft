/** Tiny DOM helpers — keeps the no-framework page code terse and safe. */

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string> = {},
  ...children: Array<Node | string | null | undefined>
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag)
  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'class') {
      node.className = value
    } else if (key.startsWith('data-') || key.startsWith('aria-')) {
      node.setAttribute(key, value)
    } else {
      ;(node as unknown as Record<string, string>)[key] = value
    }
  }
  for (const child of children) {
    if (child == null) continue
    node.append(child)
  }
  return node
}

/** Parse an inline SVG string (static markup only — never user input). */
export function svg(markup: string): SVGSVGElement {
  const doc = new DOMParser().parseFromString(markup, 'image/svg+xml')
  return doc.documentElement as unknown as SVGSVGElement
}

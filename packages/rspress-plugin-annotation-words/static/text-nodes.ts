/** Collect text nodes under `root`, skipping links and code. */
export function getTextNodes(node: Node): Text[] {
  const textNodes: Text[] = []

  if (node.nodeType === Node.TEXT_NODE) {
    textNodes.push(node as Text)
    return textNodes
  }

  const element = node as Element
  if (element.nodeName === 'A' || element.nodeName === 'CODE') {
    return textNodes
  }

  for (const child of node.childNodes) {
    textNodes.push(...getTextNodes(child))
  }
  return textNodes
}

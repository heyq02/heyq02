/** Stabilize card outerHTML for cross-OS Playwright snapshots. */
export function normalizeDomSnapshot(html: string): string {
  return html
    .replaceAll(/\bclass="([^"]*)"/g, (_match, classes: string) => {
      const sorted = [...new Set(classes.trim().split(/\s+/).filter(Boolean))].toSorted()
      return `class="${sorted.join(' ')}"`
    })
    .replaceAll(/>\d+ stars</g, '>N stars<')
    .replaceAll(/>\d+ forks</g, '>N forks<')
    .replaceAll(/\s*\/>/g, '>')
    .replaceAll(/\s+/g, ' ')
    .replaceAll('> <', '><')
    .trim()
}

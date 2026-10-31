/** Runtime classes injected after paint (Rspress medium-zoom, etc.). */
const ephemeralClasses = new Set(['medium-zoom-image', 'medium-zoom-image--opened'])

/** Stabilize card outerHTML for cross-OS Playwright snapshots. */
export function normalizeDomSnapshot(html: string): string {
  return html
    .replaceAll(/\bclass="([^"]*)"/g, (_match, classes: string) => {
      const sorted = [
        ...new Set(
          classes
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .filter(token => !ephemeralClasses.has(token))
        )
      ].toSorted()
      return `class="${sorted.join(' ')}"`
    })
    .replaceAll(/>\d+ stars</g, '>N stars<')
    .replaceAll(/>\d+ forks</g, '>N forks<')
    .replaceAll(/\s*\/>/g, '>')
    .replaceAll(/\s+/g, ' ')
    .replaceAll('> <', '><')
    .trim()
}

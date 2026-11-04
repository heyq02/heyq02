/** Runtime classes injected after paint (Rspress medium-zoom, etc.). */
const ephemeralClasses = new Set(['medium-zoom-image', 'medium-zoom-image--opened'])

function sortClasses(_match: string, classes: string): string {
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
}

/**
 * Stabilize card outerHTML for cross-OS Playwright snapshots. Volatile text is
 * masked: star/fork counts, and repo blurbs (quoted verbatim from GitHub, so
 * they change whenever a repository description is edited).
 */
export function normalizeDomSnapshot(html: string): string {
  return html
    .replaceAll(/(profile-project-summary\b[^>]*>)[^<]*/g, '$1SUMMARY')
    .replaceAll(/\bclass="([^"]*)"/g, sortClasses)
    .replaceAll(/>\d+ 星标</g, '>N 星标<')
    .replaceAll(/>\d+ 派生</g, '>N 派生<')
    .replaceAll(/\s*\/>/g, '>')
    .replaceAll(/\s+/g, ' ')
    .replaceAll('> <', '><')
    .trim()
}

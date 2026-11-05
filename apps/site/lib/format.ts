/** `2026-06-22` → `2026年6月22日`. */
export function formatZhDate(iso: string): string {
  const match = /^(?<y>\d{4})-(?<m>\d{2})-(?<d>\d{2})$/.exec(iso)
  if (!match?.groups) {
    return iso
  }
  return `${match.groups.y}年${Number(match.groups.m)}月${Number(match.groups.d)}日`
}

/** Skill with a [simple-icons](https://simpleicons.org) slug already chosen upstream. */
export interface SkillIcon {
  name: string
  icon: string
}

/** Same simpleicons.dev picture the README and the site skills section use. */
export function skillIconsPicture(skills: readonly SkillIcon[]) {
  const named = skills.filter(skill => skill.icon)
  const icons = named.map(skill => skill.icon).join(',')
  const alt = named.map(skill => skill.name).join(', ')
  const perline = Math.max(named.length, 1)
  return {
    alt,
    src: `https://simpleicons.dev/icons?icons=${icons}&perline=${perline}&theme=light`
  }
}

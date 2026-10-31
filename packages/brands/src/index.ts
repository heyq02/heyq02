/** Display name → [simple-icons](https://simpleicons.org) slug for site icons and readme badges. */
export const brandSlugs: Record<string, string> = {
  JavaScript: 'javascript',
  TypeScript: 'typescript',
  'Node.js': 'nodedotjs',
  HTML: 'html5',
  CSS: 'css',
  Rust: 'rust',
  Vue: 'vuedotjs',
  React: 'react',
  Next: 'nextdotjs',
  Expo: 'expo',
  Webpack: 'webpack',
  Rolldown: 'rolldown',
  Vite: 'vite',
  Vitest: 'vitest',
  Oxc: 'oxc',
  'Spring Boot': 'springboot',
  Spring: 'spring',
  MySQL: 'mysql',
  Redis: 'redis',
  RabbitMQ: 'rabbitmq',
  Maven: 'apachemaven',
  Gradle: 'gradle',
  'GitHub Actions': 'githubactions',
  'GitHub Copilot': 'githubcopilot',
  'GitHub Pages': 'githubpages',
  GitHub: 'github',
  Git: 'git',
  Figma: 'figma',
  Linux: 'linux',
  Docker: 'docker',
  Vim: 'vim',
  Nginx: 'nginx',
  macOS: 'macos',
  Cursor: 'cursor',
  DeepSeek: 'deepseek',
  Claude: 'claude',
  Bluesky: 'bluesky',
  Twitter: 'x',
  Xiaohongshu: 'xiaohongshu',
  WeChat: 'wechat',
  Bilibili: 'bilibili',
  CSDN: 'csdn',
  Juejin: 'juejin'
}

/** Names that should still match labels but have no simple-icons slug. */
export const brandNamesWithoutSlug = ['Taro', 'Rspack'] as const

const brandNames = [...Object.keys(brandSlugs), ...brandNamesWithoutSlug]

export function matchBrandName(label: string): string | undefined {
  return brandNames.find(
    name => label === name || label.startsWith(`${name}（`) || label.startsWith(`${name} `)
  )
}

export function brandSlug(name: string): string | undefined {
  return brandSlugs[name]
}

export function brandSlugForLabel(label: string): string | undefined {
  const name = matchBrandName(label)
  return name === undefined ? undefined : brandSlug(name)
}

/** Same simpleicons.dev picture the README and the site skills section use. */
export function skillIconsPicture(names: readonly string[]) {
  const named = names.flatMap(name => {
    const slug = brandSlug(name)
    return slug ? [{ name, slug }] : []
  })
  const icons = named.map(skill => skill.slug).join(',')
  const alt = named.map(skill => skill.name).join(', ')
  const perline = Math.max(named.length, 1)
  return {
    alt,
    src: `https://simpleicons.dev/icons?icons=${icons}&perline=${perline}&theme=light`
  }
}

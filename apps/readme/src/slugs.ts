/** Display name → [simple-icons](https://simpleicons.org) slug for simpleicons.dev. */
const skillSlugs: Record<string, string> = {
  Vue: 'vuedotjs',
  React: 'react',
  Next: 'nextdotjs',
  Rolldown: 'rolldown',
  Vite: 'vite',
  Oxc: 'oxc',
  Spring: 'spring',
  Redis: 'redis',
  RabbitMQ: 'rabbitmq',
  Nginx: 'nginx',
  Docker: 'docker',
  JavaScript: 'javascript',
  TypeScript: 'typescript',
  'Node.js': 'nodedotjs',
  HTML: 'html5',
  CSS: 'css',
  Rust: 'rust',
  Expo: 'expo',
  Webpack: 'webpack',
  Vitest: 'vitest',
  'Spring Boot': 'springboot',
  MySQL: 'mysql',
  Maven: 'apachemaven',
  Gradle: 'gradle',
  'GitHub Actions': 'githubactions',
  Git: 'git',
  Figma: 'figma',
  Linux: 'linux',
  Vim: 'vim',
  macOS: 'macos',
  Cursor: 'cursor'
}

export function skillSlug(name: string): string | undefined {
  return skillSlugs[name]
}

import type { SimpleIcon } from 'simple-icons'
import {
  siApachemaven,
  siBilibili,
  siBluesky,
  siClaude,
  siCss,
  siCursor,
  siDeepseek,
  siDocker,
  siExpo,
  siFigma,
  siGit,
  siGithub,
  siGithubactions,
  siGithubcopilot,
  siGithubpages,
  siGradle,
  siHtml5,
  siJavascript,
  siJuejin,
  siLinux,
  siMacos,
  siMysql,
  siNextdotjs,
  siNginx,
  siNodedotjs,
  siOxc,
  siRabbitmq,
  siReact,
  siRedis,
  siRolldown,
  siRust,
  siSpring,
  siSpringboot,
  siTypescript,
  siVim,
  siVite,
  siVitest,
  siVuedotjs,
  siWebpack,
  siWechat
} from 'simple-icons'

const brands: { name: string; href: string; icon?: SimpleIcon }[] = [
  {
    name: 'JavaScript',
    href: 'https://developer.mozilla.org/docs/Web/JavaScript',
    icon: siJavascript
  },
  {
    name: 'TypeScript',
    href: 'https://www.typescriptlang.org/',
    icon: siTypescript
  },
  { name: 'Node.js', href: 'https://nodejs.org/', icon: siNodedotjs },
  {
    name: 'HTML',
    href: 'https://developer.mozilla.org/docs/Web/HTML',
    icon: siHtml5
  },
  {
    name: 'CSS',
    href: 'https://developer.mozilla.org/docs/Web/CSS',
    icon: siCss
  },
  { name: 'Rust', href: 'https://www.rust-lang.org/', icon: siRust },
  { name: 'Vue', href: 'https://vuejs.org/', icon: siVuedotjs },
  { name: 'React', href: 'https://react.dev/', icon: siReact },
  { name: 'Next', href: 'https://nextjs.org/', icon: siNextdotjs },
  { name: 'Expo', href: 'https://expo.dev/', icon: siExpo },
  { name: 'Taro', href: 'https://docs.taro.zone/' },
  { name: 'Webpack', href: 'https://webpack.js.org/', icon: siWebpack },
  { name: 'Rolldown', href: 'https://rolldown.rs/', icon: siRolldown },
  { name: 'Vite', href: 'https://vite.dev/', icon: siVite },
  { name: 'Vitest', href: 'https://vitest.dev/', icon: siVitest },
  { name: 'Oxc', href: 'https://oxc.rs/', icon: siOxc },
  {
    name: 'Spring Boot',
    href: 'https://spring.io/projects/spring-boot',
    icon: siSpringboot
  },
  { name: 'Spring', href: 'https://spring.io/', icon: siSpring },
  { name: 'MySQL', href: 'https://www.mysql.com/', icon: siMysql },
  { name: 'Redis', href: 'https://redis.io/', icon: siRedis },
  { name: 'RabbitMQ', href: 'https://www.rabbitmq.com/', icon: siRabbitmq },
  { name: 'Maven', href: 'https://maven.apache.org/', icon: siApachemaven },
  { name: 'Gradle', href: 'https://gradle.org/', icon: siGradle },
  {
    name: 'GitHub Actions',
    href: 'https://github.com/features/actions',
    icon: siGithubactions
  },
  {
    name: 'GitHub Copilot',
    href: 'https://github.com/features/copilot',
    icon: siGithubcopilot
  },
  {
    name: 'GitHub Pages',
    href: 'https://pages.github.com/',
    icon: siGithubpages
  },
  { name: 'Rspack', href: 'https://rspack.rs/' },
  { name: 'GitHub', href: 'https://github.com/', icon: siGithub },
  { name: 'Git', href: 'https://git-scm.com/', icon: siGit },
  { name: 'Figma', href: 'https://www.figma.com/', icon: siFigma },
  { name: 'Linux', href: 'https://www.kernel.org/', icon: siLinux },
  { name: 'Docker', href: 'https://www.docker.com/', icon: siDocker },
  { name: 'Vim', href: 'https://www.vim.org/', icon: siVim },
  { name: 'Nginx', href: 'https://nginx.org/', icon: siNginx },
  { name: 'macOS', href: 'https://www.apple.com/macos/', icon: siMacos },
  { name: 'Cursor', href: 'https://cursor.com/', icon: siCursor },
  { name: 'DeepSeek', href: 'https://www.deepseek.com/', icon: siDeepseek },
  { name: 'Claude', href: 'https://claude.ai/', icon: siClaude },
  { name: 'Bluesky', href: 'https://bsky.app/', icon: siBluesky },
  { name: 'WeChat', href: 'https://weixin.qq.com/', icon: siWechat },
  { name: 'Bilibili', href: 'https://www.bilibili.com/', icon: siBilibili },
  { name: 'Juejin', href: 'https://juejin.cn/', icon: siJuejin }
]

function matchBrand(label: string) {
  return brands.find(
    ({ name }) => label === name || label.startsWith(`${name}（`) || label.startsWith(`${name} `)
  )
}

export function brandIcon(label: string) {
  return matchBrand(label)?.icon
}

export function brandOf(label: string) {
  return matchBrand(label)
}

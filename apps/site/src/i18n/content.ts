import type { Experience, Intro, Place, Project, Skill } from '@heyq02/profile'
import {
  absoluteHref,
  avatar,
  bio,
  city,
  contact,
  degree,
  description,
  experiences as enExperiences,
  kaomoji,
  kicker,
  name,
  names,
  places as enPlaces,
  projects as enProjects,
  sections as enSections,
  site,
  skills as enSkills,
  title
} from '@heyq02/profile'

import type { Locale } from './locale.ts'

export interface SiteContent {
  name: string
  names: string[]
  degree: string
  city: string
  bio: string
  kaomoji: string
  avatar: string
  site: string
  kicker: string
  title: string
  description: string
  contact: Intro['contact']
  sections: Intro['sections']
  places: Place[]
  experiences: Experience[]
  skills: Skill[]
  projects: Project[]
  ui: {
    skipToContent: string
    language: string
    english: string
    chinese: string
  }
}

const enUi = {
  skipToContent: 'Skip to content',
  language: 'Language',
  english: 'EN',
  chinese: '中文'
} as const

const zhUi = {
  skipToContent: '跳到正文',
  language: '语言',
  english: 'EN',
  chinese: '中文'
} as const

const zhSections = {
  experience: '经历',
  skills: '技能',
  openSource: '开源'
} as const

const zhPlaces: Place[] = [
  { label: 'GitHub', href: absoluteHref('https://github.com/heyq02'), detail: 'heyq02' },
  {
    label: 'Bluesky',
    href: absoluteHref('https://bsky.app/profile/heyq02.com'),
    detail: 'heyq02.com'
  },
  {
    label: 'Bilibili',
    href: absoluteHref('https://space.bilibili.com/3493273159075938'),
    detail: '全栈糕手Ari'
  },
  {
    label: 'Juejin',
    href: absoluteHref('https://juejin.cn/user/708557910842296'),
    detail: '编程糕手Ari'
  },
  { label: 'WeChat', href: absoluteHref('/wechat.jpg'), detail: '扫码添加' }
]

const zhExperiences: Experience[] = [
  {
    company: '京东集团',
    href: 'https://www.jd.com/',
    start: '2024.06',
    end: '至今',
    points: [
      '负责京东外卖小程序、H5 与管理后台的迭代交付',
      '推动管理后台脱离旧架构升级，并提升 TP95',
      '搭建本地生活产研 C3 级 AI Infra，提升研发效率'
    ]
  }
]

const zhSkills: Skill[] = [
  {
    name: 'Vue',
    href: 'https://vuejs.org/',
    summary: '渐进式 JavaScript 框架，用于构建 Web 界面'
  },
  {
    name: 'React',
    href: 'https://react.dev/',
    summary: '用于构建 Web 与原生用户界面的库'
  },
  {
    name: 'Next',
    href: 'https://nextjs.org/',
    summary: '面向 Web 的 React 框架'
  },
  {
    name: 'Rolldown',
    href: 'https://rolldown.rs/',
    summary: '兼容 Rollup API 的 Rust 版 JavaScript 打包器'
  },
  {
    name: 'Vite',
    href: 'https://vite.dev/',
    summary: '面向 Web 的前端构建工具'
  },
  {
    name: 'Oxc',
    href: 'https://oxc.rs/',
    summary: '用 Rust 编写的高性能 JavaScript 工具集'
  },
  {
    name: 'Spring',
    href: 'https://spring.io/',
    summary: '用于构建 Java 企业应用的框架'
  },
  {
    name: 'Redis',
    href: 'https://redis.io/',
    summary: '内存数据库，可用于缓存与消息'
  },
  {
    name: 'RabbitMQ',
    href: 'https://www.rabbitmq.com/',
    summary: '开源消息与流式代理'
  },
  {
    name: 'Nginx',
    href: 'https://nginx.org/',
    summary: 'HTTP 服务器、反向代理与负载均衡器'
  },
  {
    name: 'Docker',
    href: 'https://www.docker.com/',
    summary: '构建、交付与运行应用的开放平台'
  }
]

const zhProjects: Project[] = [
  {
    name: 'jd-opensource/taro-ui',
    href: 'https://github.com/jd-opensource/taro-ui',
    summary: '一款基于 Taro 框架开发的多端 UI 组件库',
    language: 'TypeScript',
    languageColor: '#3178c6',
    stars: 4730,
    forks: 743
  },
  {
    name: 'simpleicons.dev',
    href: 'https://github.com/heyq02/simpleicons.dev',
    summary: '轻松在 GitHub README 或简历中展示你的技能图标。',
    language: 'TypeScript',
    languageColor: '#3178c6',
    stars: 171,
    forks: 0
  }
]

const enContent: SiteContent = {
  name,
  names: [...names],
  degree,
  city,
  bio,
  kaomoji,
  avatar,
  site,
  kicker,
  title,
  description,
  contact,
  sections: { ...enSections },
  places: enPlaces,
  experiences: enExperiences,
  skills: enSkills,
  projects: enProjects,
  ui: { ...enUi }
}

const zhContent: SiteContent = {
  name,
  names: [name, '开发者'],
  degree: '学士',
  city: '中国',
  bio: '全栈工程师 / 开源爱好者 / 职业向视频创作者。专注于能加速研发并落地到真实产品中的 AI',
  kaomoji,
  avatar,
  site,
  kicker: '简介',
  title: name,
  description:
    'Ari He。全栈工程师、开源爱好者、职业向视频创作者。专注于能加速研发并落地到真实产品中的 AI。',
  contact,
  sections: { ...zhSections },
  places: zhPlaces,
  experiences: zhExperiences,
  skills: zhSkills,
  projects: zhProjects,
  ui: { ...zhUi }
}

const byLocale: Record<Locale, SiteContent> = {
  en: enContent,
  zh: zhContent
}

export function contentFor(locale: Locale): SiteContent {
  return byLocale[locale]
}

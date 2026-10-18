/** 与 https://github.com/heyq02/intro.heyq02.com 的 `src/site.ts` 同一份介绍。 */

export interface Project {
  name: string;
  href: string;
  summary: string;
  language: string;
  stars: number;
  forks: number;
}

export interface Skill {
  name: string;
  href: string;
  summary: string;
}

export interface Experience {
  company: string;
  href: string;
  start: string;
  end: string;
  points: string[];
}

export interface Place {
  label: string;
  href: string;
  detail: string;
}

export const site = 'https://intro.heyq02.com';

export const profile = {
  name: '永琪（Ari）',
  givenNames: ['永琪', 'Ari'] as const,
  role: '，全栈研发',
  bio: '南京邮电大学生物医学工程本科毕业。专注前端工程化，推动 AI 在业务场景中落地。',
  quote: 'everything always works out at the end',
  phone: '+86 135****8086',
  email: 'hello@heyq02.com',
  site,
  places: [
    {
      label: 'GitHub',
      href: 'https://github.com/heyq02',
      detail: 'heyq02',
    },
    {
      label: 'X',
      href: 'https://x.com/heyq02',
      detail: '@heyq02',
    },
    {
      label: 'Bilibili',
      href: 'https://space.bilibili.com/3493273159075938',
      detail: '全栈糕手Ari',
    },
    {
      label: '掘金',
      href: 'https://juejin.cn/user/708557910842296',
      detail: '编程糕手Ari',
    },
    {
      label: '微信',
      href: `${site}/wechat.jpg`,
      detail: '扫码添加',
    },
  ] satisfies Place[],
  experiences: [
    {
      company: '北京京东世纪贸易有限公司',
      href: 'https://www.jd.com/',
      start: '2024.06',
      end: '至今',
      points: [
        '负责京东外卖跨端小程序&H5、管理后台需求迭代',
        '进行管理后台老旧架构升级，TP95性能优化',
        '本地生活产研C3层面 AI Infra 建设，提升研发效能',
      ],
    },
  ] satisfies Experience[],
  skills: [
    {
      name: 'Vue',
      href: 'https://vuejs.org/',
      summary: '渐进式 JavaScript 框架，用来构建 Web 界面',
    },
    {
      name: 'React',
      href: 'https://react.dev/',
      summary: '构建 Web 和原生用户界面的库',
    },
    {
      name: 'Next',
      href: 'https://nextjs.org/',
      summary: '面向 Web 的 React 框架',
    },
    {
      name: 'Rolldown',
      href: 'https://rolldown.rs/',
      summary: '基于 Rust 的 JavaScript 打包器，API 兼容 Rollup',
    },
    {
      name: 'Vite',
      href: 'https://vite.dev/',
      summary: '用来构建 Web 应用的前端构建工具',
    },
    {
      name: 'Oxc',
      href: 'https://oxc.rs/',
      summary: '用 Rust 编写的高性能 JavaScript 工具集',
    },
    {
      name: 'Spring',
      href: 'https://spring.io/',
      summary: '用来创建 Java 企业级应用',
    },
    {
      name: 'Redis',
      href: 'https://redis.io/',
      summary: '内存数据存储，可用作数据库、缓存和消息代理',
    },
    {
      name: 'RabbitMQ',
      href: 'https://www.rabbitmq.com/',
      summary: '开源的消息与流代理',
    },
    {
      name: 'Nginx',
      href: 'https://nginx.org/',
      summary: 'HTTP 服务器、反向代理和负载均衡',
    },
    {
      name: 'Docker',
      href: 'https://www.docker.com/',
      summary: '开发、交付和运行应用的开放平台',
    },
  ] satisfies Skill[],
  projects: [
    {
      name: 'jd-opensource/taro-ui',
      href: 'https://github.com/jd-opensource/taro-ui',
      summary: '一款基于 Taro 框架开发的多端 UI 组件库',
      language: 'TypeScript',
      stars: 4730,
      forks: 743,
    },
    {
      name: 'simpleicons.dev',
      href: 'https://github.com/heyq02/simpleicons.dev',
      summary:
        'Showcase your skills on your GitHub readme or resumé with ease.',
      language: 'TypeScript',
      stars: 171,
      forks: 0,
    },
  ] satisfies Project[],
};

export function formatCount(count: number): string {
  if (count < 1000) {
    return String(count);
  }

  return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`;
}

export function fullName(): string {
  return `${profile.name}${profile.role}`;
}

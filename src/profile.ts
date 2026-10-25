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

export const site = "https://intro.heyq02.com";

export const profile = {
  name: "Ari He",
  givenNames: ["Ari He", "Developer"] as const,
  role: "",
  bio: "Full-stack engineer / open-source enthusiast / vlogger on career. Focused on AI that speeds up development and ships in real products (๑•̀ㅂ•́)و",
  phone: "+86 135****8086",
  email: "hello@heyq02.com",
  site,
  places: [
    {
      label: "GitHub",
      href: "https://github.com/heyq02",
      detail: "heyq02",
    },
    {
      label: "X",
      href: "https://x.com/heyq02",
      detail: "@heyq02",
    },
    {
      label: "Bilibili",
      href: "https://space.bilibili.com/3493273159075938",
      detail: "全栈糕手Ari",
    },
    {
      label: "Juejin",
      href: "https://juejin.cn/user/708557910842296",
      detail: "编程糕手Ari",
    },
    {
      label: "WeChat",
      href: `${site}/wechat.jpg`,
      detail: "Scan to add",
    },
  ] satisfies Place[],
  experiences: [
    {
      company: "JD.com, Inc.",
      href: "https://www.jd.com/",
      start: "2024.06",
      end: "Present",
      points: [
        "Owned iterations for JD Takeout across the mini program, H5, and admin console",
        "Upgraded the admin console off its legacy architecture and improved TP95",
        "Built C3-level AI Infra for Local Life product and engineering, improving R&D efficiency",
      ],
    },
  ] satisfies Experience[],
  skills: [
    {
      name: "Vue",
      href: "https://vuejs.org/",
      summary: "Progressive JavaScript framework for building web UIs",
    },
    {
      name: "React",
      href: "https://react.dev/",
      summary: "The library for web and native user interfaces",
    },
    {
      name: "Next",
      href: "https://nextjs.org/",
      summary: "The React framework for the web",
    },
    {
      name: "Rolldown",
      href: "https://rolldown.rs/",
      summary: "Rust-based JavaScript bundler with a Rollup-compatible API",
    },
    {
      name: "Vite",
      href: "https://vite.dev/",
      summary: "Frontend build tool for the web",
    },
    {
      name: "Oxc",
      href: "https://oxc.rs/",
      summary: "High-performance JavaScript tools written in Rust",
    },
    {
      name: "Spring",
      href: "https://spring.io/",
      summary: "Framework for creating Java enterprise applications",
    },
    {
      name: "Redis",
      href: "https://redis.io/",
      summary: "In-memory store for databases, cache, and messaging",
    },
    {
      name: "RabbitMQ",
      href: "https://www.rabbitmq.com/",
      summary: "Open-source messaging and streaming broker",
    },
    {
      name: "Nginx",
      href: "https://nginx.org/",
      summary: "HTTP server, reverse proxy, and load balancer",
    },
    {
      name: "Docker",
      href: "https://www.docker.com/",
      summary: "Open platform for building, shipping, and running apps",
    },
  ] satisfies Skill[],
  projects: [
    {
      name: "jd-opensource/taro-ui",
      href: "https://github.com/jd-opensource/taro-ui",
      summary: "一款基于 Taro 框架开发的多端 UI 组件库",
      language: "TypeScript",
      stars: 4730,
      forks: 743,
    },
    {
      name: "simpleicons.dev",
      href: "https://github.com/heyq02/simpleicons.dev",
      summary: "Showcase your skills on your GitHub readme or resumé with ease.",
      language: "TypeScript",
      stars: 171,
      forks: 0,
    },
  ] satisfies Project[],
};

export function formatCount(count: number): string {
  if (count < 1000) {
    return String(count);
  }

  return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`;
}

export function fullName(): string {
  return `${profile.name}${profile.role}`;
}

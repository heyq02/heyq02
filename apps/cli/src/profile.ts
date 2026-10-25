import intro from '../../../static/data/intro.json' with { type: 'json' }

export interface Project {
  name: string
  href: string
  summary: string
  language: string
  stars: number
  forks: number
}

export interface Skill {
  name: string
  href: string
  summary: string
}

export interface Experience {
  company: string
  href: string
  start: string
  end: string
  points: string[]
}

export interface Place {
  label: string
  href: string
  detail: string
}

const skillHrefs: Record<string, string> = {
  Vue: 'https://vuejs.org/',
  React: 'https://react.dev/',
  Next: 'https://nextjs.org/',
  Rolldown: 'https://rolldown.rs/',
  Vite: 'https://vite.dev/',
  Oxc: 'https://oxc.rs/',
  Spring: 'https://spring.io/',
  Redis: 'https://redis.io/',
  RabbitMQ: 'https://www.rabbitmq.com/',
  Nginx: 'https://nginx.org/',
  Docker: 'https://www.docker.com/'
}

export const site = 'https://heyq02.dev'

export const profile = {
  name: intro.name,
  givenNames: intro.names as unknown as readonly [string, ...string[]],
  role: '',
  bio: `${intro.bio} ${intro.kaomoji}`,
  phone: '+86 135****8086',
  email: 'hello@heyq02.com',
  site,
  places: intro.places.map(place => ({
    ...place,
    href: place.href.startsWith('/') ? `${site}${place.href}` : place.href
  })) satisfies Place[],
  experiences: intro.experiences satisfies Experience[],
  skills: intro.skills.map(skill => ({
    name: skill.name,
    href: skillHrefs[skill.name] ?? site,
    summary: skill.summary
  })) satisfies Skill[],
  projects: intro.projects.map(
    ({ languageColor: _languageColor, ...project }) => project
  ) satisfies Project[]
}

export function formatCount(count: number): string {
  if (count < 1000) {
    return String(count)
  }

  return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`
}

export function fullName(): string {
  return `${profile.name}${profile.role}`
}

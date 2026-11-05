import type { FriendsData } from './friends.ts'
import type { GithubProfileData } from './github-profile.ts'
import type { Intro } from './intro.ts'
import type { RecentPost } from './recent-posts.ts'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function expectString(value: unknown, path: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new TypeError(`${path} must be a non-empty string`)
  }
  return value
}

function expectNumber(value: unknown, path: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(`${path} must be a finite number`)
  }
  return value
}

function expectArray(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new TypeError(`${path} must be an array`)
  }
  return value
}

/** Runtime check for `content/data/intro.json`. */
export function assertIntro(value: unknown): Intro {
  if (!isRecord(value)) {
    throw new TypeError('intro must be an object')
  }

  const home = value.home
  if (!isRecord(home)) {
    throw new TypeError('intro.home must be an object')
  }
  expectString(home.label, 'intro.home.label')
  expectNumber(home.latitude, 'intro.home.latitude')
  expectNumber(home.longitude, 'intro.home.longitude')

  const contact = value.contact
  if (!isRecord(contact)) {
    throw new TypeError('intro.contact must be an object')
  }
  expectString(contact.email, 'intro.contact.email')

  const sections = value.sections
  if (!isRecord(sections)) {
    throw new TypeError('intro.sections must be an object')
  }
  expectString(sections.blog, 'intro.sections.blog')
  expectString(sections.openSource, 'intro.sections.openSource')

  for (const key of [
    'name',
    'headline',
    'badge',
    'zodiac',
    'bio',
    'about',
    'kaomoji',
    'avatar',
    'site',
    'title'
  ] as const) {
    expectString(value[key], `intro.${key}`)
  }

  for (const [index, tag] of expectArray(value.tags, 'intro.tags').entries()) {
    expectString(tag, `intro.tags[${index}]`)
  }
  for (const [index, mood] of expectArray(value.moods, 'intro.moods').entries()) {
    expectString(mood, `intro.moods[${index}]`)
  }

  for (const [index, place] of expectArray(value.places, 'intro.places').entries()) {
    if (!isRecord(place)) {
      throw new TypeError(`intro.places[${index}] must be an object`)
    }
    expectString(place.label, `intro.places[${index}].label`)
    expectString(place.href, `intro.places[${index}].href`)
    expectString(place.detail, `intro.places[${index}].detail`)
  }

  return value as unknown as Intro
}

/** Runtime check for `content/data/friends.json`. */
export function assertFriendsData(value: unknown): FriendsData {
  if (!isRecord(value)) {
    throw new TypeError('friends must be an object')
  }
  expectString(value.title, 'friends.title')
  if (value.apply !== undefined) {
    if (!isRecord(value.apply)) {
      throw new TypeError('friends.apply must be an object')
    }
    expectString(value.apply.title, 'friends.apply.title')
    expectString(value.apply.intro, 'friends.apply.intro')
  }
  for (const [index, friend] of expectArray(value.friends, 'friends.friends').entries()) {
    if (!isRecord(friend)) {
      throw new TypeError(`friends.friends[${index}] must be an object`)
    }
    expectString(friend.name, `friends.friends[${index}].name`)
    expectString(friend.url, `friends.friends[${index}].url`)
    expectString(friend.avatar, `friends.friends[${index}].avatar`)
    if (friend.desc !== undefined) {
      expectString(friend.desc, `friends.friends[${index}].desc`)
    }
  }
  return value as unknown as FriendsData
}

/** Runtime check for `content/data/github-profile.json`. */
export function assertGithubProfileData(value: unknown): GithubProfileData {
  if (!isRecord(value)) {
    throw new TypeError('github-profile must be an object')
  }

  for (const [index, project] of expectArray(value.projects, 'github-profile.projects').entries()) {
    if (!isRecord(project)) {
      throw new TypeError(`github-profile.projects[${index}] must be an object`)
    }
    expectString(project.name, `github-profile.projects[${index}].name`)
    expectString(project.href, `github-profile.projects[${index}].href`)
    expectString(project.summary, `github-profile.projects[${index}].summary`)
    expectString(project.language, `github-profile.projects[${index}].language`)
    expectNumber(project.stars, `github-profile.projects[${index}].stars`)
    expectNumber(project.forks, `github-profile.projects[${index}].forks`)
  }

  const contributions = value.contributions
  if (!isRecord(contributions)) {
    throw new TypeError('github-profile.contributions must be an object')
  }
  expectNumber(contributions.total, 'github-profile.contributions.total')
  expectString(contributions.href, 'github-profile.contributions.href')

  for (const [weekIndex, week] of expectArray(
    contributions.weeks,
    'github-profile.contributions.weeks'
  ).entries()) {
    for (const [dayIndex, day] of expectArray(
      week,
      `github-profile.contributions.weeks[${weekIndex}]`
    ).entries()) {
      if (!isRecord(day)) {
        throw new TypeError(
          `github-profile.contributions.weeks[${weekIndex}][${dayIndex}] must be an object`
        )
      }
      expectString(day.date, `github-profile.contributions.weeks[${weekIndex}][${dayIndex}].date`)
      expectNumber(day.count, `github-profile.contributions.weeks[${weekIndex}][${dayIndex}].count`)
      const level = expectNumber(
        day.level,
        `github-profile.contributions.weeks[${weekIndex}][${dayIndex}].level`
      )
      if (level < 0 || level > 4 || !Number.isInteger(level)) {
        throw new TypeError(
          `github-profile.contributions.weeks[${weekIndex}][${dayIndex}].level must be an integer 0–4`
        )
      }
    }
  }

  return value as unknown as GithubProfileData
}

/** Runtime check for `content/data/recent-posts.json`. */
export function assertRecentPosts(value: unknown): RecentPost[] {
  const posts: RecentPost[] = []
  for (const [index, post] of expectArray(value, 'recent-posts').entries()) {
    if (!isRecord(post)) {
      throw new TypeError(`recent-posts[${index}] must be an object`)
    }
    expectString(post.slug, `recent-posts[${index}].slug`)
    expectString(post.href, `recent-posts[${index}].href`)
    expectString(post.title, `recent-posts[${index}].title`)
    expectString(post.description, `recent-posts[${index}].description`)
    expectString(post.date, `recent-posts[${index}].date`)
    posts.push(post as unknown as RecentPost)
  }
  return posts
}

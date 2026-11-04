import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { getCollection } from 'astro:content'

import { intro } from '../../lib/intro.ts'

export async function GET(context: APIContext) {
  const posts = (await getCollection('posts')).toSorted(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  )

  return rss({
    title: `${intro.name} · 博客`,
    description: intro.description,
    site: context.site ?? intro.site,
    items: posts.map(post => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/posts/${post.id}/`
    })),
    customData: `<language>zh-CN</language>`
  })
}

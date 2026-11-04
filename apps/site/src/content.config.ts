import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const postSchema = z.object({
  title: z.string(),
  description: z.string().default(''),
  date: z.coerce.date()
})

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: postSchema
})

const interview = defineCollection({
  loader: glob({ base: './src/content/interview', pattern: '**/*.{md,mdx}' }),
  schema: postSchema
})

export const collections = { posts, interview }

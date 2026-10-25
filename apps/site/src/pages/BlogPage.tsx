import { Reveal } from '../components/Reveal.tsx'
import { SectionHeading } from '../components/SectionHeading.tsx'
import { Page } from '../layout.tsx'
import { pages, posts } from '../site.ts'

export function BlogPage() {
  return (
    <Page page='blog'>
      <Reveal>
        <section aria-labelledby='blog-heading'>
          <SectionHeading id='blog-heading' title={pages.blog.heading} />
          {posts.length === 0 ? (
            <p className='text-muted text-base leading-7'>{pages.blog.empty}</p>
          ) : (
            <div>
              {posts.map(post => (
                <article className='py-3 first:pt-0 last:pb-0' key={post.slug}>
                  <div className='flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between'>
                    <h3 className='min-w-0 text-lg leading-6 font-medium break-words'>
                      {post.title}
                    </h3>
                    <p className='text-muted text-sm tabular-nums'>{post.date}</p>
                  </div>
                  <p className='text-muted mt-3 text-sm leading-6'>{post.summary}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </Reveal>
    </Page>
  )
}

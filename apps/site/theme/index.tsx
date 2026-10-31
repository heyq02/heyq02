import { HomeBackground, HomeFeature, HomeFooter, HomeHero } from '@rspress/core/theme-original'

import { profilePage } from '../src/profile-page.ts'

function Experience() {
  const page = profilePage()

  return (
    <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px 48px' }}>
      <h2>{page.sections.experience}</h2>
      {page.experiences.map(job => (
        <section key={`${job.company}-${job.start}`}>
          <h3>
            <a href={job.href} rel='noreferrer' target='_blank'>
              {job.company}
            </a>
          </h3>
          <p>
            {job.start} – {job.end}
          </p>
          <ul>
            {job.points.map(point => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>
      ))}
      <h2>{page.sections.skills}</h2>
      <img alt={page.skills.alt} src={page.skills.src} width='100%' />
    </div>
  )
}

export function HomeLayout() {
  return (
    <>
      <HomeBackground />
      <HomeHero />
      <Experience />
      <HomeFeature />
      <HomeFooter />
    </>
  )
}

// Rspress uses this file as the theme entry and imports the rest of the theme from it.
// oxlint-disable-next-line import/export
export * from '@rspress/core/theme-original'

import { profilePage } from '../src/profile-page.ts'

export function ProfileHome() {
  const page = profilePage()

  return (
    <article>
      <header>
        <img alt='' height={96} src={page.avatar} width={96} />
        <h1>{page.name}</h1>
        <p>
          {page.degree} · {page.city}
        </p>
        <p>
          {page.bio} {page.kaomoji}
        </p>
      </header>
      <section>
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
      </section>
      <section>
        <h2>{page.sections.skills}</h2>
        <ul>
          {page.skills.map(skill => (
            <li key={skill.name}>
              <a href={skill.href} rel='noreferrer' target='_blank'>
                {skill.name}
              </a>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>{page.sections.openSource}</h2>
        <ul>
          {page.projects.map(project => (
            <li key={project.name}>
              <a href={project.href} rel='noreferrer' target='_blank'>
                {project.name}
              </a>
              <p>{project.summary}</p>
              <p>
                {project.language} · {project.stars} · {project.forks}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}

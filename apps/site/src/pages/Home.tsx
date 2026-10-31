import { formatCount } from '@heyq02/profile'
import { useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

import { brandIcon } from '../brands.ts'
import { BrandIcon } from '../components/BrandIcon.tsx'
import { SectionHeading } from '../components/SectionHeading.tsx'
import { useContent } from '../i18n/LocaleContext.tsx'
import { Page } from '../layout.tsx'

const typeDelay = 140
const deleteDelay = 100
const holdDelay = 2000

function TypedName({ label, names }: { label: string; names: string[] }) {
  const reduce = useReducedMotion()
  const [text, setText] = useState('')

  useEffect(() => {
    if (reduce !== false) {
      return () => {}
    }

    let wordIndex = 0
    let length = 0
    let deleting = false
    let timer: ReturnType<typeof setTimeout> | undefined

    const tick = () => {
      const word = names[wordIndex] ?? ''

      if (!deleting) {
        length += 1
        setText(word.slice(0, length))
        if (length === word.length) {
          deleting = true
          timer = globalThis.setTimeout(tick, holdDelay)
          return
        }
        timer = globalThis.setTimeout(tick, typeDelay)
        return
      }

      length -= 1
      setText(word.slice(0, Math.max(length, 0)))
      if (length === 0) {
        deleting = false
        wordIndex = (wordIndex + 1) % names.length
        timer = globalThis.setTimeout(tick, typeDelay)
        return
      }
      timer = globalThis.setTimeout(tick, deleteDelay)
    }

    timer = globalThis.setTimeout(tick, typeDelay)
    return () => {
      if (timer !== undefined) {
        globalThis.clearTimeout(timer)
      }
    }
  }, [names, reduce])

  if (reduce !== false) {
    return (
      <h1 className='text-h1 font-medium whitespace-nowrap'>
        <span className='brand-text'>{label}</span>
      </h1>
    )
  }

  return (
    <h1 aria-label={label} className='text-h1 font-medium whitespace-nowrap'>
      <span aria-hidden='true' className='brand-text name-caret'>
        {text || '\u200B'}
      </span>
    </h1>
  )
}

export function markAbbr(mark: string) {
  return mark.slice(0, 2)
}

function DegreeIcon() {
  return (
    <svg aria-hidden='true' className='size-4 shrink-0' fill='currentColor' viewBox='0 0 24 24'>
      <path d='M5 13.18v4L12 21l7-3.82v-4L12 17zM12 3 1 9l11 6 9-4.91V17h2V9z' />
    </svg>
  )
}

function CityIcon() {
  return (
    <svg aria-hidden='true' className='size-4 shrink-0' fill='currentColor' viewBox='0 0 24 24'>
      <path d='M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7m0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5' />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg aria-hidden='true' className='size-3.5 shrink-0' fill='currentColor' viewBox='0 0 16 16'>
      <path d='M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z' />
    </svg>
  )
}

function ForkIcon() {
  return (
    <svg aria-hidden='true' className='size-3.5 shrink-0' fill='currentColor' viewBox='0 0 16 16'>
      <path d='M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.5.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z' />
    </svg>
  )
}

export function Home() {
  const {
    avatar,
    bio,
    city,
    degree,
    experiences,
    kaomoji,
    kicker,
    name,
    names,
    projects,
    sections,
    skills
  } = useContent()

  return (
    <Page kicker={kicker}>
      <div className='grid items-start gap-8 lg:grid-cols-[13.5rem_minmax(0,1fr)_11.5rem] lg:gap-x-12 lg:gap-y-10'>
        <header className='lg:row-span-2'>
          <div className='relative mb-5 w-fit'>
            <span
              aria-hidden='true'
              className='bg-meteor-head/20 absolute top-2 left-2 size-28 rounded-full sm:size-32'
            />
            <img
              alt=''
              className='ring-background relative size-28 rounded-full object-cover ring-4 sm:size-32'
              height={128}
              src={avatar}
              width={128}
            />
          </div>
          <TypedName key={names.join('\0')} label={name} names={names} />
          <ul className='mt-5 flex flex-nowrap items-center gap-x-3 text-sm leading-6'>
            <li className='flex items-center gap-1.5'>
              <DegreeIcon />
              <span>{degree}</span>
            </li>
            <li className='flex items-center gap-1.5'>
              <CityIcon />
              <span>{city}</span>
            </li>
          </ul>
          <p className='mt-3 text-base leading-7 break-all'>
            {bio}{' '}
            <span aria-hidden='true' className='whitespace-nowrap'>
              {kaomoji}
            </span>
          </p>
        </header>

        <section aria-labelledby='work-heading'>
          <SectionHeading id='work-heading' title={sections.experience} />
          <ul>
            {experiences.map(job => (
              <li className='py-3 first:pt-0 last:pb-0' key={`${job.company}-${job.start}`}>
                <div className='flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3'>
                  <h3 className='min-w-0 text-lg leading-6 font-medium'>
                    <a
                      className='hover:text-accent-text min-w-0 transition-colors'
                      href={job.href}
                      rel='noopener noreferrer'
                      target='_blank'
                    >
                      {job.company}
                    </a>
                  </h3>
                  <p className='text-muted shrink-0 text-sm tabular-nums'>
                    {job.start} – {job.end}
                  </p>
                </div>
                <ul className='text-muted mt-3 list-disc space-y-1 pl-4 text-sm leading-6 text-pretty'>
                  {job.points.map(point => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby='skills-heading'>
          <SectionHeading id='skills-heading' title={sections.skills} />
          <ul className='grid grid-cols-3 gap-x-2 gap-y-4'>
            {skills.map(skill => {
              const icon = brandIcon(skill.name)

              return (
                <li className='flex items-center justify-center' key={skill.name} translate='no'>
                  {icon ? (
                    <a
                      aria-label={skill.summary ? `${skill.name}, ${skill.summary}` : skill.name}
                      className='group hover:border-title/12 hover:bg-title/8 relative z-0 inline-flex size-9 items-center justify-center rounded-lg border border-transparent transition-[background-color,border-color] duration-150 ease-out hover:z-10 focus-visible:z-10'
                      href={skill.href}
                      rel='noopener noreferrer'
                      target='_blank'
                    >
                      <BrandIcon colored icon={icon} size='md' />
                      <span className='border-title/8 bg-background pointer-events-none absolute top-full left-1/2 z-10 mt-2.5 -translate-x-1/2 rounded-md border opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 group-hover:delay-150 group-focus-visible:opacity-100'>
                        <span className='flex items-center gap-3 px-3 py-2'>
                          <BrandIcon colored icon={icon} size='md' />
                          <span className='flex w-44 flex-col'>
                            <span className='text-title text-sm leading-5 font-medium'>
                              {skill.name}
                            </span>
                            {skill.summary ? (
                              <span className='text-muted text-xs leading-4'>{skill.summary}</span>
                            ) : null}
                          </span>
                        </span>
                      </span>
                    </a>
                  ) : (
                    <span className='text-xs font-medium'>{markAbbr(skill.name)}</span>
                  )}
                </li>
              )
            })}
          </ul>
        </section>

        <section aria-labelledby='code-heading' className='lg:col-span-2 lg:col-start-2'>
          <SectionHeading id='code-heading' title={sections.openSource} />
          <ul className='grid gap-3.5 sm:grid-cols-2'>
            {projects.map(project => (
              <li className='min-w-0' key={project.name}>
                <a
                  className='border-title/8 bg-background hover:border-title/16 flex h-full flex-col rounded-[14px] border px-5 py-3 shadow-[0_1px_0_rgba(17,17,19,0.04),0_12px_28px_-6px_rgba(17,17,19,0.14)] transition-colors'
                  href={project.href}
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  <span
                    className='text-title text-lg leading-6 font-medium break-words'
                    translate='no'
                  >
                    {project.name}
                  </span>
                  <span className='text-muted mt-2 line-clamp-2 min-h-12 text-sm leading-6'>
                    {project.summary}
                  </span>
                  <span className='text-muted mt-2 flex items-center gap-3 text-sm'>
                    <span className='flex items-center gap-1.5'>
                      <span
                        className='size-2 rounded-full'
                        style={{ backgroundColor: project.languageColor }}
                      />
                      {project.language}
                    </span>
                    <span className='flex items-center gap-1'>
                      <StarIcon />
                      {formatCount(project.stars)}
                    </span>
                    {project.forks > 0 ? (
                      <span className='flex items-center gap-1'>
                        <ForkIcon />
                        {formatCount(project.forks)}
                      </span>
                    ) : null}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Page>
  )
}

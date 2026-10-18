import { formatCount, profile } from "./profile.ts";

export interface Action {
  id: string;
  label: string;
  href: string;
  detail?: string;
}

export const actions: Action[] = [
  {
    id: "site",
    label: "intro.heyq02.com",
    href: profile.site,
    detail: "个人介绍",
  },
  ...profile.experiences.map((job, index) => ({
    id: `experience-${index}`,
    label: `${job.company}  ${job.start} – ${job.end}`,
    href: job.href,
  })),
  ...profile.projects.map((project) => ({
    id: `project-${project.name}`,
    label: `${project.name}  ★ ${formatCount(project.stars)}`,
    href: project.href,
    detail: project.summary,
  })),
  ...profile.places.map((place) => ({
    id: `place-${place.label}`,
    label: `${place.label}  ${place.detail}`,
    href: place.href,
  })),
  {
    id: "email",
    label: profile.email,
    href: `mailto:${profile.email}`,
  },
];

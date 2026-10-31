/** Resolve `@heyq02/brands` slugs to `simple-icons` objects for the site UI. */

import { brandSlug, matchBrandName } from '@heyq02/brands'
import type { SimpleIcon } from 'simple-icons'
import {
  siApachemaven,
  siBilibili,
  siBluesky,
  siClaude,
  siCss,
  siCursor,
  siDeepseek,
  siDocker,
  siExpo,
  siFigma,
  siGit,
  siGithub,
  siGithubactions,
  siGithubcopilot,
  siGithubpages,
  siGradle,
  siHtml5,
  siJavascript,
  siJuejin,
  siLinux,
  siMacos,
  siMysql,
  siNextdotjs,
  siNginx,
  siNodedotjs,
  siOxc,
  siRabbitmq,
  siReact,
  siRedis,
  siRolldown,
  siRust,
  siSpring,
  siSpringboot,
  siTypescript,
  siVim,
  siVite,
  siVitest,
  siVuedotjs,
  siWechat,
  siWebpack,
  siX,
  siXiaohongshu
} from 'simple-icons'

const iconsBySlug = new Map<string, SimpleIcon>(
  [
    siApachemaven,
    siBilibili,
    siBluesky,
    siClaude,
    siCss,
    siCursor,
    siDeepseek,
    siDocker,
    siExpo,
    siFigma,
    siGit,
    siGithub,
    siGithubactions,
    siGithubcopilot,
    siGithubpages,
    siGradle,
    siHtml5,
    siJavascript,
    siJuejin,
    siLinux,
    siMacos,
    siMysql,
    siNextdotjs,
    siNginx,
    siNodedotjs,
    siOxc,
    siRabbitmq,
    siReact,
    siRedis,
    siRolldown,
    siRust,
    siSpring,
    siSpringboot,
    siTypescript,
    siVim,
    siVite,
    siVitest,
    siVuedotjs,
    siWechat,
    siWebpack,
    siX,
    siXiaohongshu
  ].map(icon => [icon.slug, icon])
)

export function brandIcon(label: string): SimpleIcon | undefined {
  const name = matchBrandName(label)
  if (name === undefined) {
    return undefined
  }

  const slug = brandSlug(name)
  return slug === undefined ? undefined : iconsBySlug.get(slug)
}

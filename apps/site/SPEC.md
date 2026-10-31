---
id: site
type: module-design
status: draft
title: Profile site
parent: architecture
depends-on: [profile]
---

## Responsibility

Rspress site for heyq02.com. The home page is the profile: name, degree and city, bio, place links, experience, skills, and project cards. A blog nav item lists posts from `blogs`. With no posts, that page says there are none.

Language is an Rspress locale path, not a hash and not the browser language. Chinese is the default and has no prefix. English lives under `/en`. The theme language switch is the control. Link unfurls use the Chinese title and description because that is the default language shell.

Profile fields come from `profile`. Chinese is the overlay merge. The meteor page and typed-name motion are not part of this site.

## Boundary

- May depend on `profile` and `@rspress/core`. Must not read `readme` or `cli`, and must not render `sponsorkit/` art.
- `rspress.config.ts` may read `intro.json` and `intro.zh.json` for HTML meta. It must not import `@heyq02/*` (`architecture`). Runtime code imports package exports.
- Blog posts are Markdown under `blogs/zh` and `blogs/en`. The profile is not a post.
- Favicons and `CNAME` are copied into the Rspress output. `outDir` stays `dist` so the Pages job does not change its artifact path.

## Limitations

Rspress does not follow the browser language. A Chinese browser that opens `/` sees Chinese; English is a path, not a detection.

The empty blog page is static text. A new Markdown file under `blogs/zh/blog` or `blogs/en/blog` becomes its own page; the index sentence does not turn into a generated list by itself.

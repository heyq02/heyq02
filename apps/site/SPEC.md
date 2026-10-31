---
id: site
type: module-design
status: draft
title: Profile site
parent: architecture
depends-on: [profile, brands]
---

## Responsibility

English Rspress site for heyq02.com. The blog and navbar stay on Rspress. The homepage does not use the built-in hero or the doc-component profile. It is the earlier custom page: meteors, Jingdong LangZhengTi, skill icons, experience, and open-source projects.

GitHub, Bluesky, Twitter, Xiaohongshu, Bilibili, CSDN, and WeChat sit only in the navbar. Email and phone do not. The homepage does not repeat them. There is no language switch. The theme stays light.

The shell title and description come from the English intro.

## Boundary

- May depend on `profile`, `brands`, and `@rspress/core`. Must not read `readme` or `cli`, and must not render `sponsorkit/` art.
- `rspress.config.ts` may read `intro.json` for HTML meta. It must not import `@heyq02/*` (`architecture`). Runtime code imports package exports.
- The custom page is the theme `HomeLayout`. Blog pages keep the default doc layout.
- Skill icons come from `brandSlug`, not from `skillIconsPicture`. A skill with no slug is omitted, not shown as text.
- Favicons and `CNAME` are copied into the Rspress output. `outDir` stays `dist` so the Pages job does not change its artifact path.

## Limitations

The empty blog page is static text. A new Markdown file under `blogs/blog` becomes its own page; the index sentence does not turn into a generated list by itself.

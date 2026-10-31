---
id: site
type: module-design
status: draft
title: Profile site
parent: architecture
depends-on: [profile, brands]
---

## Responsibility

English Vite + React profile for heyq02.com. One page: name, bio, degree and city, experience, skill icons, and open-source projects. The look is the custom page (meteors, Jingdong LangZhengTi, the old spacing), not an Rspress doc or its built-in homepage.

Contacts are brand icons fixed at the top right, from profile places that match `brands`. They are not repeated in the page body. Email and phone are not shown. There is no language switch and no blog.

The shell title and description come from the English intro. The theme stays light.

## Boundary

- May depend on `profile` and `brands`. Must not read `readme` or `cli`, and must not render `sponsorkit/` art.
- `vite.config.ts` may read `intro.json` for HTML meta. It must not import `@heyq02/*` (`architecture`). Runtime code imports package exports.
- Skill icons come from `brandSlug`, not from `skillIconsPicture`. A place with no slug is omitted from the corner, not shown as text.
- Favicons are copied from `static/signature` into `dist`. `CNAME` is copied there too. `outDir` stays `dist` so the Pages job does not change its artifact path.

## Limitations

Hash `#lang=` can still flip `document.documentElement.lang`. Both locales render the same English copy, and the page does not offer a control for it.

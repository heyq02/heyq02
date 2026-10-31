---
id: site
type: module-design
status: draft
title: Profile site
parent: architecture
depends-on: [profile, brands]
---

## Responsibility

English Rspress site for heyq02.com. The blog and navbar stay on Rspress. The homepage is a normal doc page, not the built-in hero and not a second page design. It uses the theme components: badges for degree, city, and project counts, a callout for the bio, and steps for experience. The skills picture matches the README.

GitHub, Bluesky, Twitter, Xiaohongshu, Bilibili, CSDN, and WeChat sit only in the navbar. Email and phone do not. The homepage does not repeat them. There is no language switch. The theme stays light.

The shell title and description come from the English intro.

## Boundary

- May depend on `profile`, `brands`, and `@rspress/core`. Must not read `readme` or `cli`, and must not render `sponsorkit/` art.
- `rspress.config.ts` may read `intro.json` for HTML meta. It must not import `@heyq02/*` (`architecture`). Runtime code imports package exports.
- Theme CSS only centers the doc column and rounds the avatar. It does not replace `HomeLayout` or the blog layout.
- The skills picture comes from `skillIconsPicture`. The site does not keep its own icon set.
- Favicons and `CNAME` are copied into the Rspress output. `outDir` stays `dist` so the Pages job does not change its artifact path.

## Limitations

The empty blog page is static text. A new Markdown file under `blogs/blog` becomes its own page; the index sentence does not turn into a generated list by itself.

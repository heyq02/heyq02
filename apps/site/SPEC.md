---
id: site
type: module-design
status: draft
title: Profile site
parent: architecture
depends-on: [profile, brands]
---

## Responsibility

English Rspress site for heyq02.com. The home page is a wide doc page, not Rspress's built-in homepage. It uses the doc components: badges for degree, city, and project counts, a callout for the bio, and steps for experience. The skills picture matches the README. It does not repeat contact links. GitHub, Bluesky, Twitter, Xiaohongshu, Bilibili, CSDN, and WeChat sit only in the navbar's social links, which the theme renders at the top right. Email and phone do not. A blog nav item lists posts from `blogs`. With no posts, that page says there are none.

There is no Chinese locale and no language switch. The theme stays light; the dark-mode toggle is hidden. The shell title and description come from the English intro.

## Boundary

- May depend on `profile` and `@rspress/core`. Must not read `readme` or `cli`, and must not render `sponsorkit/` art.
- `rspress.config.ts` may read `intro.json` for HTML meta. It must not import `@heyq02/*` (`architecture`). Runtime code imports package exports.
- Blog posts are Markdown under `blogs`. The profile is not a post.
- Favicons and `CNAME` are copied into the Rspress output. `outDir` stays `dist` so the Pages job does not change its artifact path.

## Limitations

The empty blog page is static text. A new Markdown file under `blogs/blog` becomes its own page; the index sentence does not turn into a generated list by itself.

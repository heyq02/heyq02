---
id: site
type: module-design
status: draft
title: Profile site
parent: architecture
depends-on: [profile, brands]
---

## Responsibility

English Rspress site for heyq02.com. The blog and navbar stay on Rspress. The homepage is a normal doc page, not the built-in hero and not a second page design. It opts out of doc chrome so it does not look like a guide: no info callout, no numbered steps, no heading anchors, and no external-link marks. Role tags and project counts stay badges. The skills picture matches the README. Theme CSS turns that page into a left-aligned identity column: custom type, soft wash background, timeline experience, linked project rows, and a writing list from `blogs/blog`. Empty side columns stay hidden on this page only.

GitHub, Bluesky, Twitter, Xiaohongshu, Bilibili, CSDN, and WeChat sit only in the navbar. Email and phone do not. The homepage does not repeat them. There is no language switch. The theme stays light.

The shell title and description come from the English intro.

## Boundary

- May depend on `profile`, `brands`, and `@rspress/core`. Must not read `readme` or `cli`, and must not render `sponsorkit/` art.
- `rspress.config.ts` may read `intro.json` for HTML meta. It must not import `@heyq02/*` (`architecture`). Runtime code imports package exports.
- Theme CSS styles the homepage column and hides doc chrome there. It does not replace `HomeLayout` or the blog layout.
- The skills picture comes from `skillIconsPicture`. The site does not keep its own icon set.
- Favicons and `CNAME` are copied into the Rspress output. `outDir` stays `dist` so the Pages job does not change its artifact path.

## Limitations

Markdown under `blogs/blog/posts` becomes a post page. `/blog/` is Rspress Overview (`overview: true`) with sidebar Overview first, then a Posts group. `prepare` regenerates the homepage Writing list plus `blog/_meta.json` and `blog/posts/_meta.json`.

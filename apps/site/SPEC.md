---
id: site
type: module-design
status: draft
title: Profile site
parent: architecture
depends-on: [profile, brands]
---

## Responsibility

English Rspress site for heyq02.com. The blog and navbar stay on Rspress. The homepage is a normal doc page, not the built-in hero and not a second page design. It opts out of doc chrome so it does not look like a guide: no info callout, no numbered steps, no heading anchors, and no external-link marks. Role tags and project counts stay badges. The skills picture matches the README. Theme CSS turns that page into a left-aligned identity column using Rspress `--rp-*` tokens: timeline experience, linked project/post rows, and a writing list from `blogs/blog/posts`. Empty side columns stay hidden on this page only.

GitHub, Bluesky, X, Bilibili, and WeChat sit only in the navbar. Email and phone do not. The homepage does not repeat them. Site chrome is English-only; there is no language switch. The navbar appearance switch follows the system theme by default.

The shell title and description come from the English intro.

## Boundary

- May depend on `profile`, `brands`, and `@rspress/core`. Must not read `readme` or `cli`, and must not render `sponsorkit/` art.
- `rspress.config.ts` may read `intro.json` for HTML meta. It must not import `@heyq02/*` (`architecture`). Runtime code imports package exports.
- Theme CSS styles the homepage column and hides doc chrome there. It does not replace `HomeLayout` or the blog layout.
- The skills picture comes from `skillIconsPicture` and each skill's `icon` slug. The site does not keep its own icon set.
- Favicons and the navbar signature both use `static/signature/full-nobg` (`favicon.ico` / `favicon.png` / `signature.png`). That PNG is sized for the navbar; the ICO keeps 16/32/48. `CNAME` is copied into the Rspress output. `outDir` stays `dist` so the Pages job does not change its artifact path.
- Open source cards come from GitHub pinned repositories for the login in `intro.places` (GitHub). `prepare` uses `@octokit/graphql` with `GITHUB_TOKEN` or `GH_TOKEN` and a 10s timeout.

## Limitations

Markdown under `blogs/blog/posts` becomes a post page. `/blog/` is Rspress Overview (`overview: true`) with sidebar Overview first, then a Posts group. Overview card titles and h2s come only from generated `blog/posts/_meta.json` (`label`, `overviewHeaders: [2]`), not post frontmatter. `prepare` regenerates `blogs/index.mdx`, the Writing list, pinned project cards, plus `blog/_meta.json` and `blog/posts/_meta.json`, then runs `vp fmt` on those files so local and committed snapshots match. Without a GitHub token, prepare fails.

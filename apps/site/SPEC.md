---
id: site
type: module-design
status: draft
title: Profile site
parent: architecture
depends-on: [shared]
---

## Responsibility

English Rspress site for heyq02.com. The blog and navbar stay on Rspress. Nav `activeMatch` patterns are exclusive (`Home` only `/` or `/index.html`; `Blog` / `Friends` only their path prefixes) so Home does not stay lit on other pages. The homepage is a normal doc page, not the built-in hero and not a second page design. It opts out of doc chrome so it does not look like a guide: no info callout, no numbered steps, no heading anchors, and no external-link marks. Role tags and project counts stay badges. The skills picture matches the README. Theme CSS turns that page into a left-aligned identity column using Rspress `--rp-*` tokens: education above timeline experience, linked project/post rows, and a writing list from `blogs/blog/posts`. Empty side columns stay hidden on this page only. Light personality beats: pokeable avatar + cycling `moods`, console greeting, and shuffled Friends order on each visit.

GitHub, Bluesky, X, Bilibili, and WeChat sit only in the navbar. Email and phone do not. The homepage does not repeat them. Site chrome is English-only; there is no language switch. The navbar appearance switch follows the system theme by default.

The shell title and description come from the English intro. The homepage sets `titleSuffix` from the first tag plus `bio` so the tab reads `Ari He｜阿瑞 - Full-stack engineer, focused on…` instead of duplicating the site title.

## Boundary

- May depend on `shared` and `@rspress/core`, and may read `static/data/intro.json` / `friends.json`. Must not read `readme` or `cli`, and must not render `sponsorkit/` art.
- Typed intro and `skillIconsPicture` come from `shared`. Theme imports intro through `src/site-intro.ts` because Rspress theme cannot resolve `@heyq02/*` bare imports. `rspress.config.ts` may still read `intro.json` for HTML meta and pass `intro.places` into `socialLinksFrom` (`architecture`: app configs must not import `@heyq02/*`).
- Theme CSS styles the homepage column and hides doc chrome there. A custom `Layout` mounts Rspress `HomeFooter` on every page via the `bottom` slot (built-in home footer only runs for `pageType: home`). The footer message is copyright plus the 萌ICP备 link. Homepage frontmatter still sets `footer: false` so doc edit/prev-next chrome stays off.
- The skills picture comes from `skillIconsPicture` and each skill's `icon` slug. The site does not keep its own icon set.
- Favicons and the navbar signature both use `static/signature/full-nobg` (`favicon.ico` / `favicon.png` / `signature.png`). That PNG is sized for the navbar; the ICO keeps 16/32/48. `CNAME` is copied into the Rspress output. `outDir` stays `dist` so the Pages job does not change its artifact path.
- Open source cards come from GitHub pinned repositories for the login in `intro.places` (GitHub). Generation uses `@octokit/graphql` with `GITHUB_TOKEN` or `GH_TOKEN` and a 10s timeout.
- There is no stock Rspress plugin for generating the homepage / blog `_meta.json`. `pluginPrepareSite` runs in the Rspress `config` hook (before route scan) and calls `prepareSite` to refresh `blogs/index.mdx`, `blog/_meta.json`, `blog/posts/_meta.json`, and public assets. `scripts/prepare.ts` remains a manual CLI (with `vp fmt`) for refreshing committed snapshots.
- `@rspress/plugin-rss` builds an Atom feed at `/rss/blog.xml` from `/blog/posts/` (needs `date` or `published_at` in frontmatter). Generation runs on `rspress build` only, not `dev`.
- Agent-friendly build: `llms: true` (SSG-MD) emits per-route `.md`, `/llms.txt`, and `/llms-full.txt`; `themeConfig.llmsUI` injects the llms.txt hint and Markdown copy controls; `@rspress/plugin-sitemap` emits `/sitemap.xml`. GitHub Pages does not content-negotiate `Accept: text/markdown`; Agents should use the `.md` URLs from `llms.txt`.
- `/friends/` is a doc page (no sidebar/outline) that reads `static/data/friends.json` through `FriendsPage`. Cards show avatar, name, and optional blurb (DIYgod / YunYouJun style); browser visits shuffle the grid order. Exchange `self` name/url/avatar and the `{email}` in the body come from intro; JSON only keeps the blurb and friend list. Add or remove friends only in that JSON.

## Limitations

Markdown under `blogs/blog/posts` becomes a post page. `/blog/` is Rspress Overview (`overview: true`) with sidebar Overview first, then a Posts group. Overview card titles and h2s come only from generated `blog/posts/_meta.json` (`label`, `overviewHeaders: [2]`), not post frontmatter. Every `rspress dev` / `build` regenerates homepage MDX, Writing list, pinned cards, and blog meta via `pluginPrepareSite` before routes are scanned. Without a GitHub token that step fails.

---
id: site
type: module-design
status: draft
title: Profile site
parent: architecture
depends-on:
  [
    shared,
    rspress-theme-heyq02,
    rspress-plugin-site-assets,
    rspress-plugin-github-pins,
    rspress-plugin-blog-meta,
    rspress-plugin-profile
  ]
---

## Responsibility

English Rspress site for heyq02.com. Thin composition root: content under `blogs/`, `rspress.config.ts` wiring, social-link helper, and deploy scripts. Behavior lives in `rspress-theme-heyq02` and `rspress-plugin-*` packages.

Nav `activeMatch` patterns are exclusive (`Home` only `/` or `/index.html`; `Blog` / `Friends` only their path prefixes). Site chrome is English-only; there is no language switch. The navbar appearance switch follows the system theme by default.

The shell title and description come from the English intro. The homepage sets `titleSuffix` from the first tag plus `bio` so the tab reads `Ari He｜阿瑞 - Full-stack engineer, focused on…`.

## Boundary

- May depend on `shared`, the rspress theme/plugin packages, and `@rspress/core`, and may read `static/data/intro.json` for config meta. Must not read `readme` or `cli`, and must not render `sponsorkit/` art.
- `rspress.config.ts` may import unscoped `rspress-plugin-*` / resolve `themeDir` to the theme package path (`architecture`: app configs must not import `@heyq02/*`).
- Theme UI and friends data live in `rspress-theme-heyq02`. Homepage MDX, blog meta, pins, and public asset copy are regenerate via plugins before route scan.
- `@rspress/plugin-rss` builds an Atom feed at `/rss/blog.xml` from `/blog/posts/`. Generation runs on `rspress build` only, not `dev`.
- Agent-friendly build: `llms: true` (SSG-MD); `themeConfig.llmsUI`; `@rspress/plugin-sitemap` emits `/sitemap.xml`.
- `scripts/prepare.ts` remains a manual CLI (with `vp fmt`) that runs the same prepare steps as the plugins.
- Favicons and the navbar signature use `static/signature/full-nobg` via `rspress-plugin-site-assets`. `CNAME` is copied into the Rspress output. `outDir` stays `dist`.

## Limitations

Markdown under `blogs/blog/posts` becomes a post page. `/blog/` is Rspress Overview with sidebar Overview first, then Posts. Every `rspress dev` / `build` regenerates homepage MDX, Writing list, pinned cards, blog meta, and public assets via plugins before routes are scanned. Without a GitHub token the pins/profile step fails.

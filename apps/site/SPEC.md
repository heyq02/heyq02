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
    rspress-plugin-blog-meta,
    rspress-plugin-profile
  ]
---

## Responsibility

English Rspress site for heyq02.com. Thin composition root: content under `blogs/`, `rspress.config.ts` wiring, and deploy scripts. Behavior lives in `rspress-theme-heyq02` and `rspress-plugin-*` packages; navbar social links come from `shared.socialLinksFrom`. Tailwind CSS v4 is wired here (`tailwind.css` + `@rsbuild/plugin-tailwindcss`); theme/plugin sources are scanned via `@source`.

Nav `activeMatch` patterns are exclusive (`Home` only `/` or `/index.html`; `Blog` / `Friends` only their path prefixes). Site chrome is English-only; there is no language switch. The navbar appearance switch follows the system theme by default.

The shell title and description come from the English intro. The homepage sets `titleSuffix` from the first tag plus `bio` so the tab reads `Ari He｜阿瑞 - Full-stack engineer, focused on…`.

## Boundary

- May depend on `shared`, the rspress theme/plugin packages, and `@rspress/core`, and may read `static/data/intro.json` for config meta. Must not read `readme` or `cli`, and must not render `sponsorkit/` art.
- `rspress.config.ts` may import unscoped `rspress-plugin-*`, `@heyq02/shared` (`socialLinksFrom`), and resolve `themeDir` to the theme package path (`architecture`: app **Vite** configs must not import `@heyq02/*`).
- Theme UI and friends data live in `rspress-theme-heyq02`. Homepage MDX, blog meta, pins (via profile → github-pins library), and public asset copy regenerate via plugins before route scan; `blogs/index.mdx` and blog `_meta.json` are gitignored.
- `@rspress/plugin-rss` builds an Atom feed at `/rss/blog.xml` from `/blog/posts/`. Generation runs on `rspress build` only, not `dev`.
- Agent-friendly build: `llms` with custom `llmsTxt`; `webMcp: true`; `themeConfig.llmsUI` (`injectLlmsHint`, `viewOptions: false`); theme `chrome.css` hides `.rp-llms-container`; `fallbackHeadingTitle: false`; Open Graph/`head` meta; `editLink` + `lastUpdated`; Friends page includes a `Prompt` for link-exchange drafts; built-in `sitemap: true` emits `/sitemap.xml`.
- GitHub Pages cannot honor `Accept: text/markdown`; agents use explicit `.md` / `llms.txt` URLs instead. `scripts/build.ts` post-processes SSG-MD via `absolutize-md-links.ts` and copies `CNAME` (e2e uses the same path).
- Favicons and the navbar signature use `static/signature/full-nobg` via `rspress-plugin-site-assets`. `outDir` stays `dist`.

## Limitations

Markdown under `blogs/blog/posts` becomes a post page. `/blog/` is Rspress Overview with sidebar Overview first, then Posts. Every `rspress dev` / `build` regenerates homepage MDX, Writing list, pinned cards, blog meta, and public assets via plugins before routes are scanned. Without a GitHub token the pins/profile step fails. `lastUpdated` needs full git history (`fetch-depth: 0` in Release Site).

## Testing

- Unit coverage at least 95% (statements, branches, functions, lines).
- Independent `e2e/` suite required; run via root `pnpm test:e2e` (serves `cbuild` dist). Card chrome asserts computed styles; open-source / friends cards lock Playwright **DOM** snapshots (`outerHTML`), not pixel screenshots.
- Unit tests also snapshot Friends card/grid HTML and generated open-source MDX card markup.
- Tailwind `@source` must include `packages/shared/src` so `site-ui` class tokens are not purged.
- Theme package e2e harness loads site Tailwind plus `harness.css` Rspress tokens and asserts Friends card DOM.

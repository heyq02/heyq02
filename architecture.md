---
id: architecture
type: architecture-design
status: draft
title: Monorepo topology
parent: goal
---

## Drivers

Three surfaces must stay in agreement without a CMS. English copy has one file. Chinese profile copy has one overlay on that file. Brand names have one map (`goal`).

## Topology

pnpm workspace (`apps/*`, `packages/*`) on Node `>=22.12`, Vite Plus, and `@liangmi/vp-config`. The catalog pins Vite to `@voidzero-dev/vite-plus-core`. Root `dev` / `build` / `preview` target the site; root `pack` targets the CLI.

```mermaid
flowchart LR
  json["static/data/intro.json"]
  zh["static/data/intro.zh.json"]
  profile["profile"]
  brands["brands"]
  site["site"]
  readme["readme"]
  json --> profile
  zh --> profile
  json --> site
  zh --> site
  json --> readme
  profile --> site
  brands --> site
  brands --> readme
```

`profile` is the typed API over the English file and the Chinese overlay. The site runtime reads that merge. The CLI does not. Every invocation fetches the published README from GitHub `main` and renders it in the terminal (`cli`). The site Vite config reads both files for the shell, because it must not import `@heyq02/*`. The README generator reads only `intro.json` (`readme`). `brands` maps display names to simple-icons slugs and depends on neither package. Sponsor art is outside this graph: generated under `sponsorkit/`, not imported by any app.

## Decisions

- **Hash locale, no router.** The site is a GitHub Pages SPA. A `#lang=` hash that names a locale wins, so the top-right switch sticks on refresh of that URL. With no locale in the hash, the browser's primary language is used: `zh` and `zh-*` open Chinese, anything else opens English. First load does not write a hash. Link unfurls stay Chinese. Owned by `site`.
- **Chinese is an overlay, not a second profile.** Confirmed. Translated fields live in `static/data/intro.zh.json`. `profile` merges them onto the English intro and keeps the display name, title, links, start dates, counts, and skill names from English. Site, CLI, and README must not keep a private Chinese profile table. UI chrome that is not profile data stays in the site (`site`).
- **Publish surface.** Today only the `heyq02` CLI is public on npm. The site deploys to GitHub Pages (`heyq02.com` via `CNAME`). `profile`, `brands`, and `readme` are private workspace packages. This is what the repo enforces now, not a product non-goal (`goal`).
- **Tag releases.** A `v*` tag (or a manual run) publishes the CLI with npm OIDC trusted publishing (`vp pm stage publish`, provenance on) and deploys the site. CLI publish does not use `--no-git-checks`; current Vite Plus rejects that flag on `stage publish`.
- **README refresh.** Every branch push, or a manual run, regenerates `README.md` onto `main`. Tag pushes do not. The job checks out `main` so a push to another branch does not commit on that ref. The bot commit includes `[ci skip]`, so it does not start another run.
- **Sponsor art is generated, not displayed.** A daily job, plus pushes to `main`, runs SponsorKit (GitHub and Ko-fi tokens) and commits `sponsorkit/**`. Lint and format ignore that tree. Confirmed: not a visitor-facing surface.

## Invariants

- App Vite configs must not import `@heyq02/*`. `vp run` loads every app config before workspace packages are built. The site config reads `intro.json` for the HTML title (the English name) and `intro.zh.json` for the default description. Runtime code imports package exports, and site `cbuild` / `dev` wait on dependency builds. The CLI no longer bundles `profile`.
- Relative profile links (a leading `/`) are absolutized against the site origin before a surface treats them as external URLs. `profile` does this for its exports; the site's Chinese places do it the same way.
- The README stays English and reads `intro.json`, never `intro.zh.json` or a site-local Chinese table. The CLI prints that published README; it does not read `profile`.
- Coverage thresholds in the root Vite Plus config are 95% statements, branches, functions, and lines for app and package source. Commits are conventional (`@commitlint/config-conventional`).

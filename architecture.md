---
id: architecture
type: architecture-design
status: draft
title: Monorepo topology
parent: goal
---

## Drivers

Three surfaces must stay in agreement without a CMS. English copy has one file. Brand names have one map. Chinese exists only because the site is bilingual (`goal`).

## Topology

pnpm workspace (`apps/*`, `packages/*`) on Node `>=22.12`, Vite Plus, and `@liangmi/vp-config`. The catalog pins Vite to `@voidzero-dev/vite-plus-core`. Root `dev` / `build` / `preview` target the site; root `pack` targets the CLI.

```mermaid
flowchart LR
  json["static/data/intro.json"]
  profile["profile"]
  brands["brands"]
  site["site"]
  cli["cli"]
  readme["readme"]
  json --> profile
  json --> site
  json --> readme
  profile --> site
  profile --> cli
  brands --> site
  brands --> readme
```

`profile` is the typed API over the English file. The site's Vite config and the README generator also read that file directly. `brands` maps display names to simple-icons slugs and depends on neither package. Sponsor art is outside this graph: generated under `sponsorkit/`, not imported by any app.

## Decisions

- **Hash locale, no router.** The site is a GitHub Pages SPA. Language is `#lang=en` or `#lang=zh` (short aliases accepted). Default is English. The browser's language is ignored. Owned by `site`.
- **Chinese stays in the site.** Confirmed. The CLI and README stay English. The site keeps a handwritten Chinese copy of the profile fields.
- **Publish surface.** Today only the `heyq02` CLI is public on npm. The site deploys to GitHub Pages (`heyq02.com` via `CNAME`). `profile`, `brands`, and `readme` are private workspace packages. This is what the repo enforces now, not a product non-goal (`goal`).
- **Tag releases.** A `v*` tag (or a manual run) publishes the CLI with npm OIDC trusted publishing (`vp pm stage publish`, provenance on), deploys the site, and regenerates `README.md` onto `main`. The README job checks out `main` because a tag checkout is detached. CLI publish does not use `--no-git-checks`; current Vite Plus rejects that flag on `stage publish`.
- **Sponsor art is generated, not displayed.** A daily job, plus pushes to `main`, runs SponsorKit (GitHub and Ko-fi tokens) and commits `sponsorkit/**`. Lint and format ignore that tree. Confirmed: not a visitor-facing surface.

## Invariants

- App Vite configs must not import `@heyq02/*`. `vp run` loads every app config before workspace packages are built. The site config reads `intro.json` itself for HTML title and description. Runtime code imports package exports, and site `cbuild` / `dev` wait on dependency builds. The CLI pack always bundles `profile` from `dist/`.
- Relative profile links (a leading `/`) are absolutized against the site origin before a surface treats them as external URLs. `profile` does this for its exports; the site's Chinese places do it the same way.
- English copy is not forked into the CLI or README. Those surfaces read `intro.json` or `profile`, never the site's Chinese tables.
- Coverage thresholds in the root Vite Plus config are 95% statements, branches, functions, and lines for app and package source. Commits are conventional (`@commitlint/config-conventional`).

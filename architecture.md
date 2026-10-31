---
id: architecture
type: architecture-design
status: draft
title: Monorepo topology
parent: goal
---

## Drivers

Three surfaces must stay in agreement without a CMS. English copy has one file. Brand names have one map (`goal`).

## Topology

pnpm workspace (`apps/*`, `packages/*`) on Node `>=22.12`, Vite Plus, and `@liangmi/vp-config`. The catalog pins Vite to `@voidzero-dev/vite-plus-core`. Root `dev` / `build` / `preview` target the site; root `pack` targets the CLI.

```mermaid
flowchart LR
  json["static/data/intro.json"]
  friends["static/data/friends.json"]
  brands["brands"]
  site["site"]
  readme["readme"]
  json --> site
  json --> readme
  friends --> site
  brands --> site
  brands --> readme
```

`intro.json` is the English SSOT. The site owns typed access and homepage rendering; the README generator reads the same file. The CLI does not. Every invocation fetches the published README from GitHub `main` and renders it in the terminal (`cli`). The site Rspress config also reads `intro.json` for the shell, because app configs must not import `@heyq02/*`. Skills in that file already carry a simple-icons `icon` slug; `brands` only builds the shared skills picture URL. The README and the site both render that picture. Friend links live in `friends.json` and are site-only (`/friends/`). `brands` depends on neither app. Sponsor art is outside this graph: generated under `sponsorkit/`, not imported by any app.

## Decisions

- **English chrome.** The site is a GitHub Pages Rspress build. The homepage is a doc page of theme components, not the built-in homepage. Site chrome is English-only; there is no language switch. Blog posts may be Chinese. Owned by `site`.
- **Publish surface.** Today only the `heyq02` CLI is public on npm. The site deploys to GitHub Pages (`heyq02.com` via `CNAME`). `brands` and `readme` are private workspace packages. This is what the repo enforces now, not a product non-goal (`goal`).
- **Tag releases.** A `v*` tag (or a manual run) publishes the CLI with npm OIDC trusted publishing (`vp pm stage publish`, provenance on). CLI publish does not use `--no-git-checks`; current Vite Plus rejects that flag on `stage publish`.
- **CI.** Pull requests and pushes to `main` run `vp run ccheck` and `vp test`.
- **Site deploy.** Pushes to `main`, or a manual run, deploy the site to GitHub Pages. Tag pushes do not.
- **README refresh.** Pushes to `main`, or a manual run, regenerate `README.md` on that ref. Tag pushes do not. The bot commit includes `[ci skip]`, so it does not start another run.
- **Sponsor art is generated, not displayed.** A daily job, plus pushes to `main`, runs SponsorKit (GitHub and Ko-fi tokens) and commits `sponsorkit/**`. Lint and format ignore that tree. Confirmed: not a visitor-facing surface.

## Invariants

- App Vite configs must not import `@heyq02/*`. `vp run` loads every app config before workspace packages are built. The site Rspress config reads `intro.json` for the title and description. Runtime code may import package exports (`brands`); site `cbuild` / `dev` wait on dependency builds when those packages expose a `build` task. The CLI does not import site or brands; it fetches the published README.
- Relative intro links (a leading `/`) stay root-relative in the site navbar for Rspress `img` social links (WeChat). Surfaces that need absolute URLs resolve them at the call site.
- The README and the site read `intro.json`. The CLI prints that published README; it does not read `intro.json`.
- Coverage thresholds in the root Vite Plus config are 95% statements, branches, functions, and lines for app and package source. Commits are conventional (`@commitlint/config-conventional`).

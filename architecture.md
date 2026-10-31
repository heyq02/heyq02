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
  profile["profile"]
  brands["brands"]
  site["site"]
  readme["readme"]
  json --> profile
  json --> site
  json --> readme
  profile --> site
  brands --> site
  brands --> readme
```

`profile` is the typed API over the English file. The site runtime reads it. The CLI does not. Every invocation fetches the published README from GitHub `main` and renders it in the terminal (`cli`). The site Rspress config reads `intro.json` for the shell, because app configs must not import `@heyq02/*`. The README generator reads that same file (`readme`). `brands` maps display names to simple-icons slugs and builds the shared skills picture URL. The README and the site both render that picture. `brands` depends on neither package. Sponsor art is outside this graph: generated under `sponsorkit/`, not imported by any app.

## Decisions

- **English chrome.** The site is a GitHub Pages Rspress build. The homepage is a doc page of theme components, not the built-in homepage. Site chrome is English-only; there is no language switch. Blog posts may be Chinese. Owned by `site`.
- **Publish surface.** Today only the `heyq02` CLI is public on npm. The site deploys to GitHub Pages (`heyq02.com` via `CNAME`). `profile`, `brands`, and `readme` are private workspace packages. This is what the repo enforces now, not a product non-goal (`goal`).
- **Tag releases.** A `v*` tag (or a manual run) publishes the CLI with npm OIDC trusted publishing (`vp pm stage publish`, provenance on). CLI publish does not use `--no-git-checks`; current Vite Plus rejects that flag on `stage publish`.
- **Site deploy.** Every branch push, or a manual run, deploys the site to GitHub Pages. Tag pushes do not. The job checks out `main`, so a push to another branch does not publish that branch.
- **README refresh.** Every branch push, or a manual run, regenerates `README.md` onto `main`. Tag pushes do not. The job checks out `main` so a push to another branch does not commit on that ref. The bot commit includes `[ci skip]`, so it does not start another run.
- **Sponsor art is generated, not displayed.** A daily job, plus pushes to `main`, runs SponsorKit (GitHub and Ko-fi tokens) and commits `sponsorkit/**`. Lint and format ignore that tree. Confirmed: not a visitor-facing surface.

## Invariants

- App Vite configs must not import `@heyq02/*`. `vp run` loads every app config before workspace packages are built. The site Rspress config reads `intro.json` for the title and description. Runtime code imports package exports, and site `cbuild` / `dev` wait on dependency builds. The CLI does not import `profile`; it fetches the published README.
- Relative profile links (a leading `/`) are absolutized against the site origin before a surface treats them as external URLs. `profile` does this for its exports. The site navbar keeps root-relative WeChat paths for Rspress `img` social links.
- The README and the site read `intro.json`. The CLI prints that published README; it does not read `intro.json` or `profile`.
- Coverage thresholds in the root Vite Plus config are 95% statements, branches, functions, and lines for app and package source. Commits are conventional (`@commitlint/config-conventional`).

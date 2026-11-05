# Agent notes

## Tooling: use Vite+ (`vp`), not `pnpm`

This monorepo is Vite+ first. Prefer the `vp` CLI for installs, scripts, checks, and filters. Do **not** call `pnpm` / `npm` / `yarn` directly unless a task has no `vp` equivalent (rare; prefer `vp pm …` if you must forward to the underlying package manager).

| Intent                                 | Use                                                                                                      |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Install deps                           | `vp install` / `vp i`                                                                                    |
| Add / remove packages                  | `vp add …` / `vp remove …`                                                                               |
| Run a workspace script                 | `vp run <task>` or `vp run <pkg>#<task>`                                                                 |
| Filter packages                        | `vp run -F <filter> <task>` (e.g. `vp run -F @heyq02/site check`)                                        |
| All packages                           | `vp run -r <task>`                                                                                       |
| Format / lint / typecheck              | `vp check` (or `vp check --fix`); package scripts use `vp run ccheck`                                    |
| Unit tests                             | `vp test`                                                                                                |
| Dev / build                            | `vp run @heyq02/site#dev`, `vp run -r build`                                                             |
| Validate committed `content/data` JSON | `vp run @heyq02/site#cvalidate-content`                                                                  |
| Regenerate `recent-posts.json`         | `vp run @heyq02/site#cprepare-content`                                                                   |
| Refresh homepage GitHub pins / heatmap | `vp run @heyq02/site#crefresh-profile` (needs `GITHUB_TOKEN`; writes `content/data/github-profile.json`) |

`content/data/` holds site data JSON: hand-authored (`intro.json`, `friends.json`) and generated (`github-profile.json` via `crefresh-profile`; `recent-posts.json` via `cprepare-content` / blog-meta). Site pages import through `apps/site/lib/*`, which runtime-validates shapes via `@heyq02/rspress-site-content` assert helpers. CI also runs `cvalidate-content` before build.

After editing blog posts, run `cprepare-content` and commit `content/data/recent-posts.json` if it changed. CI fails on drift. Release Site prepares content + refreshes profile, then commits both generated JSON files before building Pages.

`packageManager` may still say `pnpm` under the hood — that is an implementation detail of Vite+. Agent-facing commands should still be `vp`.

## Package boundaries (frozen)

Do **not** add new workspace packages unless something cannot live in an existing one. Prefer extending:

| Layer     | Package                        | Owns                                                                                      |
| --------- | ------------------------------ | ----------------------------------------------------------------------------------------- |
| Contracts | `@heyq02/rspress-site-content` | Shared types + pure content helpers                                                       |
| UI        | `@heyq02/rspress-theme-ui`     | Presentational components (`foundation` → `primitives` → `layout` → `widgets` → `blocks`) |
| Plugins   | `@heyq02/rspress-plugin-*`     | Build-time prepare / Rspress hooks (`utils` for shared FS helpers)                        |
| App       | `@heyq02/site`                 | Pages, chrome, `lib/*` data adapters, Rspress config                                      |

`apps/site/theme` should stay thin (pages + Layout + chrome). Put reusable UI in `rspress-theme-ui`, not new site components.

Brand files live in `content/brand/` (`signature.png` logo source, `favicon.png` 192×192). Regenerate favicon after changing the signature (e.g. `sips -z 192 192 content/brand/signature.png --out content/brand/favicon.png`).

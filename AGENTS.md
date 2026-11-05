# Agent notes

## Tooling: use Vite+ (`vp`), not `pnpm`

This monorepo is Vite+ first. Prefer the `vp` CLI for installs, scripts, checks, and filters. Do **not** call `pnpm` / `npm` / `yarn` directly unless a task has no `vp` equivalent (rare; prefer `vp pm …` if you must forward to the underlying package manager).

| Intent | Use |
| --- | --- |
| Install deps | `vp install` / `vp i` |
| Add / remove packages | `vp add …` / `vp remove …` |
| Run a workspace script | `vp run <task>` or `vp run <pkg>#<task>` |
| Filter packages | `vp run -F <filter> <task>` (e.g. `vp run -F @heyq02/site check`) |
| All packages | `vp run -r <task>` |
| Format / lint / typecheck | `vp check` (or `vp check --fix`); package scripts use `vp run ccheck` |
| Dev / build | `vp run @heyq02/site#dev`, `vp run -r build` |

`packageManager` may still say `pnpm` under the hood — that is an implementation detail of Vite+. Agent-facing commands should still be `vp`.

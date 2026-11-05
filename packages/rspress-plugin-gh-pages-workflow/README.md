# `@heyq02/rspress-plugin-gh-pages-workflow`

GitHub **Actions Pages** contract for this monorepo — not the community branch-push `rspress-plugin-gh-pages`.

## Split of responsibilities

| Piece                                  | Owns                                                                |
| -------------------------------------- | ------------------------------------------------------------------- |
| This package `pluginGhPagesWorkflow()` | Config marker; optional `outDir` fill-in                            |
| This package `action.yml`              | `configure-pages` + `upload-pages-artifact`                         |
| `.github/workflows/release-site.yml`   | Checkout, content refresh, build, then this action + `deploy-pages` |
| `@heyq02/rspress-plugin-site-dist`     | Prod dist CNAME + SSG-MD absolute links                             |

## Workflow usage

```yaml
- name: Publish Pages artifact
  uses: ./packages/rspress-plugin-gh-pages-workflow
  with:
    dist-path: apps/site/dist
```

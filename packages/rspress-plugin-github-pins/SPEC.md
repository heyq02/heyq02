---
id: rspress-plugin-github-pins
type: module-design
status: draft
title: GitHub pins library
parent: architecture
depends-on: [shared]
---

## Responsibility

Fetch GitHub profile pinned repositories via Octokit GraphQL (`GITHUB_TOKEN` / `GH_TOKEN`, 10s timeout). Library exports are consumed by `rspress-plugin-profile`; this package is not registered as an Rspress plugin.

## Boundary

- May depend on `@heyq02/shared` (`intro`) for the GitHub login. Must not write site files.
- Login comes from intro `places` (GitHub entry).

## Limitations

Without a token the fetch fails. Rate limits and GraphQL errors surface to the caller.

## Testing

- Unit coverage at least 95% (statements, branches, functions, lines).
- Independent `e2e/` suite required; run via root `pnpm test:e2e`.

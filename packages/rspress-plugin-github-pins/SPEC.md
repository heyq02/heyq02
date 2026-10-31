---
id: rspress-plugin-github-pins
type: module-design
status: draft
title: GitHub pinned repos plugin
parent: architecture
depends-on: [shared]
---

## Responsibility

Fetch GitHub profile pinned repositories via Octokit GraphQL (`GITHUB_TOKEN` / `GH_TOKEN`, 10s timeout). Primary surface is library exports consumed by `rspress-plugin-profile`; `pluginGithubPins` is an optional marker in the site plugin list.

## Boundary

- May depend on `shared` and `@octokit/graphql`. Must not write site files.

## Testing

- Unit coverage at least 95% (statements, branches, functions, lines).
- Independent `e2e/` suite required; run via root `pnpm test:e2e`.

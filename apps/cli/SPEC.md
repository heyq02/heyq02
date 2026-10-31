---
id: cli
type: module-design
status: draft
title: Terminal intro
parent: architecture
depends-on: [profile]
---

## Responsibility

Published npm binary `heyq02`. With no arguments it prints an English intro: greeting, each experience as company and dates plus bullet points, then skill names joined in one line. `-h` / `--help` prints usage. `-v` / `--version` prints the package version. Any other argument is an error on stderr and a non-zero exit code. Failures while starting the process also go to stderr and set a non-zero exit code.

## Boundary

- May depend on `profile` only, and only for the English intro. No `brands`, no Chinese overlay, no network.
- Pack always bundles `@heyq02/profile` from `dist/`, so a publish build must compile `profile` first (`architecture`).
- Output is plain text. It does not link companies or render skill icons; that is the README's job (`readme`).

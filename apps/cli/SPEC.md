---
id: cli
type: module-design
status: draft
title: Terminal intro
parent: architecture
depends-on: [profile]
---

## Responsibility

Published npm binary `heyq02`. With no arguments it prints Chinese, a blank line, then English. Each block is a greeting, then each experience as company and dates plus bullet points. Skill names are joined in one line, and only in the Chinese block. `-h` / `--help` and `-v` / `--version` stay English. Any other argument is an English error on stderr and a non-zero exit code. Failures while starting the process also go to stderr and set a non-zero exit code.

## Boundary

- May depend on `profile` only. Chinese comes from that package's overlay merge, not a local table. No `brands`, no network.
- Pack always bundles `@heyq02/profile` from `dist/`, so a publish build must compile `profile` first (`architecture`).
- Output is plain text. It does not link companies or render skill icons; that is the README's job (`readme`).

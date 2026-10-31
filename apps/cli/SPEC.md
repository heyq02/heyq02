---
id: cli
type: module-design
status: draft
title: Terminal intro
parent: architecture
---

## Responsibility

Published npm binary `heyq02`. With no arguments it fetches the raw `main` README and prints it rendered for the terminal. `-h` / `--help` and `-v` / `--version` stay local and do not fetch. Any other argument is an error on stderr, a non-zero exit code, and does not fetch. A failed fetch, timeout, or non-OK response is an error on stderr and a non-zero exit code. There is no bundled intro to fall back to.

## Boundary

- May fetch only `https://raw.githubusercontent.com/heyq02/heyq02/main/README.md`, and only when there are no arguments. Timeout is 10 seconds. No `profile`, no `brands`, no other network.
- The blob page is not fetched. It is GitHub HTML, not the README file.
- `marked-terminal` renders the file as fetched. The README is Markdown, so this app does not rewrite HTML. Ink was not used: a print-and-exit package already existed.
- Output is terminal text. It does not draw the skills picture.

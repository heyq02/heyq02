---
id: cli
type: module-design
status: draft
title: Terminal intro
parent: architecture
---

## Responsibility

Published npm binary `heyq02`. Every invocation fetches the raw `main` README and prints it rendered for the terminal. Arguments, including `-h` and `-v`, are ignored. A failed fetch, timeout, or non-OK response is an error on stderr and a non-zero exit code. There is no bundled intro to fall back to.

## Boundary

- May fetch only `https://raw.githubusercontent.com/heyq02/heyq02/main/README.md`. Timeout is 10 seconds. No `profile`, no `brands`, no other network. No help or version command.
- The blob page is not fetched. It is GitHub HTML, not the README file.
- `marked-terminal` renders the file as fetched. The README is Markdown, so this app does not rewrite HTML. Ink was not used: a print-and-exit package already existed.
- Output is terminal text. It does not draw the skills picture.

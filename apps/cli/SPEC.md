---
id: cli
type: module-design
status: draft
title: Terminal README
parent: architecture
---

## Responsibility

Published npm binary `heyq02`. Every invocation fetches the raw `main` README and prints it rendered for the terminal. Arguments, including `-h` and `-v`, are ignored. A failed fetch, timeout, or non-OK response writes to stderr and exits non-zero.

## Boundary

- May fetch only `https://raw.githubusercontent.com/heyq02/heyq02/main/README.md`. Timeout is 10 seconds. No `site`, no `shared`, no other network. No help or version command.
- The blob page is not fetched. It is GitHub HTML, not the README file.
- `marked-terminal` renders the file as fetched. The README is Markdown, so this app does not rewrite HTML.
- CLI entry detection resolves `process.argv[1]` with `realpath` so npm/npx `.bin` symlinks still match `import.meta.url`.
- Output is terminal text. It does not draw the skills picture.

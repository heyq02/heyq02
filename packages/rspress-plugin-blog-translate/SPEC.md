---
id: rspress-plugin-blog-translate
type: library
status: draft
title: DeepSeek blog translation
parent: architecture
depends-on: [shared]
---

## Responsibility

Translate the Chinese blog tree (`apps/site/blogs/zh`) into English (`apps/site/blogs/en`) with DeepSeek chat completions. Frontmatter, fenced code, and Markdown structure are preserved; code blocks are swapped for `⟦CODE_n⟧` placeholders so the model cannot rewrite them.

Translations are build output: `apps/site/blogs/en` is gitignored and only reaches `dist`. Runs from `.github/workflows/release-site.yml` before the site build, and from `pnpm translate` locally. `apps/site/blogs/.translate-cache.json` records a content hash per source file, so unchanged posts reuse their existing translation and only new or edited posts cost tokens.

Env: `DEEPSEEK_API_KEY` (required), `DEEPSEEK_BASE_URL`, `DEEPSEEK_MODEL` (both optional).

## Boundary

- Node-only. Reads and writes Markdown under `apps/site/blogs`; never renders MDX or writes sidebar meta.
- Files over `maxFileBytes` (default 60 kB) are copied rather than translated, and the run reports them.

## Testing

- Unit coverage at least 95% (statements, branches, functions, lines) with a fake translator and fake `fetch`.

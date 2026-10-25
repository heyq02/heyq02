# Design

Personal site, light theme only. The visual baseline is the [Lynx](https://lynxjs.org/zh/) document content box, not its homepage banner and not the sidebar documentation shell.

Change tokens in `src/App.css` `@theme` first, then components. Motion durations are read from CSS variables. Do not duplicate them in JS.

## Taken from Lynx

Content box max width is 1000px, including horizontal padding. Padding: 80 at ≥1280, 36 at ≤1279, 24 at ≤768; vertical padding is 48. Nav height is 64px. Nav item gap is 24px. Body text is 16px with line-height 1.7. The level-one heading is 32px. The header and the content share this padding.

Accent `#ff351a`, secondary `#12e5e5`, gradient mid-stop `rgba(239, 155, 255, 1)`, title `#111113`.

Leave these behind: the 56px marketing title, the 960px feature grid, the 1015/500 breakpoints, and the sidebar formula `max((100vw - 1000 - 320 - 268) / 2, 20px)`. This site has no sidebar and no outline.

## Color

| Token                 | Value                      | Use                                                                                                               |
| --------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `--color-background`  | `#fff`                     | Page background                                                                                                   |
| `--color-foreground`  | `#242424`                  | Body text                                                                                                         |
| `--color-title`       | `#111113`                  | Titles                                                                                                            |
| `--color-muted`       | `#000000b3`                | Secondary text. Already 0.7 alpha. Do not add `opacity-70` on icons                                               |
| `--color-accent`      | `#ff351a`                  | Decoration: section underline, focus ring, name gradient, meteor tail. About 3.6:1 on white, so not for 14px text |
| `--color-accent-text` | `#d62d16`                  | Small emphasized text, current nav item, link hover. About 4.9:1 on white                                         |
| `--color-accent-glow` | `rgba(239, 155, 255, 1)`   | Gradient mid-stop                                                                                                 |
| `--color-card`        | `#f8f8f9`                  | Spare surface                                                                                                     |
| `--color-border`      | `#0000001f`                | Spare border                                                                                                      |
| `--color-grid`        | `rgba(128, 128, 128, 0.1)` | Background grid. Keep this rgba. `#808080` is computed as `gray` by Tailwind and the grid turns black             |
| `--color-meteor-head` | `#12e5e5`                  | Meteor head                                                                                                       |
| `--color-meteor-tail` | `#ff351a`                  | Meteor tail                                                                                                       |
| `--color-ring`        | `var(--color-accent)`      | `:focus-visible` outline, 2px, offset 3px                                                                         |

Do not darken `--color-accent`. The name gradient uses it directly.

## Type

Keep the Jingdong Langzheng faces.

- Body: `JINGDONGLangZhengTi1-Regular`
- `.font-medium`: `JINGDONGLangZhengTi1-Semibold` at `font-weight: 400`
- `.font-bold`: `JINGDONGLangZhengTi2-Bold` at `font-weight: 400`
- `font-synthesis: none`

Fallback: `ui-sans-serif, system-ui, sans-serif`.

## Scale

One scale. Card titles match the company name. Descriptions match meta text.

| Role                                          | Spec                                                      |
| --------------------------------------------- | --------------------------------------------------------- |
| Name                                          | 32px (`--text-h1`), medium weight                         |
| Section title                                 | 22px / 1.3, medium weight, 1px `--color-accent` underline |
| Company, repo name                            | 18px / 24px, medium weight                                |
| Bio                                           | 16px / 28px, one sentence                                 |
| Experience points, dates, repo summary, stars | 14px / 24px, `--color-muted`                              |
| Tooltip title                                 | 14px / 20px, medium weight                                |
| Tooltip description                           | 12px / 16px, `--color-muted`, may wrap to two lines       |
| Kicker, nav                                   | 14px                                                      |

## Layout

From `lg` (1024px): `13.5rem`, a flexible middle column, `11.5rem`. Column gap 48px, row gap 40px. Below that, one column with 32px gaps.

- Left: avatar, name, bio, social. Keep this column at `13.5rem`.
- Middle: experience. Open source starts in the middle column and spans the right column too.
- Right: skills, a 3-column icon grid.

Avatar is 112px, 128px from `sm`, circular, 4px white ring, with a `--color-meteor-head` glow at 20% behind it.

## Name

The name is Ari He. Page titles and the blog header link use `Ari He`. Bilibili (`全栈糕手Ari`) and Juejin (`编程糕手Ari`) stay as the account names.

Typing starts empty, types Ari He, holds 2s, deletes, types Developer, holds 2s, deletes, and loops. Typing is 140ms, deleting is 100ms. The typed text gets the gradient and the caret. There is no subtitle under the name.

Gradient direction is 270deg: accent, glow, cyan, glow, accent.

With `prefers-reduced-motion`, show `Ari He` and no caret. `aria-label` is `Ari He`. `useReducedMotion()` animates only when it returns `false`.

Under the name, degree and city sit on one meta line: a cap icon with `Bachelor`, then a pin icon with `China`. The sentence under that line reads “Full-stack engineer / open-source enthusiast / vlogger on career. Focused on AI that speeds up development and ships in real products.” The kaomoji `(๑•̀ㅂ•́)و` closes the line. The kaomoji is `aria-hidden` and `whitespace-nowrap` so `word-break: break-all` does not split it. Other words split anywhere inside the 13.5rem column.

## Experience

One entry: JD.com, Inc. No logo, no job title. The company name links to the site in a new tab. Dates use `tabular-nums`.

Points are a 14px disc list.

## Open source

Only the two pinned GitHub repos: `jd-opensource/taro-ui` and `heyq02/simpleicons.dev`. Data lives in `intro.json` and is imported by `src/site.ts`. Data lives in the repo-root [`static/data/intro.json`](../../static/data/intro.json) and is imported by `src/site.ts`. Do not fetch it at runtime.

Card facts follow a GitHub pinned card: name, summary, language dot, stars. Hide forks when the count is 0. The visual style follows Lynx choice tabs, not a GitHub widget.

Card: 14px radius, `border-title/8`, white background, light shadow. Hover border is `border-title/16`. The summary uses `line-clamp-2` and stays two lines tall, so the language and counts line up across cards. The taro-ui summary stays in Chinese: 「一款基于 Taro 框架开发的多端 UI 组件库」.

Star counts below 1000 are integers. Otherwise one decimal plus `k`, with a trailing `.0` removed.

## Skills

Order:

1. Vue, React, Next
2. Rolldown, Vite, Oxc
3. Spring, Redis, RabbitMQ
4. Nginx, Docker

Icons are 20px inside a 36×36 target, radius 8px. Hover fill is `title` at 8%, border `title` at 12%. Click opens the official site in a new tab.

The tooltip sits below the icon, delay 150ms, `pointer-events-none` so it does not eat the click. Contents are icon, name, and a short description. Descriptions follow each project's own wording and may wrap to two lines. The text column is `11rem`. Next is "The React framework for the web".

Phones have no hover. A tap navigates. Do not replace this with a persistent card or a state panel.

Brand matching in `src/brands.ts` is an exact name, or a label that starts with the name plus a space or `（`. Longer names come first, so Spring Boot stays before Spring. The catalog may contain brands that are not on the grid. Do not add them back unless asked.

## Contact

Icons are 20px inside a 24×24 target. Every link opens a new tab. Order: GitHub, Bluesky, Bilibili, Juejin, WeChat. WeChat points at `/wechat.jpg`. Bluesky points at `https://bsky.app/profile/heyq02.com`.

## Blog

Empty state: "Posts live on this site. None yet." When posts exist, titles are 18px and dates and summaries are 14px.

## Background and mark

The grid is drawn by `MeteorsBackground`. Cell size stays 120px. The remainder at the edge stays. Do not stretch the grid to the viewport. The canvas is `pointer-events-none absolute inset-0`. Do not set `z-index: -1`. `lineWidth` is 1 CSS pixel: set the canvas size by device pixel ratio, then `setTransform(dpr)`. Reduced motion draws the grid only.

The favicon is the signature from repo-root [`static/signature/full-nobg.*`](../../static/signature/). Files: `public/favicon.ico` and `public/favicon.png` (256×256). Restart `pnpm dev` after replacing them.

## Motion

- Default transition 180ms, `cubic-bezier(0.16, 1, 0.3, 1)`
- Slow transition 420ms, used for reveals
- Reduced motion collapses animation and transitions toward 0, and scrolling becomes `auto`

## Settled boundaries

- Light theme only.
- Small emphasized text uses `--color-accent-text`. Decoration uses `--color-accent`.
- Skill descriptions come from each project's own definition, and they do not repeat each other.
- Open-source summaries stay clamped to two lines. The taro-ui summary stays Chinese.
- Skills are hover tooltip plus click-through.
- The grid color stays `rgba(128, 128, 128, 0.1)`.
- Visible copy is English. Bilibili and Juejin labels stay the account names.

Known limit: skill tooltips are about 234px wide, wider than the 184px right column. Around 1024px and below, a tooltip at opacity 0 still stretches the page into horizontal scroll. Fix that scroll before changing the interaction.

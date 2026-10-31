---
id: site
type: module-design
status: draft
title: Profile site
parent: architecture
depends-on: [profile, brands]
---

## Responsibility

GitHub Pages SPA for heyq02.com. One profile page: avatar and typed name, degree and city, bio, place links, experience, skill icons, and project cards (language, stars, forks).

Language is a hash, not a route. `#lang=en` / `#lang=zh` are canonical; short aliases and other `zh-*` / `en-*` tags also parse. A hash that names a locale wins. With no locale in the hash, the browser's primary language is used: `zh` and `zh-*` open Chinese, anything else opens English. The top-right control writes the hash. First load does not. Changing locale updates `lang`, `title`, and the description meta. An unchanged hash does not add a history entry. Link unfurls stay the Chinese shell, because crawlers do not run this detector.

Both locales come from `profile`. Chinese is the overlay merge, not a handwritten table. UI chrome that is not profile data — skip link, language names — lives only here.

Motion respects `prefers-reduced-motion`. The typed name then shows the static label instead of cycling. Place links with no brand icon are omitted. A skill with no slug renders as a two-letter text mark, not an icon.

## Boundary

- May depend on `profile`, `brands`, and `simple-icons`. Must not read `readme` or `cli`, and must not render `sponsorkit/` art.
- Vite config may read `intro.json` and `intro.zh.json` for HTML meta, favicons from `static/signature`, and `CNAME`. The shell title stays the English name; the default description is the Chinese overlay. It must not import `@heyq02/*` (`architecture`).
- Brand slug lookup goes through `brands`. This app only turns a slug into a `simple-icons` object.
- Relative place links are absolutized with `profile`'s `absoluteHref` before they are shown.

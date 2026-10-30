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

Language is a hash, not a route and not `Accept-Language`. `#lang=en` / `#lang=zh` are canonical; `#en`, `#zh`, `zh-CN`, `zh-Hans`, and `en-US` also parse. Default is Chinese. Changing locale writes the hash and updates `lang`, `title`, and the description meta. An unchanged hash does not add a history entry.

Both locales come from `profile`. Chinese is the overlay merge, not a handwritten table. UI chrome that is not profile data — skip link, language names — lives only here.

Motion respects `prefers-reduced-motion`. The typed name then shows the static label instead of cycling. Place links with no brand icon are omitted. A skill with no slug renders as a two-letter text mark, not an icon.

## Boundary

- May depend on `profile`, `brands`, and `simple-icons`. Must not read `readme` or `cli`, and must not render `sponsorkit/` art.
- Vite config may read `intro.json` and `intro.zh.json` for HTML meta, favicons from `static/signature`, and `CNAME`. The shell title stays the English name; the default description is the Chinese overlay. It must not import `@heyq02/*` (`architecture`).
- Brand slug lookup goes through `brands`. This app only turns a slug into a `simple-icons` object.
- Relative place links are absolutized with `profile`'s `absoluteHref` before they are shown.

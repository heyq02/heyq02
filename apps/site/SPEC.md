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

Language is a hash, not a route and not `Accept-Language`. `#lang=en` / `#lang=zh` are canonical; `#en`, `#zh`, `zh-CN`, `zh-Hans`, and `en-US` also parse. Default is English. Changing locale writes the hash and updates `lang`, `title`, and the description meta. An unchanged hash does not add a history entry.

English content comes from `profile`. Chinese content is a handwritten site table (copy, section labels, places, experience, skills, projects, and chrome strings) by design. UI chrome that is not profile data — skip link, language names — lives only here.

Motion respects `prefers-reduced-motion`. The typed name then shows the static label instead of cycling. Place links with no brand icon are omitted. A skill with no slug renders as a two-letter text mark, not an icon.

## Boundary

- May depend on `profile`, `brands`, and `simple-icons`. Must not read `readme` or `cli`, and must not render `sponsorkit/` art.
- Vite config may read `intro.json` for HTML meta, favicons from `static/signature`, and `CNAME`. It must not import `@heyq02/*` (`architecture`).
- Brand slug lookup goes through `brands`. This app only turns a slug into a `simple-icons` object.
- Relative place links are absolutized with `profile`'s `absoluteHref` before they are shown.

## Limitations

Chinese copy can drift from `static/data/intro.json`. Confirmed. There is no check that the two copies still describe the same profile.

---
id: goal
type: goal-and-requirements
status: draft
title: Ari He public identity
---

## Goal

This repo is Ari He's public identity: a bilingual profile site, a published terminal intro, and a generated GitHub README, all fed from one English profile document.

## Audience

People who open heyq02.com, run the `heyq02` command, or read the GitHub profile README.

## Capabilities

- **Site.** heyq02.com is a single-page profile: identity, experience, skills, and open-source projects. English and Chinese are both available. Language is chosen from the URL hash, not from the browser.
- **CLI.** The published `heyq02` package prints a Chinese terminal introduction, then the English one. Skill names appear once, in the Chinese block. Help and version stay English.
- **README.** A generator writes the GitHub profile README from the English profile document and the Chinese overlay: Chinese greeting and experience, skill icons once, then the English greeting and experience.
- **Sponsor art.** A scheduled job regenerates sponsor images and commits them in the repo. They are not shown on the site or in the README.

## Non-goals

- Not a blog, docs site, or CMS.
- Sponsor graphics are not a visitor-facing surface.

Anything else the repo does not do yet is open, not forbidden.

## Principles

- One English profile document is the source for shared facts on every surface. Chinese profile copy is one overlay on that document, owned by `profile`, not a private site table.
- Surfaces stay thin. Shared facts live in the profile document and the brand-name map; see `architecture`.

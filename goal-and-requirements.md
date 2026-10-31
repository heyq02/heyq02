---
id: goal
type: goal-and-requirements
status: draft
title: Ari oxo public identity
---

## Goal

This repo is Ari oxo's public identity: a bilingual profile site, a published terminal intro, and a generated GitHub README. Shared facts come from one English profile document. Chinese profile copy is one overlay on that document.

## Audience

People who open heyq02.com, run the `heyq02` command, or read the GitHub profile README.

## Capabilities

- **Site.** heyq02.com is an Rspress profile with a blog. The home page is identity, experience, skills, and open-source projects. Posts live in `blogs`. Chinese is the default path; English is under `/en`. The theme language switch chooses the path. The browser's language is not used.
- **CLI.** The published `heyq02` package fetches the GitHub README and prints it rendered in the terminal. Arguments are ignored. There is no help or version command.
- **README.** A generator writes the GitHub profile README (greeting, experience, skill icons) from the English profile document.
- **Sponsor art.** A scheduled job regenerates sponsor images and commits them in the repo. They are not shown on the site or in the README.

## Non-goals

- Not a CMS. The blog is Markdown in the repo, not a hosted editor.
- Sponsor graphics are not a visitor-facing surface.

Anything else the repo does not do yet is open, not forbidden.

## Principles

- One English profile document is the source for shared facts on every surface. Chinese profile copy is one overlay on that document, owned by `profile`, not a private site table.
- Surfaces stay thin. Shared facts live in the profile document and the brand-name map; see `architecture`.

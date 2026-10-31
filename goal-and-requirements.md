---
id: goal
type: goal-and-requirements
status: draft
title: Ari He｜阿瑞 public identity
---

## Goal

This repo is Ari He｜阿瑞's public identity: an English profile site, a CLI that prints the GitHub README, and a generated GitHub README. Shared facts come from one English profile document (`static/data/intro.json`); the CLI prints the published README rather than reading that file.

## Audience

People who open heyq02.com, run the `heyq02` command, or read the GitHub profile README.

## Capabilities

- **Site.** heyq02.com is an English Rspress site. The homepage is identity, experience, skills, and Open source projects, laid out with theme components. Contacts sit in the navbar. Posts live in `apps/site/blogs`. Site chrome is English-only; there is no language switch.
- **CLI.** The published `heyq02` package fetches the GitHub README and prints it rendered in the terminal. Arguments are ignored. There is no help or version command.
- **README.** A generator writes the GitHub profile README (greeting, experience, skill icons) from the English profile document.
- **Sponsor art.** A scheduled job regenerates sponsor images and commits them in the repo. They are not shown on the site or in the README.

## Non-goals

- Not a CMS. The blog is Markdown in the repo, not a hosted editor.
- Sponsor graphics are not a visitor-facing surface.

Anything else the repo does not do yet is open, not forbidden.

## Principles

- One English profile document is the source for shared facts on the site and README. The CLI surfaces that README.
- Surfaces stay thin. Shared facts live in the profile document; see `architecture`.

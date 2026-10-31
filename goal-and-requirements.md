---
id: goal
type: goal-and-requirements
status: draft
title: Yongqi He public identity
---

## Goal

This repo is Yongqi He's public identity: an English profile site, a published terminal intro, and a generated GitHub README, all fed from one English profile document.

## Audience

People who open heyq02.com, run the `heyq02` command, or read the GitHub profile README.

## Capabilities

- **Site.** heyq02.com is an English Rspress site. The homepage is identity, experience, skills, and open-source projects, laid out with theme components. Contacts sit in the navbar. Posts live in `blogs`. There is no language switch.
- **CLI.** The published `heyq02` package fetches the GitHub README and prints it rendered in the terminal. Arguments are ignored. There is no help or version command.
- **README.** A generator writes the GitHub profile README (greeting, experience, skill icons, writing links) from the English profile document and site blog posts.
- **Sponsor art.** A scheduled job regenerates sponsor images and commits them in the repo. They are not shown on the site or in the README.

## Non-goals

- Not a CMS. The blog is Markdown in the repo, not a hosted editor.
- Sponsor graphics are not a visitor-facing surface.

Anything else the repo does not do yet is open, not forbidden.

## Principles

- One English profile document is the source for shared facts on every surface.
- Surfaces stay thin. Shared facts live in the profile document and the brand-name map; see `architecture`.

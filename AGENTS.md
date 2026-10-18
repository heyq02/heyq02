# heyq02

Node CLI and library, built with the [Rstack CLI](https://rstack.rs/) and [`@heyq02/rstack-config`](https://github.com/heyq02/rstack-config).

## Commands

- `pnpm install` installs dependencies and runs `rs hooks`.
- `pnpm run build` builds the library and CLI with `rs lib`.
- `pnpm run format` formats with `rs fmt`.
- `pnpm run lint` lints with `rs lint`.
- `pnpm test` runs Rstest.
- `pnpm run check` runs `rs check` and `tsc6 --noEmit`.
- `pnpm run typecheck` typechecks without emitting.

`rs <name>` is the Rstack built-in. `pnpm run <name>` runs the `package.json` script.

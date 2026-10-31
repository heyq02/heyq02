import { Home } from '../src/pages/Home.tsx'

/** Homepage only. Blog and navbar stay on the Rspress theme. */
export function HomeLayout() {
  return <Home />
}

// Required by Rspress so the blog keeps the default theme. The barrel is default-only to the linter.
// oxlint-disable-next-line import/export
export * from '@rspress/core/theme-original'

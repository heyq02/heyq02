import { expect, it } from 'vite-plus/test'

import { fetchPinnedProjects, githubToken } from '../github-pinned.ts'

it('github-pins e2e: loads live pinned repos when a token is present', async () => {
  const token = githubToken()
  if (!token) {
    // Independent suite: skip without credentials rather than failing local runs.
    expect(token).toBeUndefined()
    return
  }
  const projects = await fetchPinnedProjects()
  expect(projects.length).toBeGreaterThan(0)
  expect(projects[0]?.href).toMatch(/^https:\/\/github\.com\//)
})

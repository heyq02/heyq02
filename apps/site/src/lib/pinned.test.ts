import { describe, expect, it } from 'vitest'

import { pinnedProjects } from './pinned.ts'

describe('pinnedProjects', () => {
  it('loads at least one project with required fields', () => {
    expect(pinnedProjects.length).toBeGreaterThan(0)
    for (const project of pinnedProjects) {
      expect(project.name).toBeTruthy()
      expect(project.href).toMatch(/^https:\/\//)
      expect(project.language).toBeTruthy()
      expect(project.stars).toBeGreaterThanOrEqual(0)
      expect(project.forks).toBeGreaterThanOrEqual(0)
    }
  })
})

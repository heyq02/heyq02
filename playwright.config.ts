import { defineConfig, devices } from '@playwright/test'

const siteDist = 'apps/site/dist'

export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    ...devices['Desktop Chrome'],
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'site',
      testMatch: 'apps/site/e2e/**/*.spec.ts',
      use: { baseURL: 'http://127.0.0.1:4173' }
    }
  ],
  webServer: [
    {
      command: `pnpm exec serve ${siteDist} -l 4173`,
      url: 'http://127.0.0.1:4173',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000
    }
  ]
})

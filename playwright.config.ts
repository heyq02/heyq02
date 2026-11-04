import { defineConfig, devices } from '@playwright/test'

const siteDist = 'apps/site/dist'

export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  // DOM snapshots are OS-agnostic; drop the default -{platform} suffix.
  snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}-{projectName}{ext}',
  use: {
    ...devices['Desktop Chrome'],
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'site',
      testMatch: 'apps/site/e2e/**/*.spec.ts',
      use: { baseURL: 'http://127.0.0.1:4173' }
    },
    {
      name: 'theme',
      testMatch: 'apps/site/theme/e2e/**/*.spec.ts',
      use: { baseURL: 'http://127.0.0.1:5179' }
    }
  ],
  webServer: [
    {
      command: `pnpm exec serve ${siteDist} -l 4173`,
      url: 'http://127.0.0.1:4173',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000
    },
    {
      command: 'node --experimental-strip-types ./apps/site/theme/e2e/harness/serve.ts',
      url: 'http://127.0.0.1:5179',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000
    }
  ]
})

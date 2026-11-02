import { liangmi } from '@liangmi/vp-config'

export default liangmi({
  test: {
    include: ['tests/**/*.test.ts'],
    coverage: {
      include: ['scripts/absolutize-md-links.ts', 'scripts/en-placeholders.ts'],
      exclude: ['scripts/build.ts', 'scripts/en-placeholders-cli.ts'],
      thresholds: {
        statements: 95,
        branches: 95,
        functions: 95,
        lines: 95
      }
    }
  },
  run: {
    tasks: {
      cbuild: {
        command: 'node --experimental-strip-types ./scripts/build.ts',
        cache: {
          // Task env is isolated, so declare what the build needs to receive.
          untrackedEnv: ['GITHUB_TOKEN', 'DEEPSEEK_API_KEY', 'DEEPSEEK_BASE_URL', 'DEEPSEEK_MODEL']
        }
      },
      dev: {
        command:
          'node --experimental-strip-types ./scripts/en-placeholders-cli.ts && pnpm exec rspress dev',
        cache: false
      }
    }
  }
})

import { liangmi } from '@liangmi/vp-config'

export default liangmi({
  test: {
    include: ['src/lib/**/*.test.ts'],
    coverage: {
      include: ['src/lib/**/*.ts'],
      exclude: ['src/lib/**/*.test.ts'],
      thresholds: {
        statements: 80,
        branches: 70,
        functions: 80,
        lines: 80
      }
    }
  },
  run: {
    tasks: {
      cbuild: {
        command: 'node --experimental-strip-types ./scripts/build.ts',
        cache: {
          untrackedEnv: ['GITHUB_TOKEN', 'GH_TOKEN']
        }
      },
      dev: {
        command: 'pnpm exec astro dev',
        cache: false
      }
    }
  }
})

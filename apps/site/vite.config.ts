import { liangmi } from '@liangmi/vp-config'

export default liangmi({
  test: {
    include: ['src/lib/**/*.test.ts'],
    coverage: {
      include: ['src/lib/**/*.ts'],
      exclude: ['src/lib/**/*.test.ts'],
      thresholds: {
        statements: 70,
        branches: 60,
        functions: 70,
        lines: 70
      }
    }
  },
  run: {
    tasks: {
      cbuild: {
        command: 'node --experimental-strip-types ./scripts/build.ts'
      },
      dev: {
        command: 'pnpm exec astro dev',
        cache: false
      }
    }
  }
})

import { liangmi } from '@liangmi/vp-config'

export default liangmi({
  test: {
    include: ['tests/**/*.test.ts'],
    coverage: {
      include: ['scripts/absolutize-md-links.ts'],
      exclude: ['scripts/build.ts'],
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
        dependsOn: [{ task: 'build', from: 'dependencies' }]
      },
      dev: {
        command: 'pnpm exec rspress dev',
        cache: false,
        dependsOn: [{ task: 'build', from: 'dependencies' }]
      }
    }
  }
})

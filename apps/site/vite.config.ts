import { liangmi } from '@liangmi/vp-config'

export default liangmi({
  test: {
    include: ['tests/profile-page.test.ts'],
    coverage: {
      include: ['src/**/*.ts'],
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
        command: 'node --experimental-strip-types ./scripts/dev.ts',
        dependsOn: [{ task: 'build', from: 'dependencies' }]
      }
    }
  }
})

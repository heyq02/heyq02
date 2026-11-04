import { liangmi } from '@liangmi/vp-config'

export default liangmi({
  run: {
    tasks: {
      cbuild: {
        command: 'node --experimental-strip-types ./scripts/build.ts',
        cache: {
          // Task env is isolated, so declare what the build needs to receive.
          untrackedEnv: ['GITHUB_TOKEN']
        }
      },
      dev: {
        command: 'pnpm exec rspress dev',
        cache: false
      }
    }
  }
})

import { liangmi } from '@liangmi/vp-config'

export default liangmi({
  run: {
    tasks: {
      cbuild: {
        command: 'vp exec rspress build',
        cache: {
          // Task env is isolated, so declare what the build needs to receive.
          untrackedEnv: ['GITHUB_TOKEN', 'HEYQ02_PROFILE_STUB']
        }
      },
      dev: {
        command: 'vp exec rspress dev',
        cache: false
      },
      preview: {
        command: 'vp preview',
        cache: false
      }
    }
  }
})

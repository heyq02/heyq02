import { liangmi } from '@liangmi/vp-config'

export default liangmi({
  run: {
    tasks: {
      cbuild: {
        command: 'vp exec rspress build',
        // Reads committed `content/data/github-profile.json`; build does not call GitHub.
        cache: {}
      },
      'cprepare-content': {
        command: 'vpx scripts/prepare-content.ts',
        cache: {}
      },
      'cvalidate-content': {
        command: 'vpx scripts/validate-content.ts',
        cache: {}
      },
      'crefresh-profile': {
        command: 'vpx scripts/refresh-profile.ts',
        cache: {
          untrackedEnv: ['GITHUB_TOKEN', 'GH_TOKEN', 'HEYQ02_PROFILE_STUB']
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

import { liangmi } from '@liangmi/vp-config'

export default liangmi({
  defaultPackage: {
    pack: './apps/cli',
    dev: './apps/site',
    build: './apps/site',
    preview: './apps/site'
  },
  lint: [
    { ignores: ['sponsorkit/**'] },
    // Motion / Ink JSX props are intentionally ephemeral objects and callbacks.
    {
      files: ['apps/site/**', 'apps/cli/tests/**'],
      rules: {
        'react-perf/jsx-no-new-object-as-prop': 'off',
        'react-perf/jsx-no-new-function-as-prop': 'off'
      }
    }
  ],
  fmt: {
    ignorePatterns: ['sponsorkit/**']
  },
  run: {
    tasks: {
      sponsorkit: {
        command: 'vpx sponsorkit',
        cache: {
          env: [
            'SPONSORKIT_GITHUB_TOKEN',
            'SPONSORKIT_GITHUB_LOGIN',
            'SPONSORKIT_KOFI_VERIFICATION_TOKEN'
          ]
        }
      }
    }
  }
})

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
    // Motion JSX props are intentionally ephemeral objects and callbacks.
    {
      files: ['apps/site/**'],
      rules: {
        'react-perf/jsx-no-new-object-as-prop': 'off',
        'react-perf/jsx-no-new-function-as-prop': 'off'
      }
    },
    {
      files: ['**/tests/**'],
      rules: {
        'promise/prefer-await-to-callbacks': 'off',
        'node/no-sync': 'off'
      }
    }
  ],
  fmt: {
    ignorePatterns: ['sponsorkit/**']
  },
  test: {
    coverage: {
      include: ['apps/*/src/**/*.{ts,tsx}', 'packages/*/src/**/*.ts'],
      exclude: ['**/cli.ts', '**/types.ts', '**/env.d.ts', '**/index.tsx', '**/App.css'],
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

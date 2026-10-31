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
      files: ['apps/site/**', 'packages/rspress-theme-heyq02/**'],
      rules: {
        'react-perf/jsx-no-new-object-as-prop': 'off',
        'react-perf/jsx-no-new-function-as-prop': 'off'
      }
    },
    {
      files: ['**/tests/**', '**/e2e/**'],
      rules: {
        'promise/prefer-await-to-callbacks': 'off',
        'node/no-sync': 'off',
        'react-perf/jsx-no-jsx-as-prop': 'off',
        'unicorn/prefer-event-target': 'off',
        'unicorn/max-nested-calls': 'off',
        'unicorn/consistent-function-scoping': 'off',
        'vitest/consistent-test-filename': 'off',
        'vitest/require-mock-type-parameters': 'off'
      }
    }
  ],
  fmt: {
    ignorePatterns: ['sponsorkit/**']
  },
  test: {
    environmentMatchGlobs: [['packages/rspress-theme-heyq02/tests/**', 'jsdom']],
    exclude: ['**/e2e/**', '**/node_modules/**'],
    coverage: {
      include: [
        'apps/*/src/**/*.{ts,tsx}',
        'apps/*/scripts/**/*.ts',
        'packages/*/src/**/*.ts',
        'packages/rspress-theme-heyq02/*.{ts,tsx}',
        'packages/rspress-theme-heyq02/friends-page.ts'
      ],
      exclude: [
        '**/cli.ts',
        '**/types.ts',
        '**/env.d.ts',
        '**/css.d.ts',
        '**/App.css',
        '**/*.css',
        '**/vite.config.ts',
        'apps/site/scripts/build.ts'
      ],
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

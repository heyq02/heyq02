import { liangmi } from '@liangmi/vp-config'

export default liangmi({
  defaultPackage: {
    pack: './apps/cli',
    dev: './apps/site',
    build: './apps/site',
    preview: './apps/site'
  },
  lint: [
    // Motion JSX props are intentionally ephemeral objects and callbacks.
    {
      files: ['apps/site/**'],
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
  test: {
    environmentMatchGlobs: [['apps/site/theme/tests/**', 'jsdom']],
    exclude: ['**/e2e/**', '**/node_modules/**', '**/*.e2e.ts'],
    coverage: {
      include: [
        'apps/*/src/**/*.{ts,tsx}',
        'apps/*/scripts/**/*.ts',
        'apps/site/lib/**/*.ts',
        'apps/site/plugins/**/*.ts',
        'apps/site/theme/*.{ts,tsx}'
      ],
      exclude: [
        '**/env.d.ts',
        '**/*.css',
        '**/vite.config.ts',
        '**/*.e2e.ts',
        'apps/site/scripts/build.ts',
        'apps/site/theme/ui-classes.ts',
        'apps/site/theme/e2e/**'
      ],
      thresholds: {
        statements: 95,
        branches: 95,
        functions: 95,
        lines: 95
      }
    }
  }
})

import { liangmi } from '@liangmi/vp-config'

export default liangmi({
  defaultPackage: {
    pack: './apps/cli',
    dev: './apps/site',
    build: './apps/site',
    preview: './apps/site'
  },
  lint: [
    {
      files: ['apps/site/**'],
      rules: {
        'react-perf/jsx-no-new-object-as-prop': 'off',
        'react-perf/jsx-no-new-function-as-prop': 'off'
      }
    },
    {
      files: ['**/tests/**', '**/e2e/**', '**/*.test.ts', '**/*.test.tsx'],
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
    environmentMatchGlobs: [['apps/site/src/components/**', 'jsdom']],
    exclude: ['**/e2e/**', '**/node_modules/**', '**/*.e2e.ts'],
    coverage: {
      include: ['apps/*/src/**/*.{ts,tsx}', 'apps/site/src/lib/**/*.ts'],
      exclude: [
        '**/env.d.ts',
        '**/*.css',
        '**/vite.config.ts',
        '**/astro.config.ts',
        '**/*.e2e.ts',
        'apps/site/scripts/**',
        'apps/site/src/lib/remark-admonitions.ts'
      ],
      thresholds: {
        statements: 70,
        branches: 60,
        functions: 70,
        lines: 70
      }
    }
  }
})

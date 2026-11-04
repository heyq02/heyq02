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
      files: ['**/tests/**', '**/*.test.ts', '**/*.test.tsx'],
      rules: {
        'promise/prefer-await-to-callbacks': 'off',
        'node/no-sync': 'off',
        'unicorn/prefer-event-target': 'off',
        'unicorn/max-nested-calls': 'off',
        'unicorn/consistent-function-scoping': 'off',
        'vitest/consistent-test-filename': 'off',
        'vitest/require-mock-type-parameters': 'off'
      }
    }
  ],
  test: {
    exclude: ['**/node_modules/**'],
    coverage: {
      include: ['apps/*/src/**/*.{ts,tsx}', 'apps/site/src/lib/**/*.ts'],
      exclude: [
        '**/env.d.ts',
        '**/*.css',
        '**/vite.config.ts',
        '**/astro.config.ts',
        'apps/site/scripts/**',
        'apps/site/src/lib/skills-picture.ts'
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

import { liangmi } from '@liangmi/vp-config'

/** Node e2e suites only — not counted toward unit coverage gates. */
export default liangmi({
  test: {
    include: [
      'apps/*/e2e/**/*.e2e.ts',
      'apps/*/lib/tests/**/*.e2e.ts',
      'apps/*/plugins/tests/**/*.e2e.ts'
    ],
    exclude: ['**/node_modules/**', '**/e2e/harness/**'],
    coverage: {
      enabled: false
    }
  }
})

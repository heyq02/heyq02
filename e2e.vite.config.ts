import { liangmi } from '@liangmi/vp-config'

/** Node e2e suites only — not counted toward unit coverage gates. */
export default liangmi({
  test: {
    include: ['apps/*/e2e/**/*.e2e.ts', 'apps/site/src/lib/**/*.e2e.ts'],
    exclude: ['**/node_modules/**'],
    coverage: {
      enabled: false
    }
  }
})

import { liangmi } from '@liangmi/vp-config'

export default liangmi({
  lint: {
    rules: {
      'react-perf/jsx-no-new-object-as-prop': 'off',
      'react-perf/jsx-no-new-function-as-prop': 'off'
    }
  },
  test: {
    include: ['tests/**/*.test.ts'],
    coverage: {
      include: ['friends-page.ts'],
      thresholds: {
        statements: 95,
        branches: 95,
        functions: 95,
        lines: 95
      }
    }
  }
})

import { liangmi } from '@liangmi/vp-config'

export default liangmi({
  lint: {
    rules: {
      'react-perf/jsx-no-new-object-as-prop': 'off',
      'react-perf/jsx-no-new-function-as-prop': 'off'
    }
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.{test.ts,test.tsx}'],
    coverage: {
      include: ['*.tsx', 'friends-page.ts'],
      exclude: ['env.d.ts', 'css.d.ts', 'vite.config.ts'],
      thresholds: {
        statements: 95,
        branches: 95,
        functions: 95,
        lines: 95
      }
    }
  }
})

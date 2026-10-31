import { liangmi } from '@liangmi/vp-config'

export default liangmi({
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.{test.ts,test.tsx}'],
    coverage: {
      include: ['*.tsx', 'friends-page.ts', 'ui-classes.ts'],
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

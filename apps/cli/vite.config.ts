import { liangmi } from '@liangmi/vp-config'

export default liangmi({
  pack: {
    entry: {
      cli: './src/cli.ts'
    },
    // Prefer .js under "type": "module" instead of fixed .mjs/.d.mts.
    fixedExtension: false
  },
  test: {
    include: ['tests/**/*.test.ts'],
    coverage: {
      include: ['src/**/*.ts'],
      exclude: ['src/cli.ts'],
      thresholds: {
        statements: 95,
        branches: 95,
        functions: 95,
        lines: 95
      }
    }
  }
})

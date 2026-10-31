import { liangmi } from '@liangmi/vp-config'
import react from '@vitejs/plugin-react'
import type { PluginOption } from 'vite-plus'

export default liangmi({
  plugins: [react()] as PluginOption[],
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/env.d.ts'],
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
      cbuild: {
        command: 'node --experimental-strip-types ./scripts/build.ts',
        dependsOn: [{ task: 'build', from: 'dependencies' }]
      },
      dev: {
        command: 'node --experimental-strip-types ./scripts/dev.ts',
        cache: false,
        dependsOn: [{ task: 'build', from: 'dependencies' }]
      }
    }
  }
})

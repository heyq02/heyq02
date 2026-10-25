import { liangmi } from '@liangmi/vp-config'

export default liangmi({
  pack: {
    entry: {
      index: './src/index.ts',
      cli: './src/cli.ts'
    },
    // Prefer .js under "type": "module" instead of fixed .mjs/.d.mts.
    fixedExtension: false,
    deps: {
      neverBundle: ['react-devtools-core'],
      alwaysBundle: ['@heyq02/profile']
    }
  },
  test: {
    include: ['tests/**/*.test.{ts,tsx}']
  },
  run: {
    tasks: {
      // AlwaysBundle reads `@heyq02/profile` from dist/; build it before pack.
      cpack: {
        command: 'vp pack',
        dependsOn: [{ task: 'build', from: ['dependencies', 'devDependencies'] }]
      }
    }
  }
})

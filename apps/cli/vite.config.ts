import { liangmi } from '@liangmi/vp-config'

export default liangmi({
  pack: {
    entry: {
      cli: './src/cli.ts'
    },
    // Prefer .js under "type": "module" instead of fixed .mjs/.d.mts.
    fixedExtension: false,
    deps: {
      alwaysBundle: ['@heyq02/profile']
    }
  },
  test: {
    include: ['tests/**/*.test.ts']
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

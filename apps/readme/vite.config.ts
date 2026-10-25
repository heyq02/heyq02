import { liangmi } from '@liangmi/vp-config'

export default liangmi({
  run: {
    tasks: {
      // `@heyq02/profile` exports dist/; build deps before generate. brands is source-exported.
      cbuild: {
        command: 'node --experimental-strip-types ./src/generate.ts',
        dependsOn: [{ task: 'build', from: 'dependencies' }]
      }
    }
  }
})

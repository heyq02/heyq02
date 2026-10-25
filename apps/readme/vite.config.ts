import { liangmi } from '@liangmi/vp-config'

export default liangmi({
  run: {
    tasks: {
      // @heyq02/profile and @heyq02/brands only export dist/.
      cbuild: {
        command: 'node --experimental-strip-types ./src/generate.ts',
        dependsOn: [{ task: 'build', from: 'dependencies' }]
      }
    }
  }
})

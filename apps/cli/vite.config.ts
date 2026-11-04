import { liangmi } from '@liangmi/vp-config'

export default liangmi({
  pack: {
    entry: {
      index: './src/index.ts'
    }
  },
  run: {
    tasks: {
      // `build` stays as package.json → `vp run cpack` (liangmi cached pack).
      dev: {
        command: 'vp pack --watch',
        cache: false
      }
    }
  }
})

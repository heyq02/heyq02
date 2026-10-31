import { resolve } from 'node:path'

import react from '@vitejs/plugin-react'
import { createServer } from 'vite'

const root = resolve(import.meta.dirname)

const server = await createServer({
  root,
  configFile: false,
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5179,
    strictPort: true
  }
})

await server.listen()
server.printUrls()

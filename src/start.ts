/**
 * @file This starts the server
 * @module src/start
 * @author Fredrik Svensson 
 * @version 0.1.0
 * @since 0.1.0
 */
import createServer from './server.js'
import { config } from './config/environment.js'
import 'reflect-metadata'

createServer().then((app: any) => {
  app.listen(config.PORT, () => {
    console.log(`🚀 Server running at http://localhost:${config.PORT}`)
    console.log(`📝 API Documentation: http://localhost:${config.PORT}/docs`)
    console.log('Press Ctrl-C to terminate...')
  })
}).catch ((err: any) => {
  console.error('❌ Failed to start server:', err)
  process.exit(1)
})

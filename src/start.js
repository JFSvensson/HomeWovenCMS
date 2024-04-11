/**
 * @file This starts the server
 * @module src/start
 * @author Fredrik Svensson 
 * @version 0.1.0
 * @since 0.1.0
 */
import createServer from "./server.js"

createServer().then(app => {
  const port = process.env.PORT || 3000
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
    console.log('Press Ctrl-C to terminate...')
  })
}).catch (err => {
  console.error('Failed to start server:', err)
})

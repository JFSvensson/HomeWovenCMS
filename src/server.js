/**
 * @file This is the root file that initializes the server.
 * @module src/server
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */

import express from 'express'
import { connectToDatabase } from './config/mongoose.js'
import helmet from 'helmet'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import openapiSpecification from './openapiDef.js'
import { router } from './routes/router.js'

const createServer = async () => {
  // Connect to the database.
  await connectToDatabase(process.env.DB_CONNECTION_STRING)

  // Create an Express application.
  const app = express()

  // Setup helmet to secure the application.
  app.use(helmet())
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'vassmolösa.se', 'vassmolosa.nu'],
        styleSrc: ["'self'", "'unsafe-inline'", 'vassmolösa.se', 'vassmolosa.nu'],
        imgSrc: ["'self'", 'data:', 'vassmolösa.se', 'vassmolosa.nu'],
        connectSrc: ["'self'", 'vassmolösa.se', 'vassmolosa.nu'],
        frameSrc: ["'self'", 'vassmolösa.se', 'vassmolosa.nu'],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
      }
    })
  )

  // Serve Swagger docs
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))

  // Set up a morgan logger using the dev format for log entries.
  app.use(logger('dev'))

  // Parse requests of the content type application/json.
  app.use(express.json())

  // Use the cookie-parser middleware
  app.use(cookieParser())

  // Production settings.
  if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // Running behind reverse proxy, trust first proxy
  }

  // Register routes.
  app.use('/', router)

  // Error handler.
  app.use(function (err, req, res, next) {
    // 404 Not Found.
    if (err.status === 404) {
      return res
        .status(404)
        .end()
    }

    // 500 Internal Server Error.
    // In development, include error details.
    if (req.app.get('env') === 'development') {
      return res
        .status(err.status || 500)
        .json({ error: err })
    }

    // In production, just send the status code.
    return res
      .status(err.status || 500)
      .end()
  })

  return app
}

export default createServer

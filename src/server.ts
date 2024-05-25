/**
 * @file This is the root file that initializes the server.
 * @module src/server
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */
import 'reflect-metadata'
import express, { Request, Response, NextFunction } from 'express'
import { connectToDatabase } from './config/mongoose.js'
import helmet from 'helmet'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import openapiSpecification from './openapiDef.js'
import { container } from './inversify.config.js'
import { TYPES } from './types.js'
import { MainRouter } from './routes/mainRouter.js'
import { HttpError } from './lib/httpError.js'
import cors from 'cors'
import path from 'path'
import url from 'url'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const createServer = async () => {
  // Connect to the database.
  const dbConnectionString = process.env.DB_CONNECTION_STRING;
  if (!dbConnectionString) {
    throw new Error('DB_CONNECTION_STRING is not set');
  }
  await connectToDatabase(dbConnectionString)

  // Create an Express application.
  const app = express()

  // CORS configuration
  const corsOptions = {
    origin: ['https://vassmolösa.se', 'https://vassmolosa.nu', 'http://localhost:3000'],
    optionsSuccessStatus: 200
  }
  app.use(cors(corsOptions))

  // Setup helmet to secure the application.
  app.use(helmet())
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://vassmolösa.se', 'https://vassmolosa.nu'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://vassmolösa.se', 'https://vassmolosa.nu'],
        imgSrc: ["'self'", 'data:', 'https://vassmolösa.se', 'https://vassmolosa.nu', 'https://svenssonom.se'],
        connectSrc: ["'self'", 'https://vassmolösa.se', 'https://vassmolosa.nu', 'https://svenssonom.se', 'http://localhost:3000'],
        frameSrc: ["'self'", 'https://vassmolösa.se', 'https://vassmolosa.nu', 'https://svenssonom.se'],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
      }
    })
  )

  // Serve Swagger docs
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))

  // Serve static files from the uploads directory
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

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
  const mainRouter = container.get<MainRouter>(TYPES.MainRouter)
  app.use('/', mainRouter.getRouter())

  // Error handler.
  app.use(function (err: HttpError, req: Request, res: Response, next: NextFunction) {
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

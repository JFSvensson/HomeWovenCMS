/**
 * @file Defines the main router for the application.
 * @module router
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */

import express, { Request, Response, NextFunction } from 'express'
import { HttpError } from '../lib/httpError'
import { router as v1Router } from './api/v1/router.js'

export const router = express.Router()

router.use('/api/v1', v1Router)

// Route for testing purposes. TODO: Remove before production.
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome, but this is not the API your looking for...' })
})
router.get('/error', (req: Request, res: Response) => {
  res.status(500).end()
})

// Error handling
router.use('*', (req: Request, res: Response, next: NextFunction) => {
  const error = new HttpError('Not Found', 404)
  next(error)
})

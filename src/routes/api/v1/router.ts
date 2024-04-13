/**
 * @file Defines the router for the API.
 * @module router
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */

import express from 'express'
import { router as authRouter } from './authRouter'
import { router as usersRouter } from './usersRouter'
// import { router as webhooksRouter } from './webhooksRouter.js'
import { HateoasMiddleware } from '../../../middleware/hateoasMiddleware'

export const router = express.Router()

const hateoas = new HateoasMiddleware()

/**
 * @openapi
 * /:
 *   get:
 *     summary: Get API status
 *     description: Returns the status of the API and provides dynamical links to other endpoints.
 *     tags:
 *      - Status
 *     responses:
 *       200:
 *         description: API is up and running. 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome to the HomeWoven CMS API.
 *                 documentation:
 *                   type: string
 *                   example: https://vassmolösa.se/docs
 *                 _links:
 *                   type: object
 *                   properties:
 *                     self:
 *                       type: string
 *                       description: The current endpoint.
 *                       example: /
 *                     auth:
 *                       type: string
 *                       description: The authentication endpoint.
 *                       example: /auth
 *                     users:
 *                       type: string
 *                       description: The user data endpoint.
 *                       example: /users
 *                     webhooks:
 *                       type: string
 *                       example: /webhooks
 */
router.get(
  '/',
  hateoas.addLinks,
  (req, res) => {
    res.json({
      message: 'Welcome to the HomeWoven CMS API.',
    })
  }
)

router.use('/auth', authRouter)
router.use('/users', usersRouter)
// router.use('/webhooks', webhooksRouter)

/**
 * @file Defines the router for the API.
 * @module router
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */

import express from 'express'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../../types.js'
import { AuthRouter } from './authRouter.js'
import { UserRouter } from './userRouter.js'
import { ArticleRouter } from './articleRouter.js'
import { FileRouter } from './fileRouter.js'
import { HateoasMiddleware } from '../../../middleware/hateoasMiddleware.js'

@injectable()
export class ApiRouter {
  private authRouter: AuthRouter
  private userRouter: UserRouter
  private articleRouter: ArticleRouter
  private fileRouter: FileRouter
  private hateoasMiddleware: HateoasMiddleware

  constructor(
    @inject(TYPES.AuthRouter) authRouter: AuthRouter,
    @inject(TYPES.UserRouter) userRouter: UserRouter,
    @inject(TYPES.ArticleRouter) articleRouter: ArticleRouter,
    @inject(TYPES.FileRouter) fileRouter: FileRouter,
    @inject(TYPES.HateoasMiddleware) hateoasMiddleware: HateoasMiddleware
  ) {
    this.authRouter = authRouter
    this.userRouter = userRouter
    this.articleRouter = articleRouter
    this.fileRouter = fileRouter
    this.hateoasMiddleware = hateoasMiddleware
  }

  getRouter(): express.Router {
    const router = express.Router()

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
      this.hateoasMiddleware.addLinks,
      (req, res) => {
        res.json({
          message: 'Welcome to the HomeWoven CMS API.',
        })
      }
    )

    router.use('/auth', this.authRouter.getRouter())
    router.use('/users', this.userRouter.getRouter())
    router.use('/articles', this.articleRouter.getRouter())
    router.use('/files', this.fileRouter.getRouter())

    return router
  }
}

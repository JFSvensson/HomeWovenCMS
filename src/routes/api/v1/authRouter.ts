/**
 * @file Defines the authorization router for the application.
 * @module router
 * @author Fredrik Svensson
 * @since 0.1.0
 */

import express from 'express'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../../types.js'
import { AuthController } from '../../../controllers/api/v1/authController.js'
import { AuthMiddleware } from '../../../middleware/authMiddleware.js'
import { HateoasMiddleware } from '../../../middleware/hateoasMiddleware.js'


@injectable()
export class AuthRouter {
  private authController: AuthController
  private authMiddleware: AuthMiddleware
  private hateoasMiddleware: HateoasMiddleware

  constructor(
    @inject(TYPES.AuthController) authController: AuthController,
    @inject(TYPES.AuthMiddleware) authMiddleware: AuthMiddleware,
    @inject(TYPES.HateoasMiddleware) hateoasMiddleware: HateoasMiddleware
  ) {
    this.authController = authController
    this.authMiddleware = authMiddleware
    this.hateoasMiddleware = hateoasMiddleware
  }

  getRouter(): express.Router {
    const router = express.Router()

    /**
     * @openapi
     * /auth/register:
     *   post:
     *    summary: Create a new user
     *    description: Creates a new user in the system.
     *    tags:
     *      - Authorization
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/NewUser'
     *    responses:
     *      '201':
     *        description: User created successfully.
     */
    router.post(
      '/register',
      this.hateoasMiddleware.addLinks,
      (req, res, next) => {
        this.authController.register(req, res, next)
      }
    )

    /**
     * @openapi
     * /auth/login:
     *  post:
     *    summary: Log in to the API
     *    description: Logs in to the API and returns an access token.
     *    tags:
     *      - Authorization
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              username:
     *                type: string
     *                description: The username of the user.
     *              passphrase:
     *                type: string
     *                description: The passphrase of the user.
     *    responses:
     *      '200':
     *        description: User logged in successfully.
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                accessToken:
     *                  type: string
     *                  description: The access token for the user.
     *      '401':
     *        description: Unauthorized.
     */
    router.post(
      '/login',
      this.hateoasMiddleware.addLinks,
      (req, res, next) => this.authController.login(req, res, next)
    )

    /**
     * @openapi
     * /auth/logout:
     *  post:
     *    summary: Log out of the API
     *    description: Logs out of the API and invalidates the access token.
     *    tags:
     *      - Authorization
     *    responses:
     *      '200':
     *        description: User logged out successfully.
     *      '401':
     *        description: Unauthorized.
     */
    router.post(
      '/logout',
      this.hateoasMiddleware.addLinks,
      this.authMiddleware.checkAuthorization.bind(this.authMiddleware),
      (req, res) => this.authController.logout(req, res)
    )

    /**
     * @openapi
     * /auth/refresh:
     *   post:
     *     summary: Refresh access token
     *     description: Refreshes the access token for the user.
     *     tags:
     *       - Authorization
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/RefreshToken'
     *     responses:
     *       '200':
     *         description: Access token refreshed successfully.
     *       '401':
     *         description: Unauthorized.
     */
    router.post(
      '/refresh',
      this.hateoasMiddleware.addLinks,
      this.authMiddleware.checkAuthorization.bind(this.authMiddleware),
      (req, res, next) => this.authController.refresh(req, res, next)
    )

    return router
  }
}

/**
 * @openapi
 * components:
 *  schemas:
 *   NewUser:
 *    type: object
 *    properties:
 *     name:
 *      type: string
 *      description: The user's full name.
 *     email:
 *      type: string
 *      format: email
 *      description: The user's email address.
 *   RefreshToken:
 *    type: object
 *    properties:
 *     refreshToken:
 *      type: string
 *      description: The refresh token for the user.
 */

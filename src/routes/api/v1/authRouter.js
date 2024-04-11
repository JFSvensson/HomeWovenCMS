/**
 * @file Defines the authorization router for the application.
 * @module router
 * @author Fredrik Svensson
 * @since 0.1.0
 */

import express from 'express'
import { AuthController } from '../../../controllers/api/v1/authController.js'
import { AuthMiddleware } from '../../../middleware/authMiddleware.js'
import { HateoasMiddleware } from '../../../middleware/hateoasMiddleware.js'

export const router = express.Router()

const controller = new AuthController()
const checkAuthorization = new AuthMiddleware(controller)
const hateoas = new HateoasMiddleware()

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
  hateoas.addLinks,
  (req, res, next) => controller.register(req, res, next)
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
  hateoas.addLinks,
  (req, res, next) => controller.login(req, res, next)
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
  hateoas.addLinks,
  checkAuthorization.checkAuthorization.bind(checkAuthorization),
  (req, res) => controller.logout(req, res)
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
  hateoas.addLinks,
  checkAuthorization.checkAuthorization.bind(checkAuthorization), 
  (req, res) => controller.refresh(req, res)
)

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

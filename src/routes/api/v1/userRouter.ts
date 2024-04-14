/**
 * @file Defines the users router for the application.
 * @module router
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */
import express from 'express'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../../types'
import { UserController } from '../../../controllers/api/v1/userController'
import { AuthMiddleware } from '../../../middleware/authMiddleware'
import { CheckOwnerMiddleware } from '../../../middleware/checkOwnerMiddleware'
import { HateoasMiddleware } from '../../../middleware/hateoasMiddleware'

@injectable()
export class UserRouter {
  private usersController: UserController
  private authMiddleware: AuthMiddleware
  private checkOwnerMiddleware: CheckOwnerMiddleware
  private hateoasMiddleware: HateoasMiddleware

  constructor(
    @inject(TYPES.UserController) usersController: UserController,
    @inject(TYPES.AuthMiddleware) authMiddleware: AuthMiddleware,
    @inject(TYPES.CheckOwnerMiddleware) checkOwnerMiddleware: CheckOwnerMiddleware,
    @inject(TYPES.HateoasMiddleware) hateoasMiddleware: HateoasMiddleware
  ) {
    this.usersController = usersController
    this.authMiddleware = authMiddleware
    this.checkOwnerMiddleware = checkOwnerMiddleware
    this.hateoasMiddleware = hateoasMiddleware
  }

  getRouter(): express.Router {
    const router = express.Router()


    /**
     * @openapi
     * /users/{id}:
     *   get:
     *     summary: Get information about a specific user
     *     description: Returns information about a specific user in the system.
     *     tags:
     *       - Users
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         schema:
     *           type: string
     *         description: The user's ID.
     *     responses:
     *       '200':
     *         description: Successful response with user information.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       '404':
     *         description: User not found.
     */
    router.get(
      '/:id', 
      this.authMiddleware.checkAuthorization.bind(this.authMiddleware), 
      this.checkOwnerMiddleware.checkOwner.bind(this.checkOwnerMiddleware),
      this.hateoasMiddleware.addLinks,
      (req, res) => this.usersController.getUser(req, res)
    )

    /**
     * @openapi
     * /users/{id}:
     *   put:
     *    summary: Update information about a specific user
     *    description: Updates information about a specific user in the system.
     *    tags:
     *      - Users
     *    parameters:
     *      - name: id
     *        in: path
     *        required: true
     *        schema:
     *          type: string
     *        description: The user's ID.
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/NewUser'
     *    responses:
     *      '200':
     *        description: User updated successfully.
     *      '404':
     *        description: User not found.
     */
    router.put(
      '/:id', 
      this.authMiddleware.checkAuthorization.bind(this.authMiddleware), 
      this.checkOwnerMiddleware.checkOwner.bind(this.checkOwnerMiddleware),
      this.hateoasMiddleware.addLinks,
      (req, res) => this.usersController.updateUser(req, res)
    )

    /**
     * @openapi
     * /users/{id}:
     *   delete:
     *     summary: Delete a specific user
     *     description: Deletes a specific user from the system.
     *     tags:
     *      - Users
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         schema:
     *           type: string
     *         description: The user's ID.
     *     responses:
     *       '200':
     *         description: User deleted successfully.
     *       '404':
     *         description: User not found.
     */
    router.delete(
      '/:id', 
      this.authMiddleware.checkAuthorization.bind(this.authMiddleware), 
      this.checkOwnerMiddleware.checkOwner.bind(this.checkOwnerMiddleware),
      this.hateoasMiddleware.addLinks,
      (req, res) => this.usersController.deleteUser(req, res)
    )

    return router
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The user's ID.
 *         name:
 *           type: string
 *           description: The user's full name.
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address.
 */

/**
 * @file Defines the file router for the application.
 * @module router
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */
import express from 'express'

import { inject, injectable } from 'inversify'
import { TYPES } from '../../../types.js'
import { FileController } from '../../../controllers/api/v1/fileController.js'
import { AuthMiddleware } from '../../../middleware/authMiddleware.js'
import { CheckOwnerMiddleware } from '../../../middleware/checkOwnerMiddleware.js'
import { HateoasMiddleware } from '../../../middleware/hateoasMiddleware.js'

@injectable()
export class FileRouter {
  private fileController: FileController
  private authMiddleware: AuthMiddleware
  private checkOwnerMiddleware: CheckOwnerMiddleware
  private hateoasMiddleware: HateoasMiddleware

  constructor(
    @inject(TYPES.FileController) fileController: FileController,
    @inject(TYPES.AuthMiddleware) authMiddleware: AuthMiddleware,
    @inject(TYPES.CheckOwnerMiddleware) checkOwnerMiddleware: CheckOwnerMiddleware,
    @inject(TYPES.HateoasMiddleware) hateoasMiddleware: HateoasMiddleware
  ) {
    this.fileController = fileController
    this.authMiddleware = authMiddleware
    this.checkOwnerMiddleware = checkOwnerMiddleware
    this.hateoasMiddleware = hateoasMiddleware
  }

  getRouter(): express.Router {
    const router = express.Router()


    /**
     * @openapi
     * /files/{id}:
     *   get:
     *     summary: Get information about a specific file
     *     description: Returns information about a specific file in the system.
     *     tags:
     *       - File
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         schema:
     *           type: string
     *         description: The file's ID.
     *     responses:
     *       '200':
     *         description: Successful response with file information.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/File'
     *       '404':
     *         description: File not found.
     */
    router.get(
      '/:id', 
      this.authMiddleware.checkAuthorization.bind(this.authMiddleware), 
      this.checkOwnerMiddleware.checkOwner.bind(this.checkOwnerMiddleware),
      this.hateoasMiddleware.addLinks,
      (req, res) => this.fileController.getFile(req, res)
    )

    
    /**
     * @openapi
     * /files:
     *   post:
     *    summary: Add a file
     *    description: Add a file to the system.
     *    tags:
     *      - File
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/File'
     *    responses:
     *      '200':
     *        description: File created successfully.
     *      '401':
     *        description: Unauthorized.
     */
    router.post(
      '/', 
      this.authMiddleware.checkAuthorization.bind(this.authMiddleware), 
      this.checkOwnerMiddleware.checkOwner.bind(this.checkOwnerMiddleware),
      this.hateoasMiddleware.addLinks,
      (req, res) => this.fileController.createFile(req, res)
    )

    /**
     * @openapi
     * /files/{id}:
     *   put:
     *    summary: Update information for a specific file
     *    description: Updates information for a specific file in the system.
     *    tags:
     *      - File
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
     *            $ref: '#/components/schemas/File'
     *    responses:
     *      '200':
     *        description: File updated successfully.
     *      '404':
     *        description: File not found.
     */
    router.put(
      '/:id', 
      this.authMiddleware.checkAuthorization.bind(this.authMiddleware), 
      this.checkOwnerMiddleware.checkOwner.bind(this.checkOwnerMiddleware),
      this.hateoasMiddleware.addLinks,
      (req, res) => this.fileController.updateFile(req, res)
    )

    /**
     * @openapi
     * /files/{id}:
     *   delete:
     *     summary: Delete a specific file
     *     description: Deletes a specific file from the system.
     *     tags:
     *      - File
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         schema:
     *           type: string
     *         description: The file's ID.
     *     responses:
     *       '200':
     *         description: File deleted successfully.
     *       '404':
     *         description: File not found.
     */
    router.delete(
      '/:id', 
      this.authMiddleware.checkAuthorization.bind(this.authMiddleware), 
      this.checkOwnerMiddleware.checkOwner.bind(this.checkOwnerMiddleware),
      this.hateoasMiddleware.addLinks,
      (req, res) => this.fileController.deleteFile(req, res)
    )

    return router
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     File:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The file's ID.
 *         url:
 *           type: string
 *           description: The file's location.
 *         description:
 *           type: string
 *           description: A description of the file.
 */

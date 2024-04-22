/**
 * @file Defines the article router for the application.
 * @module router
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */
import express from 'express'

import { inject, injectable } from 'inversify'
import { TYPES } from '../../../types.js'
import { ArticleController } from '../../../controllers/api/v1/articleController.js'
import { AuthMiddleware } from '../../../middleware/authMiddleware.js'
import { CheckOwnerMiddleware } from '../../../middleware/checkOwnerMiddleware.js'
import { HateoasMiddleware } from '../../../middleware/hateoasMiddleware.js'

@injectable()
export class ArticleRouter {
  private articleController: ArticleController
  private authMiddleware: AuthMiddleware
  private checkOwnerMiddleware: CheckOwnerMiddleware
  private hateoasMiddleware: HateoasMiddleware

  constructor(
    @inject(TYPES.UserController) articleController: ArticleController,
    @inject(TYPES.AuthMiddleware) authMiddleware: AuthMiddleware,
    @inject(TYPES.CheckOwnerMiddleware) checkOwnerMiddleware: CheckOwnerMiddleware,
    @inject(TYPES.HateoasMiddleware) hateoasMiddleware: HateoasMiddleware
  ) {
    this.articleController = articleController
    this.authMiddleware = authMiddleware
    this.checkOwnerMiddleware = checkOwnerMiddleware
    this.hateoasMiddleware = hateoasMiddleware
  }

  getRouter(): express.Router {
    const router = express.Router()


    /**
     * @openapi
     * /articles/{id}:
     *   get:
     *     summary: Get information about a specific article
     *     description: Returns information about a specific article in the system.
     *     tags:
     *       - Article
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         schema:
     *           type: string
     *         description: The article's ID.
     *     responses:
     *       '200':
     *         description: Successful response with article information.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Article'
     *       '404':
     *         description: Article not found.
     */
    router.get(
      '/:id', 
      this.authMiddleware.checkAuthorization.bind(this.authMiddleware), 
      this.checkOwnerMiddleware.checkOwner.bind(this.checkOwnerMiddleware),
      this.hateoasMiddleware.addLinks,
      (req, res) => this.articleController.getArticle(req, res)
    )

    
    /**
     * @openapi
     * /articles}:
     *   post:
     *    summary: Add an article
     *    description: Add an article to the system.
     *    tags:
     *      - Article
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/Article'
     *    responses:
     *      '200':
     *        description: Article created successfully.
     *      '401':
     *        description: Unauthorized.
     */
    router.post(
      '/', 
      this.authMiddleware.checkAuthorization.bind(this.authMiddleware), 
      this.checkOwnerMiddleware.checkOwner.bind(this.checkOwnerMiddleware),
      this.hateoasMiddleware.addLinks,
      (req, res) => this.articleController.createArticle(req, res)
    )

    /**
     * @openapi
     * /articles/{id}:
     *   put:
     *    summary: Update information in a specific article
     *    description: Updates information in a specific article in the system.
     *    tags:
     *      - Article
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
     *            $ref: '#/components/schemas/Article'
     *    responses:
     *      '200':
     *        description: Article updated successfully.
     *      '404':
     *        description: Article not found.
     */
    router.put(
      '/:id', 
      this.authMiddleware.checkAuthorization.bind(this.authMiddleware), 
      this.checkOwnerMiddleware.checkOwner.bind(this.checkOwnerMiddleware),
      this.hateoasMiddleware.addLinks,
      (req, res) => this.articleController.updateArticle(req, res)
    )

    /**
     * @openapi
     * /articles/{id}:
     *   delete:
     *     summary: Delete a specific article
     *     description: Deletes a specific article from the system.
     *     tags:
     *      - Article
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         schema:
     *           type: string
     *         description: The article's ID.
     *     responses:
     *       '200':
     *         description: Article deleted successfully.
     *       '404':
     *         description: Article not found.
     */
    router.delete(
      '/:id', 
      this.authMiddleware.checkAuthorization.bind(this.authMiddleware), 
      this.checkOwnerMiddleware.checkOwner.bind(this.checkOwnerMiddleware),
      this.hateoasMiddleware.addLinks,
      (req, res) => this.articleController.deleteArticle(req, res)
    )

    return router
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The article's ID.
 *         title:
 *           type: string
 *           description: The article's title.
 *         body:
 *           type: string
 *           description: The body of the article.
 *         imageUrl:
 *           type: string
 *           description: The URL to the image of the article.
 */

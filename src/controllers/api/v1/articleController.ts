/**
 * @file Defines the article controller for the application.
 * @module controller
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */
import { injectable } from 'inversify'
import { Request } from '../../../interfaces/request.js'
import { Response } from '../../../interfaces/response.js'
import { ArticleService } from '../../../services/api/v1/articleService.js'
import { JwtPayload } from 'jsonwebtoken'

/**
 * Handles requests for article data.
 */
@injectable()
export class ArticleController {
  private articleService: ArticleService

  constructor() {
    this.articleService = new ArticleService()
  }

  /**
   * Get a specific article.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {void}
   * @throws {Error} Throws an error if the user is not found.
   * @throws {Error} Throws an error if an error occurs while fetching the user.
   */
  async getArticle(req: Request, res: Response) {
    try {
      const response = await this.articleService.getArticle(req.params.id)
      if (!response) {
        return res.status(404).json({ message: 'Article not found' })
      }
      res.json(response)
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while fetching the article' })
    }
  }

  /**
   * Create an article.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {void}
   * @throws {Error} Throws an error if the user is not found.
   * @throws {Error} Throws an error if an error occurs while updating the user.
   */
    async createArticle(req: Request, res: Response) {
      try {
        let userId = (req.user as JwtPayload)?.sub || ''
        const response = await this.articleService.createArticle(req.body, userId)
        if (!response.article) {
          return res.status(404).json({ message: 'Article not found' })
        }
        res.json(response)
      } catch (error) {
        res.status(500).json({ message: 'An error occurred while creating the article' })
      }
    }

  /**
   * Update a specific article.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {void}
   * @throws {Error} Throws an error if the user is not found.
   * @throws {Error} Throws an error if an error occurs while updating the user.
   */
  async updateArticle(req: Request, res: Response) {
    try {
      const response = await this.articleService.updateArticle(req.params.id, req.body)
      if (!response.article) {
        return res.status(404).json({ message: 'Article not found' })
      }
      res.json(response)
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while updating the article' })
    }
  }

  /**
   * Delete a specific article.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {void}
   * @throws {Error} Throws an error if the user is not found.
   * @throws {Error} Throws an error if an error occurs while deleting the user.
   */
  async deleteArticle(req: Request, res: Response) {
    try {
      const response = await this.articleService.deleteArticle(req.params.id)
      if (!response.article) {
        return res.status(404).json({ message: 'Article not found' })
      }
      res.json(response)
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while deleting the article' })
    }
  }
}

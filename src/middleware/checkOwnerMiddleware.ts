/**
 * @file Defines the check owner middleware for the application.
 * @module middleware
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */
import { injectable } from 'inversify'
import { Response, NextFunction } from 'express'
import { Request } from '../interfaces/request.js'
import { JwtPayload } from 'jsonwebtoken'
import { Article } from '../models/article.js'

@injectable()
export class CheckOwnerMiddleware {

  /**
   * Middleware to check if the request is authorized.
   * If the user is not the owner of the requested resource, a 403 Forbidden response is sent.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {void}
   */
  async checkOwner(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as JwtPayload)?.sub
  
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: No user found' })
      }

      if (req.params.id) {
        // Check ownership of a single article
        const articleOwner = await Article.findById(req.params.id).select('owner')
  
        if (!articleOwner) {
          return res.status(404).json({ message: 'Not Found: Article not found' })
        }
  
        const isOwner = this.isOwner(userId, articleOwner.owner)
  
        if (!isOwner) {
          return res.status(403).json({ message: 'Forbidden: You can only access your own data' })
        }

      } else {
        // Retrieve all articles owned by the user
        const articles = await Article.find({ owner: userId }).select('owner')
  
        for (const article of articles) {
          const isOwner = this.isOwner(userId, article.owner)
  
          if (!isOwner) {
            return res.status(403).json({ message: 'Forbidden: You can only access your own data' })
          }
        }

        if (!articles) {
          return res.status(404).json({ message: 'Not Found: No articles found for this user' })
        }
      }
  
      next()
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while checking the owner' })
    }
  }

  isOwner(userIdFromToken: any, userIdFromResource: any) {
    return userIdFromToken.toString() === userIdFromResource.toString()
  }
}

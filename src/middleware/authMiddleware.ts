/**
 * @file Defines the authorization middleware for the application.
 * @module middleware
 * @author Fredrik Svensson 
 * @version 0.1.0
 * @since 0.1.0
 */
import { Response, NextFunction } from 'express'
import { Request } from '../interfaces/request'
import { injectable } from 'inversify'
import jwt from 'jsonwebtoken'
import { tokenBlacklist } from '../config/tokenBlacklist.js'

@injectable()
export class AuthMiddleware {

  /**
   * Middleware to check if the request is authorized.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @param {NextFunction} next - The next middleware function.
   * @throws {Error} Throws an error if the token is blacklisted.
   */
  checkAuthorization(req: Request, res: Response, next: NextFunction) {
    // Extract the token from the Authorization header ("Bearer <token>"").
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    if (tokenBlacklist.isListed(token)) {
      return res.status(401).json({ message: 'Token is blacklisted' })
    }

    try {
      const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
      if (!accessTokenSecret) {
        throw new Error('ACCESS_TOKEN_SECRET is not set')
      }
      const userData = jwt.verify(token, accessTokenSecret.replace(/\\n/g, '\n'), { algorithms: ['RS256'] })
      req.user = userData // Add the user data to the request object for use in other middleware functions.
      next()
    } catch (error) {
      res.status(401).json({ message: 'Unauthorized' })
    }
  }
}

/**
 * @file Defines the check owner middleware for the application.
 * @module middleware
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */
import { injectable } from 'inversify'
import { Response, NextFunction } from 'express'
import { Request } from '../interfaces/request'

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

    const isOwner = req.user && this.isOwner(req.user.sub, req.params.id)
    if (!isOwner) {
      return res.status(403).json({ message: 'Forbidden: You can only access your own data' })
    }
    next()
  }

  isOwner(userIdFromToken: any, userIdFromResource: any) {
    return userIdFromToken.toString() === userIdFromResource.toString()
  }
}

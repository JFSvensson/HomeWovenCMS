/**
 * @file Defines the authorization controller for the application.
 * @module controller
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */

import { Request, Response, NextFunction } from 'express'
import { Error } from 'mongoose'
import { MongoError } from 'mongodb'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../../types.js'
import { HttpError } from '../../../lib/httpError.js'
import { IUser } from '../../../interfaces/user.js'
import { AuthService } from '../../../services/api/v1/authService.js'
import { tokenBlacklist } from '../../../config/tokenBlacklist.js'

/**
 * Handles requests regarding authorization.
 */
@injectable()
export class AuthController {
  private authService: AuthService

  constructor(@inject(TYPES.AuthService) authService: AuthService) {
    this.authService = authService
  }

  /**
   * Register and create a new user.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @param {NextFunction} next - The next middleware function.
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.authService.createUser(req.body)

      res
        .status(201)
        .json({ id: user.id })
    } catch (error) {
      let err = error as Error
      if (err.name === 'ValidationError') {
        err = new HttpError('The request cannot or will not be processed due to something that is perceived to be a client error (for example validation error).', 400)
      } else if (err.name === 'MongoServerError' && (err as MongoError).code === 11000) {
        err = new HttpError('The username and/or email address is already registered.', 409)
      }

      next(err)
    }
  }

  /**
   * Authenticates a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async login (req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.authService.authenticateUser(req.body.username, req.body.passphrase)
      const nonce = crypto.randomBytes(16).toString('hex')
      const payload = {
        sub: user._id,
        given_name: user.firstName,
        family_name: user.lastName,
        email: user.email,
        nonce: nonce
      }

      const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
      if (!accessTokenSecret) {
        throw new Error('ACCESS_TOKEN_SECRET is not set')
      }
      const accessToken = jwt.sign(payload, accessTokenSecret.replace(/\\n/g, '\n'), {
        algorithm: 'RS256',
        expiresIn: Number(process.env.ACCESS_TOKEN_LIFE)
      })

      const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET
      if (!refreshTokenSecret) {
        throw new Error('REFRESH_TOKEN_SECRET is not set');
      }
      const refreshToken = jwt.sign(payload, refreshTokenSecret.replace(/\\n/g, '\n'), {
        algorithm: 'RS256',
        expiresIn: Number(process.env.REFRESH_TOKEN_LIFE)
      })
      res.cookie('refreshToken', refreshToken, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production' 
      })

      res
        .status(200)
        .json({
          access_token: accessToken,
          refresh_token: refreshToken
        })
    } catch (error) {
      const err = new HttpError('Credentials invalid or not provided.', 401)
      next(err)
    }
  }

  /**
   * Refreshes the access token.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {void}
   * @throws {Error} Throws an error if the token is invalid.
   */
  async refresh(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
      return res.sendStatus(401)
    }
  
    // Check if the refresh token is blacklisted
    if (tokenBlacklist.isListed(refreshToken)) {
      return res.sendStatus(403)
    }

    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET
    if (!refreshTokenSecret) {
      throw new Error('REFRESH_TOKEN_SECRET is not set')
    }

    try {
      jwt.verify(refreshToken, refreshTokenSecret, (err: unknown, decoded: any) => {
        if (err) {
          return res.sendStatus(403)
        }
        const payload = {
          sub: decoded.sub,
          given_name: decoded.given_name,
          family_name: decoded.family_name,
          email: decoded.email,
          nonce: decoded.nonce
        }

        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        if (!accessTokenSecret) {
          throw new Error('ACCESS_TOKEN_SECRET is not set');
        }
        const accessToken = jwt.sign(payload, accessTokenSecret.replace(/\\n/g, '\n'), {
          algorithm: 'RS256',
          expiresIn: process.env.ACCESS_TOKEN_LIFE
        })
    
        res
          .status(200)
          .json({ 
            access_token: accessToken 
          })
      })
    } catch (error) {
      const err = new HttpError('Invalid token.', 403)
      next(err)
    }
  }

  /**
   * Logs out a user.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   */
  logout (req: Request, res: Response) {
    // Get access token from Authorization header and blacklist it.
    const authHeader = req.headers.authorization
    if (authHeader) {
      // Extract the token from the Authorization header ("Bearer <token>"").
      const token = authHeader.split(' ')[1]
      tokenBlacklist.add(token)
    }
    // Get refresh token from cookie and blacklist it.
    const refreshToken = req.cookies.refreshToken
    if (refreshToken) {
      tokenBlacklist.add(refreshToken)
    }

    res
      .status(200)
      .json({
        message: 'Logged out successfully.'
      })
  }
}

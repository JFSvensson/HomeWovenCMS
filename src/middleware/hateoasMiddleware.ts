/**
 * @file Defines the HATEOAS links middleware for the application.
 * @module middleware
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */
import { injectable } from 'inversify'
import { NextFunction } from 'express'
import { Request } from '../interfaces/request.js'
import { Response } from '../interfaces/response.js'

@injectable()
export class HateoasMiddleware {

  /**
   * Middleware to add HATEOAS links to the response object.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {void}
   */
  addLinks(req: Request, res: Response, next: NextFunction) {
    // Define links that should be included in all responses.
    const basicLinks = {
      self: {
        href: req.originalUrl,
        rel: 'self',
        method: 'GET',
        description: 'Current resource.'
      },
      documentation: {
        href: 'https://vassmolösa.se/docs',
        rel: 'documentation',
        description: 'API documentation.'
      }
    }

    // Define dynamic links based on the request.
    let dynamicLinks: any = {}
    
    if (req.originalUrl === '/api/v1/') {
      dynamicLinks.authRegister = {
        href: '/auth/register',
        rel: 'auth',
        method: 'POST',
        description: 'Register user.'
      }
      dynamicLinks.authLogin = {
        href: '/auth/login',
        rel: 'auth',
        method: 'POST',
        description: 'Login user.'
      }
      dynamicLinks.webhooksRegister = { 
        href: '/webhooks/register',
        rel: 'webhooks',
        method: 'POST',
        description: 'Register a new webhook.'
      }
      dynamicLinks.webhooksDelete = {
        href: '/webhooks/remove/:id',
        rel: 'webhooks',
        method: 'DELETE',
        description: 'Remove a webhook.'
      }
    }

    if (req.originalUrl === `/api/v1/users/${req.params.id}` && req.user) {
      dynamicLinks.authLogout = {
        href: '/auth/logout',
        rel: 'auth',
        method: 'POST',
        description: 'Logout user.'
      }
      dynamicLinks.authRefresh = {
        href: '/auth/refresh',
        rel: 'auth',
        method: 'POST',
        description: 'Refresh access token.'
      }
      dynamicLinks.usersGet = {
        href: `/users/${req.params.id}`,
        rel: 'users',
        method: 'GET',
        description: 'Get information about the user.'
      }
      dynamicLinks.usersUpdate = {
        href: `/users/${req.params.id}`,
        rel: 'users',
        method: 'PUT',
        description: 'Update user information.'
      }
      dynamicLinks.usersDelete = {
        href: `/users/${req.params.id}`,
        rel: 'users',
        method: 'DELETE',
        description: 'Delete user.'
      }
    }

    // Combine the links.
    let links = {
      _links: {
        ...basicLinks,
        ...dynamicLinks
      }
    }

    if (!res.jsonOverridden) {
      const originalJson = res.json.bind(res)
      res.json = (data) => {
        // If the data is an object and has a toJSON method, call it.
        if (data && typeof data === 'object' && typeof data.toJSON === 'function') {
          data = data.toJSON()
        }
        data = { ...data, ...links }
        originalJson(data)
      }
      res.jsonOverridden = true
    }

    next()
  }
}

/**
 * Mock implementation of the AuthMiddleware class
 */
import 'reflect-metadata'
import { injectable } from 'inversify'
import { Request, Response, NextFunction } from 'express'

@injectable()
export class MockAuthMiddleware {
  checkAuthorization(req: Request, res: Response, next: NextFunction) {
    next()
  }
}

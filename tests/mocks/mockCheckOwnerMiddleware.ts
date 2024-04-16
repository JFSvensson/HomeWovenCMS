/**
 * Mock implementation of the CheckOwnerMiddleware class
 */
import 'reflect-metadata'
import { injectable } from 'inversify'
import { Request, Response, NextFunction } from 'express'

@injectable()
export class MockCheckOwnerMiddleware {
  checkOwner(req: Request, res: Response, next: NextFunction) {
    next()
  }
}

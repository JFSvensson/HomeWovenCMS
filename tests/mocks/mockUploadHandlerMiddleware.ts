/**
 * Mock implementation of the CheckOwnerMiddleware class
 */
import 'reflect-metadata'
import { injectable } from 'inversify'
import { Request, Response, NextFunction } from 'express'

@injectable()
export class MockUploadHandlerMiddleware {
  uploadHandler(req: Request, res: Response, next: NextFunction) {
    next()
  }
}

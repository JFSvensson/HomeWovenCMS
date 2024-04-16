/**
 * Mock implementation of the UserController class
 */
import 'reflect-metadata'
import { injectable } from 'inversify'
import { Request, Response, NextFunction } from 'express'

@injectable()
export class MockUserController {
  async getUser(req: Request, res: Response) {
    if (req.params.id === '1234567890') {
      res.json({ id: '1234567890' })
      return
    }
    res.status(404).json({ message: 'User not found' })
  }

  async updateUser(req: Request, res: Response) {
    if (req.params.id === '1234567890') {
      res.json({ id: '1234567890', name: req.body.name, email: req.body.email})
      return
    }
    res.status(404).json({ message: 'User not found' })
  }

  async deleteUser(req: Request, res: Response) {
    if (req.params.id === '1234567890') {
      res.json({ id: '1234567890' })
      return
    }
    res.status(404).json({ message: 'User not found' })
  }
}
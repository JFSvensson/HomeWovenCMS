/**
 * Mock implementation of the ArticleController class
 */
import 'reflect-metadata'
import { injectable } from 'inversify'
import { Request, Response, NextFunction } from 'express'

@injectable()
export class MockFileController {
  async getFile(req: Request, res: Response) {
    if (req.params.id === '1234567890') {
      res.status(200).json({ 
        id: '1234567890',
        url: 'http://example.com/file.jpg',
        description: 'A test file'
      })
      return
    }
    res.status(404).json({ message: 'File not found' })
  }

  async createFile(req: Request, res: Response) {
    if (req.body.url === 'http://example.com/file.jpg' && req.body.description === 'A test file') {
      res.status(201).json({ url: req.body.url, description: req.body.description })
      return
    }
    res.status(404).json({ message: 'File not found' })
  }

  async updateFile(req: Request, res: Response) {
    if (req.params.id === '1234567890') {
      res.json({ id: '1234567890', url: req.body.url, description: req.body.description })
      return
    }
    res.status(404).json({ message: 'File not found' })
  }

  async deleteFile(req: Request, res: Response) {
    if (req.params.id === '1234567890') {
      res.json({ id: '1234567890' })
      return
    }
    res.status(404).json({ message: 'File not found' })
  }
}
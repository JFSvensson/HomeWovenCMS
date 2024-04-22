/**
 * Mock implementation of the ArticleController class
 */
import 'reflect-metadata'
import { injectable } from 'inversify'
import { Request, Response, NextFunction } from 'express'

@injectable()
export class MockArticleController {
  async getArticle(req: Request, res: Response) {
    if (req.params.id === '1234567890') {
      res.status(200).json({ id: '1234567890' })
      return
    }
    res.status(404).json({ message: 'Article not found' })
  }

  async createArticle(req: Request, res: Response) {
    if (req.body.title === 'Title' && req.body.body === 'Body of the article' && req.body.imageUrl === 'image.jpg') {
      res.status(201).json({ title: req.body.title, body: req.body.body, imageUrl: req.body.imageUrl })
      return
    }
    res.status(404).json({ message: 'Article not found' })
  }

  async updateArticle(req: Request, res: Response) {
    if (req.params.id === '1234567890') {
      res.json({ id: '1234567890', title: req.body.title, body: req.body.body, imageUrl: req.body.imageUrl })
      return
    }
    res.status(404).json({ message: 'Article not found' })
  }

  async deleteArticle(req: Request, res: Response) {
    if (req.params.id === '1234567890') {
      res.json({ id: '1234567890' })
      return
    }
    res.status(404).json({ message: 'Article not found' })
  }
}
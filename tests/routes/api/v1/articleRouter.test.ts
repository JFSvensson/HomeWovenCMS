import request from 'supertest'
import 'reflect-metadata'
import express from 'express'
import { container } from '../../../../src/inversify.config.js'
import { TYPES } from '../../../../src/types.js'
import { MockArticleController } from '../../../mocks/mockArticleController.js'
import { MockAuthMiddleware } from '../../../mocks/mockAuthMiddleware.js'
import { MockCheckOwnerMiddleware } from '../../../mocks/mockCheckOwnerMiddleware.js'
import { ArticleRouter } from '../../../../src/routes/api/v1/articleRouter.js'

let app : any

beforeEach(() => {
  container.rebind(TYPES.ArticleController).to(MockArticleController)
  container.rebind(TYPES.AuthMiddleware).to(MockAuthMiddleware)
  container.rebind(TYPES.CheckOwnerMiddleware).to(MockCheckOwnerMiddleware)
  app = express()
  app.use(express.json())
  const articleRouter = container.get<ArticleRouter>(TYPES.ArticleRouter)
  app.use(articleRouter.getRouter())
})

describe('ArticleRouter', () => {
  it('GET /:id should respond with a 200 and the requested article', async () => {
    const id = '1234567890'
    const response = await request(app).get(`/${id}`)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id', id)
  })

  it('POST should respond with a 201 and the created article', async () => {
    const article = { title: 'Title', body: 'Body of the article', imageUrl: 'image.jpg'}
    const response = await request(app).post('/').send(article)
    expect(response.status).toBe(201)
    expect(response.body.title).toEqual(article.title)
    expect(response.body.body).toEqual(article.body)
    expect(response.body.imageUrl).toEqual(article.imageUrl)
  })

  it('PUT /:id should respond with a 200 and the updated article', async () => {
    const id = '1234567890'
    const updatedArticle = { title: 'Updated Article', body: 'updated body', imageUrl: 'updated.jpg'}
    const response = await request(app).put(`/${id}`).send(updatedArticle)
    expect(response.status).toBe(200)
    expect(response.body.title).toEqual(updatedArticle.title)
    expect(response.body.body).toEqual(updatedArticle.body)
    expect(response.body.imageUrl).toEqual(updatedArticle.imageUrl)
  })

  it('DELETE /:id should respond with a 200', async () => {
    const id = '1234567890'
    const response = await request(app).delete(`/${id}`)
    expect(response.status).toBe(200)
  })
})
import request from 'supertest'
import 'reflect-metadata'
import { container } from '../../src/inversify.config'
import { TYPES } from '../../src/types'
import express from 'express'
import { MainRouter } from '../../src/routes/mainRouter'

const app = express()
const mainRouter = container.get<MainRouter>(TYPES.MainRouter)
app.use('/', mainRouter.getRouter())

describe('Routes', () => {
  it('should respond with a 404 error for missing routes', async () => {
    const response = await request(app).get('/missing')
    expect(response.status).toBe(404)
  })

  it('should handle errors', async () => {
    const response = await request(app).get('/error')
    expect(response.status).toBe(500)
  })
})

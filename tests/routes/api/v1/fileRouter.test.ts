import request from 'supertest'
import 'reflect-metadata'
import dotenv from 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser'
import { container } from '../../../../src/inversify.config.js'
import { TYPES } from '../../../../src/types.js'
import { MockFileController } from '../../../mocks/mockFileController.js'
import { MockAuthMiddleware } from '../../../mocks/mockAuthMiddleware.js'
import { MockCheckOwnerMiddleware } from '../../../mocks/mockCheckOwnerMiddleware.js'
import { MockUploadHandlerMiddleware } from '../../../mocks/mockUploadHandlerMiddleware.js'
import { FileRouter } from '../../../../src/routes/api/v1/fileRouter.js'

dotenv.config({ path: '.env.test' })

let app : any

beforeEach(async () => {
  container.rebind(TYPES.FileController).to(MockFileController)
  container.rebind(TYPES.AuthMiddleware).to(MockAuthMiddleware)
  container.rebind(TYPES.CheckOwnerMiddleware).to(MockCheckOwnerMiddleware)
  container.rebind(TYPES.UploadHandler).to(MockUploadHandlerMiddleware)
  app = express()
  app.use(cookieParser())
  app.use(express.json())
  const fileRouter = container.get<FileRouter>(TYPES.FileRouter)
  app.use(fileRouter.getRouter())
})

describe('FileRouter', () => {
  it('GET /:id should return 200 and the file data', async () => {
    const id = '1234567890'
    const response = await request(app).get(`/${id}`)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('url')
    expect(response.body).toHaveProperty('description')
  })

  it('POST /files should return 201 and the created file data', async () => {
    const file = { 
      url: 'http://example.com/file.jpg',
      description: 'A test file'
    }
    const response = await request(app).post('/').send(file)
    expect(response.status).toBe(201)
    expect(response.body.url).toEqual(file.url)
    expect(response.body.description).toEqual(file.description)
  })
})

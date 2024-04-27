import 'reflect-metadata'
import request from 'supertest'
import express from 'express'
import path from 'path'
import url from 'url'
import { UploadHandler } from '../../src/middleware/uploadHandlerMiddleware.js'

const app = express()
const uploadHandler = new UploadHandler()

app.post('/upload', uploadHandler.uploadHandler)

describe('UploadHandler Middleware', () => {
  it('should upload a file successfully', async () => {
    const __filename = url.fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const filePath = path.join(__dirname, 'TestImage.jpg')
    const response = await request(app)
      .post('/upload')
      .attach('file', filePath)

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('File uploaded successfully')
  })
})
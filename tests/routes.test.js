import request from 'supertest'
import express from 'express'
import { router } from '../src/routes/router.js'

const app = express()
app.use(router)

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

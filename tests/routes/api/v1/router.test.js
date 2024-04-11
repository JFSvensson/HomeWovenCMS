import request from 'supertest'
import express from 'express'
import { router } from '../../../../src/routes/api/v1/router.js'

const app = express()
app.use(router)

describe('Routes', () => {
  it('GET / should respond with a 200', async () => {
    const response = await request(app).get('/')
    expect(response.status).toBe(200)
  })
})

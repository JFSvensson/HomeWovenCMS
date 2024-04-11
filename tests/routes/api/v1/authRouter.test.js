import request from 'supertest'
import createServer from '../../../../src/server.js'
import dotenv from 'dotenv'
import express from 'express'
import { disconnectFromDatabase } from '../../../../src/config/mongoose.js'
import { router } from '../../../../src/routes/api/v1/authRouter.js'

dotenv.config({ path: '.env.test' })

let app

beforeAll(async () => {
  app = await createServer()
  app = express()
  app.use(express.json())
  app.use(router)
})

describe('Routes', () => {
  it('GET /nonexistent should respond with a 404', async () => {
    const response = await request(app).get('/nonexistent')
    expect(response.status).toBe(404)
  })
  
  it('GET / should respond with a 404', async () => {
    const response = await request(app).get('/')
    expect(response.status).toBe(404)
  })

  it('POST / should respond with a 404', async () => {
    const response = await request(app).get('/')
    expect(response.status).toBe(404)
  })

  it('POST /register should respond with a 201 for valid data', async () => {
    const data = {
      username: 'testusername',
      passphrase: 'testpassphrase',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com'
    }
    const response = await request(app).post('/register').send(data)
    expect(response.status).toBe(201)
  }, 10000)

})

afterAll(async () => {
  await disconnectFromDatabase()
})

import request from 'supertest'
import createServer from '../../../../src/server.js'
import dotenv from 'dotenv'
import express from 'express'
import { disconnectFromDatabase } from '../../../../src/config/mongoose.js'
import { User } from '../../../../src/models/user.js'
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
  })

  it('POST /register should respond with a 409 for duplicate data', async () => {
    const data = {
      username: 'testusername',
      passphrase: 'testpassphrase',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com'
    }
    const response = await request(app).post('/register').send(data)
    expect(response.status).toBe(409)
  })

  it('POST /register should respond with a 400 for too short passphrase', async () => {
    const data = {
      username: 'testusername',
      passphrase: 'short',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com'
    }
    const response = await request(app).post('/register').send(data)
    expect(response.status).toBe(400)
  })

  it('POST /register should respond with a 400 for invalid email', async () => {
    const data = {
      username: 'testusername',
      passphrase: 'testpassphrase',
      firstName: 'Test',
      lastName: 'User',
      email: 'nomail'
    }
    const response = await request(app).post('/register').send(data)
    expect(response.status).toBe(400)
  })

  it('POST /login should respond with a 200 for valid data', async () => {
    const data = {
      username: 'testusername',
      passphrase: 'testpassphrase'
    }
    const response = await request(app).post('/login').send(data)
    expect(response.status).toBe(200)
  })

  it('POST /login should respond with a 401 for invalid username', async () => {
    const data = {
      username: 'wrongusername',
      passphrase: 'testpassphrase'
    }
    const response = await request(app).post('/login').send(data)
    expect(response.status).toBe(401)
  })

  it('POST /login should respond with a 401 for invalid passphrase', async () => {
    const data = {
      username: 'testusername',
      passphrase: 'wrongpassphrase'
    }
    const response = await request(app).post('/login').send(data)
    expect(response.status).toBe(401)
  })

})

afterAll(async () => {
  await User.deleteMany({})
  await disconnectFromDatabase()
})

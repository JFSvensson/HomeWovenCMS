import request from 'supertest'
import 'reflect-metadata'
import dotenv from 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser'
import { container } from '../../../../src/inversify.config.js'
import { TYPES } from '../../../../src/types.js'
import { MockAuthController } from '../../../mocks/mockAuthController.js'
import { MockAuthMiddleware } from '../../../mocks/mockAuthMiddleware.js'
import { AuthRouter } from '../../../../src/routes/api/v1/authRouter.js'

dotenv.config({ path: '.env.test' })

let app : any

beforeEach(async () => {
  container.rebind(TYPES.AuthController).to(MockAuthController)
  container.rebind(TYPES.AuthMiddleware).to(MockAuthMiddleware)
  app = express()
  app.use(cookieParser())
  app.use(express.json())
  const authRouter = container.get<AuthRouter>(TYPES.AuthRouter)
  app.use(authRouter.getRouter())
})

function getNewUserData() {
  return {
    username: 'testusername',
    passphrase: 'testpassphrase',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@test.com'
  }
}

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
    const response = await request(app).post('/')
    expect(response.status).toBe(404)
  })

  it('POST /register should respond with a 201 and id for valid data', async () => {
    const response = await request(app).post('/register').send(getNewUserData())
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
  })

  it('POST /register should respond with a 400 for missing data', async () => {
    const userData = {}
    const response = await request(app).post('/register').send(userData)
    expect(response.status).toBe(400)
  })

  it('POST /register should respond with a 400 for too short passphrase', async () => {
    const userData = getNewUserData()
    userData.passphrase = 'short'
    const response = await request(app).post('/register').send(userData)
    expect(response.status).toBe(400)
  })

  it('POST /register should respond with a 400 for invalid email', async () => {
    const userData = getNewUserData()
    userData.email = 'noemail'
    const response = await request(app).post('/register').send(userData)
    expect(response.status).toBe(400)
  })

  it ('POST /register should respond with a 409 for existing user', async () => {
    const userData = getNewUserData()
    userData.username = 'existingUser'
    const response = await request(app).post('/register').send(userData)
    expect(response.status).toBe(409)
  })

  it('POST /login should respond with a 200 and tokens for valid data', async () => {
    const userData = getNewUserData()
    const response = await request(app)
      .post('/login')
      .send( {username: userData.username, passphrase: userData.passphrase} )
    expect(response.status).toBe(200)
  
    // Check the response body
    expect(response.body).toHaveProperty('access_token')
    expect(response.body).toHaveProperty('refresh_token')
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

  it('POST /refresh should respond with a 200 and a new token for valid data', async () => {
    const data = {
      access_token: 'access_token',
      refresh_token: 'refresh_token'
    }
    const response = await request(app)
      .post('/refresh')
      .set('Cookie', [`refreshToken=${data.refresh_token}`])
      .send(data)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('access_token')
  })

  it('POST /refresh should respond with a 403 for blacklisted token', async () => {
    const data = {
      access_token: 'access_token',
      refresh_token: 'blacklisted_token'
    }
    const response = await request(app)
      .post('/refresh')
      .set('Cookie', [`refreshToken=${data.refresh_token}`])
      .send(data)

    expect(response.status).toBe(403)
  })

  it('POST /refresh should respond with a 401 for missing refresh token', async () => {
    const data = {
      access_token: 'access_token',
    }
    const response = await request(app)
      .post('/refresh')
      .send(data)

    expect(response.status).toBe(401)
  })

  it('POST /refresh should respond with a 403 for invalid refresh token', async () => {
    const data = {
      access_token: 'access_token',
      refresh_token: 'invalid_token'
    }
    const response = await request(app)
      .post('/refresh')
      .set('Cookie', [`refreshToken=${data.refresh_token}`])
      .send(data)

    expect(response.status).toBe(403)
  })

  it('POST /logout should respond with a 200 for valid data', async () => {
    const data = {
      access_token: 'access_token',
      refresh_token: 'refresh_token'
    }

    const response = await request(app)
      .post('/logout')
      .set('Authorization', `Bearer ${data.access_token}`)
      .set('Cookie', [`refreshToken=${data.refresh_token}`])

    expect(response.status).toBe(200)
  })

})

import request from 'supertest'
import 'reflect-metadata'
import createServer from '../../../../src/server.js'
import dotenv from 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser'
import { container } from '../../../../src/inversify.config.js'
import { TYPES } from '../../../../src/types.js'
import { MockAuthService } from '../../../mocks/mockAuthService.js'
import { disconnectFromDatabase } from '../../../../src/config/mongoose.js'
import { User } from '../../../../src/models/user.js'
import { AuthRouter } from '../../../../src/routes/api/v1/authRouter.js'
import { tokenBlacklist } from '../../../../src/config/tokenBlacklist.js'

dotenv.config({ path: '.env.test' })

let app : any

beforeEach(async () => {
  container.rebind(TYPES.AuthService).to(MockAuthService)
  app = await createServer()
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

const createUserAndLogin = async (app : any) => {
  const userData = getNewUserData()
  await request(app).post('/register').send(userData)
  return request(app).post('/login').send({
    username: userData.username,
    passphrase: userData.passphrase
  })
}

describe('Routes', () => {
  it('GET /nonexistent should respond with a 404', async () => {
    const response = await request(app).get('/nonexistent')
    expect(response.status).toBe(404)
  })
  
  it('GET / should respond with a 404', async () => {
    const response = await request(app).get('/auth')
    expect(response.status).toBe(404)
  })

  it('POST / should respond with a 404', async () => {
    const response = await request(app).post('/auth')
    expect(response.status).toBe(404)
  })

  it('POST /register should respond with a 201 and id for valid data', async () => {
    const response = await request(app).post('/api/v1/auth/register').send(getNewUserData())
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
  })

  // it('POST /register should respond with a 409 for duplicate data', async () => {
  //   const userData = getNewUserData()
  //   let response = await request(app).post('/register').send(userData)
  //   response = await request(app).post('/register').send(userData)
  //   expect(response.status).toBe(409)
  // })

  // it('POST /register should respond with a 400 for too short passphrase', async () => {
  //   const userData = getNewUserData()
  //   userData.passphrase = 'short'
  //   const response = await request(app).post('/register').send(userData)
  //   expect(response.status).toBe(400)
  // })

  // it('POST /register should respond with a 400 for invalid email', async () => {
  //   const userData = getNewUserData()
  //   userData.email = 'nomail'
  //   const response = await request(app).post('/register').send(userData)
  //   expect(response.status).toBe(400)
  // })

  // it('POST /login should respond with a 200 and tokens for valid data', async () => {
  //   const response = await createUserAndLogin(app)
  //   expect(response.status).toBe(200)
  
  //   // Check the response body
  //   expect(response.body).toHaveProperty('access_token')
  //   expect(response.body).toHaveProperty('refresh_token')
  // })

  // it('POST /login should respond with a 401 for invalid username', async () => {
  //   const data = {
  //     username: 'wrongusername',
  //     passphrase: 'testpassphrase'
  //   }
  //   const response = await request(app).post('/login').send(data)
  //   expect(response.status).toBe(401)
  // })

  // it('POST /login should respond with a 401 for invalid passphrase', async () => {
  //   const data = {
  //     username: 'testusername',
  //     passphrase: 'wrongpassphrase'
  //   }
  //   const response = await request(app).post('/login').send(data)
  //   expect(response.status).toBe(401)
  // })

  // it('POST /refresh should respond with a 200 and a new token for valid data', async () => {
  //   // First, log in to get the tokens
  //   const loginResponse = await createUserAndLogin(app)
  //   expect(loginResponse.status).toBe(200)
  
  //   // Extract the tokens from the login response
  //   const accessToken = loginResponse.body.access_token
  //   const refreshToken = loginResponse.body.refresh_token
  
  //   // Then, use the refresh token to make a request to the /refresh endpoint
  //   const response = await request(app)
  //     .post('/refresh')
  //     .set('Authorization', `Bearer ${accessToken}`) // Set the access token in the Authorization header
  //     .set('Cookie', `refreshToken=${refreshToken}`) // Set the refresh token in a cookie
  
  //   expect(response.status).toBe(200)
  //   expect(response.body).toHaveProperty('access_token') // The response should contain a new access token
  // })

  // it('POST /refresh should respond with a 403 for blacklisted token', async () => {
  //   // First, log in to get the tokens
  //   const loginResponse = await createUserAndLogin(app)
  //   expect(loginResponse.status).toBe(200)
  
  //   // Extract the tokens from the login response
  //   const accessToken = loginResponse.body.access_token
  //   const refreshToken = loginResponse.body.refresh_token
  
  //   // Blacklist the refresh token
  //   tokenBlacklist.add(refreshToken)

  //   // Then, use the refresh token to make a request to the /refresh endpoint
  //   const response = await request(app)
  //     .post('/refresh')
  //     .set('Authorization', `Bearer ${accessToken}`) // Set the access token in the Authorization header
  //     .set('Cookie', `refreshToken=${refreshToken}`) // Set the refresh token in a cookie
  
  //   expect(response.status).toBe(403)
  // })

  // it('POST /refresh should respond with a 401 for missing refresh token', async () => {
  //   // First, log in to get the tokens
  //   const loginResponse = await createUserAndLogin(app)
  //   expect(loginResponse.status).toBe(200)
  
  //   // Extract the tokens from the login response
  //   const accessToken = loginResponse.body.access_token
  
  //   // Then, use the refresh token to make a request to the /refresh endpoint
  //   const response = await request(app)
  //     .post('/refresh')
  //     .set('Authorization', `Bearer ${accessToken}`) // Set the access token in the Authorization header
  //     .set('Cookie', `refreshToken=`) // Set the refresh token in a cookie
  
  //   expect(response.status).toBe(401)
  // })

  // it('POST /refresh should respond with a 403 for invalid refresh token', async () => {
  //   // First, log in to get the tokens
  //   const loginResponse = await createUserAndLogin(app)
  //   expect(loginResponse.status).toBe(200)
  
  //   // Extract the tokens from the login response
  //   const accessToken = loginResponse.body.access_token
  //   const refreshToken = loginResponse.body.refresh_token
  
  //   // Modify the refresh token to make it invalid
  //   const invalidRefreshToken = refreshToken + 'invalid'

  //   // Then, use the refresh token to make a request to the /refresh endpoint
  //   const response = await request(app)
  //     .post('/refresh')
  //     .set('Authorization', `Bearer ${accessToken}`) // Set the access token in the Authorization header
  //     .set('Cookie', `refreshToken=${invalidRefreshToken}`) // Set the refresh token in a cookie
  
  //   expect(response.status).toBe(403)
  // })

  // it('POST /logout should respond with a 200 for valid data', async () => {
  //   // First, log in to get a token
  //   const loginResponse = await createUserAndLogin(app)
  //   expect(loginResponse.status).toBe(200)
  
  //   // Extract the tokens from the login response
  //   const accessToken = loginResponse.body.access_token
  //   const refreshToken = loginResponse.body.refresh_token
  
  //   // Then, use the tokens to make a request to the /logout endpoint
  //   const response = await request(app)
  //     .post('/logout')
  //     .set('Authorization', `Bearer ${accessToken}`) // Set the token in the Authorization header
  //     .set('Cookie', `refreshToken=${refreshToken}`) // Set the refresh token in a cookie

  //   expect(response.status).toBe(200)
  // })

})

afterEach(async () => {
  await User.deleteMany({})
  await disconnectFromDatabase()
})

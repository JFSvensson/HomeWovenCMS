import 'reflect-metadata'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { container } from '../../../../src/inversify.config.js'
import { TYPES } from '../../../../src/types.js'
import { MockAuthService } from '../../../mocks/mockAuthService.js'
import { AuthController } from '../../../../src/controllers/api/v1/authController.js'
import { Request, Response } from 'express'

dotenv.config({ path: '.env.test' })

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mocked_token'),
}))

container.rebind(TYPES.AuthService).to(MockAuthService)
const authController = container.get<AuthController>(TYPES.AuthController)

function getNewUserData() {
  return {
    username: 'testusername',
    passphrase: 'testpassphrase',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@test.com'
  }
}

const mockRequest = (data: any): Partial<Request> => ({
  body: data
})

const mockResponse = (): Partial<Response> => {
  const res : Partial<Response>= {}
  res.status = jest.fn().mockReturnThis()
  res.json = jest.fn().mockReturnThis()
  res.cookie = jest.fn().mockReturnThis()
  return res
}

describe('AuthController', () => {
  it('should register and create a new user', async () => {
    const req = mockRequest(getNewUserData()) as Request
    const res = mockResponse() as Response
    const next = jest.fn()

    await authController.register(req, res, next)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: expect.any(String) }))
  })

  it('should respond with a 400 for missing data', async () => {
    const req = mockRequest({}) as Request
    const res = mockResponse() as Response
    const next = jest.fn()

    await authController.register(req, res, next)

    expect(next).toHaveBeenCalledWith(new Error('The request cannot or will not be processed due to something that is perceived to be a client error (for example validation error).'))
  })

  it('should authenticate a user and return tokens', async () => {
    const userData = { username: 'testusername', passphrase: 'testpassphrase' }
    const req = mockRequest(userData) as Request
    const res = mockResponse() as Response
    const next = jest.fn()
    
    await authController.login(req, res, next)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      access_token: expect.any(String),
      refresh_token: expect.any(String)
    }))
    expect(res.cookie).toHaveBeenCalledWith('refreshToken', expect.any(String), expect.any(Object))
  });

  it('should handle errors when authentication credentials are incorrect', async () => {
    const req = mockRequest({ username: 'wrong', passphrase: 'credentials' }) as Request
    const res = mockResponse() as Response
    const next = jest.fn()

    await authController.login(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })
})
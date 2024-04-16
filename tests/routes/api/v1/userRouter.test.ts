import request from 'supertest'
import 'reflect-metadata'
import express from 'express'
import { container } from '../../../../src/inversify.config.js'
import { TYPES } from '../../../../src/types.js'
import { MockUserController } from '../../../mocks/mockUserController.js'
import { MockAuthMiddleware } from '../../../mocks/mockAuthMiddleware.js'
import { MockCheckOwnerMiddleware } from '../../../mocks/mockCheckOwnerMiddleware.js'
import { UserRouter } from '../../../../src/routes/api/v1/userRouter.js'

let app : any

beforeEach(() => {
  container.rebind(TYPES.UserController).to(MockUserController)
  container.rebind(TYPES.AuthMiddleware).to(MockAuthMiddleware)
  container.rebind(TYPES.CheckOwnerMiddleware).to(MockCheckOwnerMiddleware)
  app = express()
  app.use(express.json())
  const userRouter = container.get<UserRouter>(TYPES.UserRouter)
  app.use(userRouter.getRouter())
})

describe('UserRouter', () => {
  it('GET /:id should respond with a 200 and the requested user', async () => {
    const id = '1234567890'
    const response = await request(app).get(`/${id}`)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id', id)
  })

  it('PUT /:id should respond with a 200 and the updated user', async () => {
    const id = '1234567890'
    const updatedUser = { name: 'Updated User', email: 'updated@test.com' }
    const response = await request(app).put(`/${id}`).send(updatedUser)
    expect(response.status).toBe(200)
    expect(response.body.name).toEqual(updatedUser.name)
    expect(response.body.email).toEqual(updatedUser.email)
  })

  it('DELETE /:id should respond with a 200', async () => {
    const id = '1234567890'
    const response = await request(app).delete(`/${id}`)
    expect(response.status).toBe(200)
  })
})
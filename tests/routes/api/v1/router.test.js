import request from 'supertest'
import express from 'express'
import { router } from '../../../../src/routes/api/v1/router.js'

const app = express()
app.use(router)

describe('Routes', () => {
  it('GET /nonexistent should respond with a 404', async () => {
    const response = await request(app).get('/nonexistent')
    expect(response.status).toBe(404)
  })
  
  it('GET / should respond with a 200', async () => {
    const response = await request(app).get('/')
    expect(response.status).toBe(200)
  })
})

describe('HATEOAS Middleware', () => {
  it('should add links to the response', async () => {
    const response = await request(app).get('/')
    expect(response.status).toBe(200)
    expect(response.body._links).toBeDefined()
    expect(response.body._links.self).toBeDefined()
  })
})

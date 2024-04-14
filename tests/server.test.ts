import request from 'supertest'
import 'reflect-metadata'
import createServer from '../src/server.js'
import dotenv from 'dotenv'
import { disconnectFromDatabase } from '../src/config/mongoose.js'

dotenv.config({ path: '.env.test' })

let app : any

beforeAll(async () => {
  app = await createServer()
})

describe('Server configuration', () => {
  it('should start an HTTP server', async () => {
    const response = await request(app).get('/')
    expect(response.status).toBe(200)
  })
})

describe('Helmet', () => {
  let response : any
  beforeEach(async () => {
    response = await request(app).get('/')
  })

  it('should set the Content-Security-Policy header', async () => {
    expect(response.headers['content-security-policy']).toBeDefined()
  })
  it('should set the X-DNS-Prefetch-Control header', async () => {
    expect(response.headers['x-dns-prefetch-control']).toBeDefined()
  })
  it('should set the X-Frame-Options header', async () => {
    expect(response.headers['x-frame-options']).toBeDefined()
  })
  it('should set the X-Download-Options header', async () => {
    expect(response.headers['x-download-options']).toBeDefined()
  })
  it('should set the X-Content-Type-Options header', async () => {
    expect(response.headers['x-content-type-options']).toBeDefined()
  })
  it('should set the Referrer-Policy header', async () => {
    expect(response.headers['referrer-policy']).toBeDefined()
  })
  it('should set the X-Permitted-Cross-Domain-Policies header', async () => {
    expect(response.headers['x-permitted-cross-domain-policies']).toBeDefined()
  })
  it('should set the Strict-Transport-Security header', async () => {
    expect(response.headers['strict-transport-security']).toBeDefined()
  })
  it('should set the X-Powered-By header', async () => {
    expect(response.headers['x-powered-by']).toBeUndefined()
  })
  it('should set the Server header', async () => {
    expect(response.headers.server).toBeUndefined()
  })
})

afterAll(async () => {
  await disconnectFromDatabase()
})

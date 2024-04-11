/**
 * OpenAPI definition for the HomeWoven API.
 */
import swaggerJSDoc from "swagger-jsdoc"

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HomeWoven API',
      version: '0.1.0',
      description: 'API for the HomeWoven CMS.',
      contact: {
        name: 'Fredrik Svensson',
        email: 'fs222id@student.lnu.se'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'https://vassmolösa.se',
        description: 'Production server'
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/routes/api/v1/**/*.js']
}

const openapiSpecification = swaggerJSDoc(options)

export default openapiSpecification

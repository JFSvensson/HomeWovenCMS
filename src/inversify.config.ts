import { Container } from 'inversify'
import { TYPES } from './types'
import { AuthService } from './services/api/v1/authService'
import { AuthController } from './controllers/api/v1/authController'
import { UserService } from './services/api/v1/userService'
import { UserController } from './controllers/api/v1/userController'
import { AuthMiddleware } from './middleware/authMiddleware'
import { HateoasMiddleware } from './middleware/hateoasMiddleware'

const container = new Container()
container.bind(TYPES.AuthService).to(AuthService)
container.bind(TYPES.AuthController).to(AuthController)
container.bind(TYPES.UserService).to(UserService)
container.bind(TYPES.UserController).to(UserController)
container.bind(TYPES.AuthMiddleware).to(AuthMiddleware)
container.bind(TYPES.HateoasMiddleware).to(HateoasMiddleware)

export { container }

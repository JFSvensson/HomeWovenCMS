import { Container } from 'inversify'
import { TYPES } from './types'
import { AuthService } from './services/api/v1/authService'
import { AuthController } from './controllers/api/v1/authController'
import { UsersService } from './services/api/v1/userService'
import { UsersController } from './controllers/api/v1/userController'

const container = new Container()
container.bind(TYPES.AuthService).to(AuthService)
container.bind(TYPES.AuthController).to(AuthController)
container.bind(TYPES.UsersService).to(UsersService)
container.bind(TYPES.UsersController).to(UsersController)

export { container }

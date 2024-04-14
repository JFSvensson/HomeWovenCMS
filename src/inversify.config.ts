import { Container } from 'inversify'
import { TYPES } from './types'
import { ApiRouter } from './routes/api/v1/apiRouter'
import { AuthRouter } from './routes/api/v1/authRouter'
import { AuthService } from './services/api/v1/authService'
import { AuthController } from './controllers/api/v1/authController'
import { UserRouter } from './routes/api/v1/userRouter'
import { UserService } from './services/api/v1/userService'
import { UserController } from './controllers/api/v1/userController'
import { AuthMiddleware } from './middleware/authMiddleware'
import { CheckOwnerMiddleware } from './middleware/checkOwnerMiddleware'
import { HateoasMiddleware } from './middleware/hateoasMiddleware'

const container = new Container()
container.bind(TYPES.ApiRouter).to(ApiRouter)
container.bind(TYPES.AuthRouter).to(AuthRouter)
container.bind(TYPES.AuthService).to(AuthService)
container.bind(TYPES.AuthController).to(AuthController)
container.bind(TYPES.UserRouter).to(UserRouter)
container.bind(TYPES.UserService).to(UserService)
container.bind(TYPES.UserController).to(UserController)
container.bind(TYPES.AuthMiddleware).to(AuthMiddleware)
container.bind(TYPES.CheckOwnerMiddleware).to(CheckOwnerMiddleware)
container.bind(TYPES.HateoasMiddleware).to(HateoasMiddleware)

export { container }

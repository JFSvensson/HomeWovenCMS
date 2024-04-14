import { Container } from 'inversify'
import { TYPES } from './types.js'
import { MainRouter } from './routes/mainRouter.js'
import { ApiRouter } from './routes/api/v1/apiRouter.js'
import { AuthRouter } from './routes/api/v1/authRouter.js'
import { AuthService } from './services/api/v1/authService.js'
import { AuthController } from './controllers/api/v1/authController.js'
import { UserRouter } from './routes/api/v1/userRouter.js'
import { UserService } from './services/api/v1/userService.js'
import { UserController } from './controllers/api/v1/userController.js'
import { AuthMiddleware } from './middleware/authMiddleware.js'
import { CheckOwnerMiddleware } from './middleware/checkOwnerMiddleware.js'
import { HateoasMiddleware } from './middleware/hateoasMiddleware.js'

const container = new Container()
container.bind(TYPES.MainRouter).to(MainRouter)
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

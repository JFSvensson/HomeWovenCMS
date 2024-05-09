import { Request as ExpressRequest } from 'express'
import { JwtPayload } from "jsonwebtoken"
import { IUser } from './user.js'

export interface Request extends ExpressRequest {
  user?: string | JwtPayload | IUser
}

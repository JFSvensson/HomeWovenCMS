import { Model } from 'mongoose'
import { IUser } from './user.js'

export interface IUserModel extends Model<IUser> {
  authenticate(username: string, passphrase: string): Promise<IUser>
}

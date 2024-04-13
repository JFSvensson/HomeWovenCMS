import { Document } from 'mongoose'

export interface IUser extends Document{
  username: string
  passphrase: string
  firstName: string
  lastName: string
  email: string
  id: string
}

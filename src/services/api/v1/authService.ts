/**
 * @file Defines the authorization service for the application.
 * @module service
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */
import { injectable } from 'inversify'
import { User } from '../../../models/user.js'

@injectable()
export class AuthService {
  async createUser(userData: any) {
    const user = await User.create(userData)
    return user
  }

  async authenticateUser(username: string, passphrase: string) {
    const user = await User.authenticate(username, passphrase)
    return user
  }
}

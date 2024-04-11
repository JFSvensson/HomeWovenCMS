/**
 * @file Defines the authorization service for the application.
 * @module service
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */

import { User } from '../../../models/user.js'

export class AuthService {
  async createUser(userData) {
    const user = await User.create(userData)
    return user
  }

  async authenticateUser(username, passphrase) {
    const user = await User.authenticate(username, passphrase)
    return user
  }
}

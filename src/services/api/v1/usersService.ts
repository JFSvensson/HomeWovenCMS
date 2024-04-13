/**
 * @file Defines the users service for the application.
 * @module service
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */

import { User } from '../../../models/user.js'

export class UsersService {
  async getUserById(id: any) {
    const user = await User.findById(id).select('-username -passphrase')
    return user
  }

  async updateUser(id: any, data: any) {
    const user = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    return { message: 'User updated successfully', user }
  }

  async deleteUser(id: any) {
    const user = await User.findByIdAndDelete(id)
    return { message: 'User deleted successfully', user }
  }
}

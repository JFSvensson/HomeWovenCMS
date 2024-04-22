/**
 * Mock implementation of the AuthService class
 */
import 'reflect-metadata'
import { injectable } from 'inversify'

@injectable()
export class MockAuthService {
  async createUser(userData: any) {
    if (!userData.username || !userData.passphrase || !userData.firstName || !userData.lastName || !userData.email) {
      throw new Error('The request cannot or will not be processed due to something that is perceived to be a client error (for example validation error).')
    }
    return {    
      username: userData.username,
      passphrase: userData.passphrase,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      id: '1234567890'
    }
  }

  async authenticateUser(username: string, passphrase: string) {
    if (username === 'testusername' && passphrase === 'testpassphrase') {
      return {    
        username: 'testusername',
        passphrase: 'testpassphrase',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@test.com',
        _id: '1234567890'
      }
    } else {
      throw new Error('Incorrect username or passphrase')
    }
  }
}


/**
 * Mock implementation of the AuthService class
 */
import 'reflect-metadata'
import { injectable } from 'inversify'

@injectable()
export class MockAuthService {
  async createUser(userData: any) {
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
    // Instead of authenticating the user with the database, return a mock user
    // You can add logic here to simulate different scenarios, like incorrect username or passphrase
    if (username === 'correctUsername' && passphrase === 'correctPassphrase') {
      return {
        id: 'mockUserId',
        username: username,
        // ... other user data ...
      }
    } else {
      throw new Error('Incorrect username or passphrase')
    }
  }
}

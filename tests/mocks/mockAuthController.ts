
/**
 * Mock implementation of the AuthController class
 */
import 'reflect-metadata'
import { injectable } from 'inversify'
import { Request, Response, NextFunction } from 'express'
import { access } from 'fs'

@injectable()
export class MockAuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    if (Object.keys(req.body).length === 0) {
      res.status(400).send({ error: 'No request body' })
      return
    }
    if (req.body.passphrase.length < 6) {
      res.status(400).send({ error: 'Passphrase too short' })
      return
    }
    if (req.body.email === 'noemail') {
      res.status(400).send({ error: 'No email address' })
      return
    }
    if (req.body.username === 'existingUser') {
      res.status(409).send({ error: 'User already exists' })
      return
    }

    // Check if res.body is valid (equal to username: 'testusername', passphrase: 'testpassphrase', firstName: 'Test', lastName: 'User', email: 'test@test.com')
    // If it is, return a response with status 201 and a JSON object with an id property with the value '1234567890'
    if (
      req.body.username === 'testusername' && 
      req.body.passphrase === 'testpassphrase' && 
      req.body.firstName === 'Test' && 
      req.body.lastName === 'User' && 
      req.body.email === 'test@test.com') {
      res.status(201).json({ id: '1234567890' })
      return
    }
  }

  async login(req: any, res: any, next: any) {
    if (req.body.username === 'wrongusername') {
      res.status(401).send({ error: 'Incorrect username or passphrase' })
      return
    }
    if (req.body.passphrase === 'wrongpassphrase') {
      res.status(401).send({ error: 'Incorrect username or passphrase' })
      return
    }
    if (
      req.body.username === 'testusername' && 
      req.body.passphrase === 'testpassphrase') {
      res.status(200)
        .json({ 
          access_token: 'access_token', 
          refresh_token: 'refresh_token' 
        })
      return
    }
  }

  async refresh(req: any, res: any, next: any) {
    if (!req.cookies.refreshToken) {
      res.status(401).send({ error: 'No refresh token' })
      return
    }
    if (req.cookies.refreshToken === 'blacklisted_token') {
      res.status(403).send({ error: 'Refresh token blacklisted' })
      return
    }
    if (req.cookies.refreshToken !== 'refresh_token') {
      res.status(403).send({ error: 'Invalid refresh token' })
      return
    }
    if (req.cookies.refreshToken === 'refresh_token') {
      res.status(200).json({ access_token: 'access_token_refreshed' })
      return  
    }
  }

  async logout(req: any, res: any, next: any) {
    res.status(200).send({ message: 'Logged out' })
    return
  }

}
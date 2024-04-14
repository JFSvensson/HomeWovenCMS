/**
 * @file Defines the users controller for the application.
 * @module controller
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */

import { Request, Response, NextFunction } from 'express'
import { UsersService } from '../../../services/api/v1/userService'

/**
 * Handles requests for user data.
 */
export class UsersController {
  private usersService: UsersService

  constructor() {
    this.usersService = new UsersService()
  }

  /**
   * Get a specific user.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {void}
   * @throws {Error} Throws an error if the user is not found.
   * @throws {Error} Throws an error if an error occurs while fetching the user.
   */
  async getUser(req: Request, res: Response) {
    try {
      const user = await this.usersService.getUserById(req.params.id)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      res.json(user)
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while fetching the user' })
    }
  }

  /**
   * Update a specific user.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {void}
   * @throws {Error} Throws an error if the user is not found.
   * @throws {Error} Throws an error if an error occurs while updating the user.
   */
  async updateUser(req: Request, res: Response) {
    try {
      const response = await this.usersService.updateUser(req.params.id, req.body)
      if (!response.user) {
        return res.status(404).json({ message: 'User not found' })
      }
      res.json(response)
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while updating the user' })
    }
  }

  /**
   * Delete a specific user.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {void}
   * @throws {Error} Throws an error if the user is not found.
   * @throws {Error} Throws an error if an error occurs while deleting the user.
   */
  async deleteUser(req: Request, res: Response) {
    try {
      const response = await this.usersService.deleteUser(req.params.id)
      if (!response.user) {
        return res.status(404).json({ message: 'User not found' })
      }
      res.json(response)
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while deleting the user' })
    }
  }
}

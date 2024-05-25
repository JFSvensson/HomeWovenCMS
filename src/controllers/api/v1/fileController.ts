/**
 * @file Defines the file controller for the application.
 * @module controller
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */
import { injectable } from 'inversify'
import { Response, NextFunction } from 'express'
import { Request } from '../../../interfaces/request.js'
import { FileService } from '../../../services/api/v1/fileService.js'

/**
 * Handles requests for file data.
 */
@injectable()
export class FileController {
  private fileService: FileService

  constructor() {
    this.fileService = new FileService()
  }

  /**
   * Get a specific file.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {void}
   * @throws {Error} Throws an error if the user is not found.
   * @throws {Error} Throws an error if an error occurs while fetching the user.
   */
  async getFile(req: Request, res: Response) {
    try {
      const response = await this.fileService.getFile(req.params.id)
      if (!response) {
        return res.status(404).json({ message: 'File not found' })
      }
      res.json(response)
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while fetching the file' })
    }
  }

  /**
   * Create a file.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {void}
   * @throws {Error} Throws an error if the user is not found.
   * @throws {Error} Throws an error if an error occurs while updating the user.
   */
    async createFile(req: Request, res: Response) {
      try {
        const response = await this.fileService.createFile(req.body)
        if (!response.file) {
          return res.status(404).json({ message: 'File not found' })
        }
        res.json({
          ...response,
        fileUrl: req.fileUrl
        })
      } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating the file' })
      }
    }

  /**
   * Update a specific file.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {void}
   * @throws {Error} Throws an error if the user is not found.
   * @throws {Error} Throws an error if an error occurs while updating the user.
   */
  async updateFile(req: Request, res: Response) {
    try {
      const response = await this.fileService.updateFile(req.params.id, req.body)
      if (!response.file) {
        return res.status(404).json({ message: 'File not found' })
      }
      res.json(response)
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while updating the file' })
    }
  }

  /**
   * Delete a specific file.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {void}
   * @throws {Error} Throws an error if the user is not found.
   * @throws {Error} Throws an error if an error occurs while deleting the user.
   */
  async deleteFile(req: Request, res: Response) {
    try {
      const response = await this.fileService.deleteFile(req.params.id)
      if (!response.file) {
        return res.status(404).json({ message: 'File not found' })
      }
      res.json(response)
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while deleting the file' })
    }
  }
}

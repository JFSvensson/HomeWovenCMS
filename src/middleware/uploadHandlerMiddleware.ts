/**
 * @file Middleware to handle file uploads using formidable.
 * @module middleware
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */
import { injectable } from 'inversify'
import { Request, Response, NextFunction } from 'express'
import formidable, { Files, Fields } from 'formidable'
import { promises as fsPromises } from 'fs'
import path from 'path'

interface FormidableOptions {
  uploadDir: string
  keepExtensions: boolean
  maxFileSize: number
}

@injectable()
export class UploadHandler {

  /**
   * Middleware to handle file uploads using formidable.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {void}
   */
  async uploadHandler(req: Request, res: Response, next: NextFunction) {
    const options: FormidableOptions = {
      uploadDir: path.join(__dirname, '../uploads'),
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    }

    try {
      const { fields, files } = await this.parseForm(req, options)
      if (!files.file) {
        return res.status(400).json({ message: 'No files were uploaded.' })
      }

      const file = Array.isArray(files.file) ? files.file[0] : files.file
      const newPath = await this.moveFile(file, options.uploadDir)
      res.status(200).json({
        message: 'File uploaded successfully',
        path: newPath,
        fields: fields
      })
    } catch (error) {
      console.error('Error handling the file upload:', error)
      next(error)
    }
  }

  private parseForm(req: Request, options: FormidableOptions): Promise<{fields: Fields, files: Files}> {
    return new Promise((resolve, reject) => {
      const form = formidable(options)
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err)
        } else {
          resolve({ fields, files })
        }
      })
    })
  }

  private async moveFile(file: formidable.File, uploadDir: string): Promise<string> {
    const oldPath = file.filepath
    const newPath = path.join(uploadDir, file.newFilename ?? file.originalFilename ?? 'default_filename')
    await fsPromises.rename(oldPath, newPath)
    return newPath
  }
}

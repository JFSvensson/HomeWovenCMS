/**
 * @file Defines the file service for the application.
 * @module service
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */

import { File } from '../../../models/file.js'

export class FileService {
  async getFile(id: any) {
    const file = await File.findById(id).select('-username -passphrase')
    return file
  }

  async createFile(data: any) {
    const file = await File.create(data)
    return { message: 'File created successfully', file }
  }

  async updateFile(id: any, data: any) {
    const file = await File.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    return { message: 'File updated successfully', file }
  }

  async deleteFile(id: any) {
    const file = await File.findByIdAndDelete(id)
    return { message: 'File deleted successfully', file }
  }
}

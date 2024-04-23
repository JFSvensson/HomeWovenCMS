import { Model } from 'mongoose'
import { IFile } from './file.js'

export interface IFileModel extends Model<IFile> {
  authenticate(username: string, passphrase: string): Promise<IFile>
}

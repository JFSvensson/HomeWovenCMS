import { Document } from 'mongoose'

export interface IFile extends Document{
  url: string
  description: string
  id: string
}

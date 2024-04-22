import { Document } from 'mongoose'

export interface IArticle extends Document{
  title: string
  body: string
  imageUrl: string
  id: string
}

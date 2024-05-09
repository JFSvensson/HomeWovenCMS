import { Document } from 'mongoose'

export interface IArticle extends Document{
  title: string
  body: string
  imageUrl: string
  imageText: string
  id: string
  owner: string
}

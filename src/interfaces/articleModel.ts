import { Model } from 'mongoose'
import { IArticle } from './article.js'

export interface IArticleModel extends Model<IArticle> {
  authenticate(username: string, passphrase: string): Promise<IArticle>
}

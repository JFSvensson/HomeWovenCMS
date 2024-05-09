/**
 * @file Defines the article service for the application.
 * @module service
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */

import { Article } from '../../../models/article.js'

export class ArticleService {

  async getAllArticles(userId: string) {
    const articles = await Article.find({ owner: userId }).select('-username -passphrase')
    return articles
  }

  async getArticle(id: any) {
    const article = await Article.findById(id).select('-username -passphrase')
    return article
  }

  async createArticle(data: any, userId: string) {
    data.owner = userId
    const article = await Article.create(data)
    return { message: 'Article created successfully', article }
  }

  async updateArticle(id: any, data: any) {
    const article = await Article.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    return { message: 'Article updated successfully', article }
  }

  async deleteArticle(id: any) {
    const article = await Article.findByIdAndDelete(id)
    return { message: 'Article deleted successfully', article }
  }
}

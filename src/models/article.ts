/**
 * @file This file defines the Article model.
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */

import mongoose from 'mongoose'
import validator from 'validator'
import { IArticle } from '../interfaces/article'
import { IArticleModel } from '../interfaces/articleModel'

const { isURL } = validator

// Create a schema.
const schema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required.'],
    trim: true,
    minLength: [5, 'The title must be of minimum length 5 characters.'],
    maxLength: [512, 'The title must be of maximum length 512 characters.']
  },
  body: {
    type: String,
    required: [true, 'Body text is required.'],
    minLength: [10, 'The body text must be of minimum length 10 characters.']
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required.'],
    validate: [isURL, 'Please provide a valid URL for the image.']
  },
  imageText: {
    type: String,
    required: [true, 'Image text is required.'],
    trim: true,
    maxLength: [1024, 'The image text must be of maximum length 1024 characters.']
  },
  owner: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    /**
     * Performs a transformation of the resulting object to ensure sensitive information is not serialized.
     *
     * @param {object} doc - The mongoose document which is being converted.
     * @param {object} ret - The plain object representation which has been converted.
     */
    transform: function (doc, ret) {
      delete ret._id
      delete ret.__v
    },
    virtuals: true // ensure virtual fields are serialized
  }
})

schema.virtual('id').get(function () {
  return this._id.toHexString()
})

// Create a model using the schema.
export const Article = mongoose.model<IArticle, IArticleModel>('Article', schema)

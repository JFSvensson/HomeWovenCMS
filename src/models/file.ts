/**
 * @file This file defines the File model.
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */

import mongoose from 'mongoose'
import { IFile } from '../interfaces/file.js'
import { IFileModel } from '../interfaces/fileModel.js'

// Create a schema.
const schema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Image URL is required.'],
  },
  description: {
    type: String,
    required: [true, 'Description is required.'],
    trim: true,
    minLength: [5, 'The description must be of minimum length 5 characters.'],
    maxLength: [1024, 'The description must be of maximum length 512 characters.']
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
export const File = mongoose.model<IFile, IFileModel>('File', schema)

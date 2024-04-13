/**
 * @file This file defines the User model.
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */

import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import validator from 'validator'
import { IUser } from '../interfaces/user'
import { IUserModel } from '../interfaces/userModel'

const { isEmail } = validator

// Create a schema.
const schema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required.'],
    unique: true,
    // - A valid username should start with an alphabet so, [A-Za-z].
    // - All other characters can be alphabets, numbers or an underscore so, [A-Za-z0-9_-].
    // - Since length constraint is 3-256 and we had already fixed the first character, so we give {2, 255}.
    // - We use ^ and $ to specify the beginning and end of matching.
    match: [/^[A-Za-z][A-Za-z0-9_-]{2,255}$/, 'Please provide a valid username.']
  },
  passphrase: {
    type: String,
    minLength: [10, 'The passphrase must be of minimum length 10 characters.'],
    maxLength: [256, 'The passphrase must be of maximum length 256 characters.'],
    required: [true, 'Passphrase is required.'],
    writeOnly: true
  },
  firstName: {
    type: String,
    minLength: [1, 'The first name must be of minimum length 1 characters.'],
    maxLength: [256, 'The first name must be of maximum length 256 characters.'],
    required: [true, 'First name is required.'],
    trim: true
  },
  lastName: {
    type: String,
    minLength: [1, 'The last name must be of minimum length 1 characters.'],
    maxLength: [256, 'The last name must be of maximum length 256 characters.'],
    required: [true, 'Last name is required.'],
    trim: true
  },
  email: {
    type: String,
    maxLength: [254, 'The e-mail must be of maximum length 254 characters.'],
    required: [true, 'Email address is required.'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [isEmail, 'Please provide a valid email address.']
  }
}, {
  timestamps: true,
  toJSON: {
    /**
     * Performs a transformation of the resulting object to remove sensitive information.
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

// Salts and hashes password before save.
schema.pre('save', async function () {
  this.passphrase = await bcrypt.hash(this.passphrase, 10)
})

/**
 * Authenticates a user.
 *
 * @param {string} username - The username.
 * @param {string} passphrase - The passphrase.
 * @returns {Promise<User>} - The user.
 */
schema.statics.authenticate = async function (username, passphrase) {
  const user = await this.findOne({ username })

  // If no user found or password is wrong, throw an error.
  if (!(await bcrypt.compare(passphrase, user?.passphrase))) {
    throw new Error('Invalid credentials.')
  }

  // User found and passphrase correct, return the user.
  return user
}

// Create a model using the schema.
export const User = mongoose.model<IUser, IUserModel>('User', schema)
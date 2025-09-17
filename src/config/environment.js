import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load environment variables based on NODE_ENV
const env = process.env.NODE_ENV || 'development'
dotenv.config({ path: path.resolve(process.cwd(), `.env.${env}`) })
dotenv.config({ path: path.resolve(process.cwd(), '.env') }) // Fallback to default .env

// Type definitions for our configuration
export interface Config {
  NODE_ENV: 'development' | 'test' | 'production'
  PORT: number
  DB_CONNECTION_STRING: string
  ACCESS_TOKEN_SECRET_HW: string
  REFRESH_TOKEN_SECRET_HW: string
  ACCESS_TOKEN_LIFE: number
  REFRESH_TOKEN_LIFE: number
  MAX_FILE_SIZE: number
  UPLOAD_DIR: string
  BCRYPT_ROUNDS: number
  ALLOWED_ORIGINS: string[]
  RATE_LIMIT_WINDOW_MS: number
  RATE_LIMIT_MAX_REQUESTS: number
}

// Validation functions
const validateEnum = <T extends string>(value: string | undefined, validValues: readonly T[], name: string, defaultValue?: T): T => {
  if (!value && defaultValue) return defaultValue
  if (!value) throw new Error(`${name} is required`)
  if (!validValues.includes(value as T)) {
    throw new Error(`${name} must be one of: ${validValues.join(', ')}. Got: ${value}`)
  }
  return value as T
}

const validateString = (value: string | undefined, name: string, minLength: number = 1): string => {
  if (!value) throw new Error(`${name} is required`)
  if (value.length < minLength) throw new Error(`${name} must be at least ${minLength} characters`)
  return value
}

const validateNumber = (value: string | undefined, name: string, defaultValue?: number): number => {
  if (!value && defaultValue !== undefined) return defaultValue
  if (!value) throw new Error(`${name} is required`)
  const num = parseInt(value, 10)
  if (isNaN(num)) throw new Error(`${name} must be a valid number. Got: ${value}`)
  return num
}

const validateStringArray = (value: string | undefined, name: string, defaultValue: string[] = []): string[] => {
  if (!value) return defaultValue
  return value.split(',').map(item => item.trim()).filter(item => item.length > 0)
}

// Validate and create configuration
const createConfig = (): Config => {
  const errors: string[] = []

  try {
    return {
      NODE_ENV: validateEnum(process.env.NODE_ENV, ['development', 'test', 'production'] as const, 'NODE_ENV', 'development'),
      PORT: validateNumber(process.env.PORT, 'PORT', 3000),
      DB_CONNECTION_STRING: validateString(process.env.DB_CONNECTION_STRING, 'DB_CONNECTION_STRING'),
      ACCESS_TOKEN_SECRET_HW: validateString(process.env.ACCESS_TOKEN_SECRET_HW, 'ACCESS_TOKEN_SECRET_HW'),
      REFRESH_TOKEN_SECRET_HW: validateString(process.env.REFRESH_TOKEN_SECRET_HW, 'REFRESH_TOKEN_SECRET_HW'),
      ACCESS_TOKEN_LIFE: validateNumber(process.env.ACCESS_TOKEN_LIFE, 'ACCESS_TOKEN_LIFE', 900),
      REFRESH_TOKEN_LIFE: validateNumber(process.env.REFRESH_TOKEN_LIFE, 'REFRESH_TOKEN_LIFE', 604800),
      MAX_FILE_SIZE: validateNumber(process.env.MAX_FILE_SIZE, 'MAX_FILE_SIZE', 10485760),
      UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
      BCRYPT_ROUNDS: validateNumber(process.env.BCRYPT_ROUNDS, 'BCRYPT_ROUNDS', 12),
      ALLOWED_ORIGINS: validateStringArray(process.env.ALLOWED_ORIGINS, 'ALLOWED_ORIGINS', ['http://localhost:3000']),
      RATE_LIMIT_WINDOW_MS: validateNumber(process.env.RATE_LIMIT_WINDOW_MS, 'RATE_LIMIT_WINDOW_MS', 900000),
      RATE_LIMIT_MAX_REQUESTS: validateNumber(process.env.RATE_LIMIT_MAX_REQUESTS, 'RATE_LIMIT_MAX_REQUESTS', 100)
    }
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error))
  }

  if (errors.length > 0) {
    console.error('❌ Invalid environment variables:')
    errors.forEach(error => console.error(`  - ${error}`))
    process.exit(1)
  }

  // This should never be reached, but TypeScript requires it
  throw new Error('Configuration validation failed')
}

// Create and export the configuration
export const config: Config = createConfig()

console.log(`✅ Environment: ${config.NODE_ENV}`)
console.log(`✅ Configuration loaded successfully`)
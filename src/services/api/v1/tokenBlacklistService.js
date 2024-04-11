/**
 * @file Defines a token blacklist service.
 * @module service
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */
export class TokenBlacklist {
  constructor() {
    this.blacklist = {}
  }

  add(token) {
    this.blacklist[token] = true
  }

  /**
   * Check if a token is blacklisted.
   * @param {string} token - The token to check.
   * @returns {boolean} True if the token is blacklisted, otherwise false.
   */
  isListed(token) {
    return token in this.blacklist
  }
}

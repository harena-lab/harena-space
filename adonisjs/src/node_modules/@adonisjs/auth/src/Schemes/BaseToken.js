'use strict'

/**
 * adonis-auth
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const _ = require('lodash')
const BaseScheme = require('./Base')

/**
 * This scheme is extended by Jwt and API scheme, to share
 * common functionality.
 *
 * @constructor
 * @param {Encryption} Encryption
 */
class BaseTokenScheme extends BaseScheme {
  constructor (Encryption) {
    super()
    this.Encryption = Encryption
  }

  /* istanbul ignore next */
  /**
   * IoC container injections
   *
   * @attribute inject
   * @static
   * @ignore
   *
   * @type {Array}
   */
  static get inject () {
    return ['Adonis/Src/Encryption']
  }

  /**
   * Revokes ( all/an array of multiple ) the tokens for currently logged in user.
   *
   * @method revokeTokens
   *
   * @param  {Array}              [tokens]
   * @param  {Boolean}            [deleteInstead = false]
   *
   * @return {Number}             Number of affected database rows
   *
   * @example
   * ```js
   * await auth.revokeTokens()
   * ```
   *
   * Revoke selected tokens
   * ```js
   * await auth.revokeTokens(['token1', 'token2'])
   * ```
   *
   * Delete instead of just revoking them
   * ```js
   * await auth.revokeTokens(null, true)
   * ```
   */
  async revokeTokens (tokens, deleteInstead) {
    return this.revokeTokensForUser(this.user, tokens, deleteInstead)
  }

  /**
   * Revokes ( all/an array of multiple ) the tokens for a given user.
   *
   * @method revokeTokensForUser
   *
   * @param  {User|Object}        user
   * @param  {Array}              [tokens]
   * @param  {Boolean}            [deleteInstead = false]
   *
   * @return {Number}             Number of affected database rows
   *
   * @example
   * ```js
   * const user = await User.find(1)
   * await auth.revokeTokensForUser(user)
   * ```
   *
   * Revoke selected tokens
   * ```js
   * const user = await User.find(1)
   * await auth.revokeTokensForUser(user, ['token1', 'token2'])
   * ```
   *
   * Delete instead of just revoking them
   * ```js
   * const user = await User.find(1)
   * await auth.revokeTokensForUser(user, null, true)
   * ```
   */
  async revokeTokensForUser (user, tokens, deleteInstead) {
    if (!user) {
      return
    }

    const plainTokens = _.compact(_.castArray(tokens)).map((token) => this.Encryption.decrypt(token))

    const fn = deleteInstead ? 'deleteTokens' : 'revokeTokens'
    return this._serializerInstance[fn](user, plainTokens)
  }

  /**
   * Lists all refresh tokens for currently logged in user.
   *
   * @method listTokens
   * @async
   *
   * @return {Array}
   */
  async listTokens () {
    return this.listTokensForUser(this.user)
  }
}

module.exports = BaseTokenScheme

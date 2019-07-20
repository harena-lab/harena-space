'use strict'

/*
 * adonis-auth
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const debug = require('debug')('adonis:auth')

/**
 * Auth middleware protects the Routes ensuring a user is loggedin
 * before the request reaches the controller.
 *
 * ```
 * Route
 * .get('...')
 * .middleware('auth')
 * ```
 *
 * You can define one or multiple schemes to be tried.
 * ```
 * Route
 * .get('...')
 * .middleware('auth:basic,jwt')
 * ```
 *
 * @class AuthMiddleware
 * @constructor
 * @module Lucid
 *
 * @param {Config} Config - Reference to config provider
 */
class Auth {
  constructor (Config) {
    const authenticator = Config.get('auth.authenticator')
    this.scheme = Config.get(`auth.${authenticator}.scheme`, null)
  }

  /**
   * Attempts to authenticate the user using defined multiple schemes and
   * stops on the first one
   *
   * @method _authenticate
   *
   * @param  {Object}      auth
   * @param  {Array}      schemes
   *
   * @return {void}
   */
  async _authenticate (auth, schemes) {
    let lastError = null
    schemes = Array.isArray(schemes) && schemes.length ? schemes : [this.scheme]

    debug('attempting to authenticate via %j scheme(s)', schemes)

    /**
     * Loop over all the defined schemes and wait until use is logged
     * via anyone
     */
    for (const scheme of schemes) {
      try {
        const authenticator = auth.authenticator(scheme)
        await authenticator.check()

        debug('authenticated using %s scheme', scheme)

        /**
         * Swapping the main authentication instance with the one using which user
         * logged in.
         */
        auth.authenticatorInstance = authenticator

        lastError = null
        break
      } catch (error) {
        debug('authentication failed using %s scheme', scheme)
        lastError = error
      }
    }

    /**
     * If there is an error from all the schemes
     * then throw it back
     */
    if (lastError) {
      throw lastError
    }
  }

  /**
   * Authenticate the user using one of the defined
   * schemes or the default scheme
   *
   * @method handle
   * @async
   *
   * @param {Object}   ctx       Request context
   * @param {Function} next
   * @param {Array}    schemes   Schemes for which the user must be validated.
   *                             If no scheme is defined, then default scheme from config is used.
   *
   * @return {void}
   */
  async handle ({ auth, view }, next, schemes) {
    await this._authenticate(auth, schemes)

    /**
     * For compatibility with the old API
     */
    auth.current = auth.authenticatorInstance

    /**
     * Sharing user with the view
     */
    if (view && typeof (view.share) === 'function') {
      view.share({
        auth: {
          user: auth.current.user
        }
      })
    }

    await next()
  }

  /**
   * Called when authenticating user for websocket request
   *
   * @method wsHandle
   *
   * @param {Object}   ctx       Request context
   * @param {Function} next
   * @param {Array}    schemes   Schemes for which the user must be validated.
   *                             If no scheme is defined, then default scheme from config is used.
   *
   * @return {void}
   */
  async wsHandle ({ auth }, next, schemes) {
    await this._authenticate(auth, schemes)

    /**
     * For compatibility with the old API
     */
    auth.current = auth.authenticatorInstance

    await next()
  }
}

module.exports = Auth

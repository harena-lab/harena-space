'use strict'

/*
 * adonis-auth
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

/**
 * AuthInit middleware attaches a new instance of auth class to the
 * request context.
 *
 * Later the `auth` object can be used to perform available actions.
 *
 * ## Note
 * If your main scheme is set to `session`, this middleware will attempt to
 * validate the user session on each request.
 *
 * @class AuthInitMiddleware
 * @constructor
 * @module Lucid
 *
 * @param {Config} Config - Reference to config provider
 */
class AuthInit {
  constructor (Config) {
    const authenticator = Config.get('auth.authenticator')
    this.scheme = Config.get(`auth.${authenticator}.scheme`, null)
  }

  /**
   * Attempt to login the user on each request ( if scheme is session ) and share
   * the auth object with the view instance.
   *
   * @method handle
   * @async
   *
   * @param {Object}   ctx - Request context
   * @param {Function} next
   *
   * @return {void}
   */
  async handle ({ auth, view }, next) {
    await auth.loginIfCan()

    /**
     * Sharing user with the view
     */
    if (view && typeof (view.share) === 'function') {
      view.share({
        auth: {
          user: auth.user
        }
      })
    }

    await next()
  }

  /**
   * Attempt to login the user on each request ( if scheme is session )
   *
   * @method wsHandle
   *
   * @async
   *
   * @param {Object}   ctx - Request context
   * @param {Function} next
   *
   * @return {void}
   */
  async wsHandle ({ auth }, next) {
    if (this.scheme === 'session') {
      await auth.loginIfCan()
    }

    await next()
  }
}

module.exports = AuthInit

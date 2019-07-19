'use strict'

/*
 * adonis-auth
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const { ioc } = require('@adonisjs/fold')
const GE = require('@adonisjs/generic-exceptions')

const Serializers = require('../Serializers')
const Schemes = require('../Schemes')

/**
 * Auth manager manages the schemes and serializers
 */
class AuthManager {
  constructor () {
    this._serializers = {}
    this._schemes = {}
  }

  /**
   * Extend authenticator by adding a new scheme or serializer.
   * You make use of this method via `Ioc.extend` interface
   *
   * @method extend
   *
   * @param  {String} key
   * @param  {Object} implementation
   * @param  {String} type
   *
   * @return {void}
   */
  extend (key, implementation, type) {
    if (type === 'scheme') {
      this._schemes[key] = implementation
      return
    }

    if (type === 'serializer') {
      this._serializers[key] = implementation
      return
    }

    throw GE
      .InvalidArgumentException
      .invalidParameter(`Auth.extend type must be a serializer or scheme, instead received ${type}`)
  }

  /**
   * Returns the instance of a given serializer
   *
   * @method getSerializer
   *
   * @param  {String}      name
   *
   * @return {Object}
   */
  getSerializer (name) {
    const serializer = Serializers[name] || this._serializers[name]
    if (!serializer) {
      throw GE.RuntimeException.incompleteConfig([`${name} serializer`], 'config/auth.js', 'auth')
    }
    return ioc.make(serializer)
  }

  /**
   * Returns the instance of a given scheme
   *
   * @method getScheme
   *
   * @param  {String}  name
   *
   * @return {Object}
   */
  getScheme (name) {
    const scheme = Schemes[name] || this._schemes[name]
    if (!scheme) {
      throw GE.RuntimeException.incompleteConfig([`${name} scheme`], 'config/auth.js', 'auth')
    }
    return ioc.make(scheme)
  }
}

module.exports = new AuthManager()

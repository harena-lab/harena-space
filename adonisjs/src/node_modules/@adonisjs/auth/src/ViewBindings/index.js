'use strict'

/*
 * adonis-auth
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const LoggedInFactory = require('./LoggedIn')

module.exports = function (View) {
  const LoggedIn = LoggedInFactory(View.engine.BaseTag)
  View.tag(new LoggedIn())
}

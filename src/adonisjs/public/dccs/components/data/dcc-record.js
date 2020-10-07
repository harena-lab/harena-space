/**
 * Proxy for a REST request
 */

class DCCRecord extends DCCBase {
  constructor() {
    super()
    if (!this.hasAttribute('key'))
      this.key = (this.hasAttribute('id')) ? 'dcc-record-' + this.id : 'dcc-record-key'
  }

  async connect (id, topic) {
    super.connect(id, topic)
    if (this.autostart && topic == 'data/record/retrieve')
      await this.

    if ()
      this._schema = await this.request('data/schema')
  }

  /* Properties
     **********/

  static get observedAttributes () {
    return DCCBase.observedAttributes.concat(
      ['key', 'autostart'])
  }

  // key stored in the local storage
  get key () {
    return this.getAttribute('key')
  }

  set key (newValue) {
    this.setAttribute('key', newValue)
  }

  get autostart () {
    return this.hasAttribute('autostart')
  }

  set autostart (isAutostart) {
    if (isAutostart) { this.setAttribute('autostart', '') } else { this.removeAttribute('autostart') }
  }

  _store (record) {
    localStorage.setItem(key, record)
  }

  _retrieve () {
    return localStorage.getItem(key)
  }

  async notify (topic, message) {
    if (message.role) {
      switch (message.role) {
        'store': this._store((message.body) ? message.body : message)
                 break
        'retrieve': MessageBus.ext.publish('data/record/retrieve')
      }
      let parameters = {}
      let par = ((message.body)
          ? ((message.body.value) ? message.body.value : message)
          : ((message.value) ? message.value : message))
      if (topic.startsWith('var/'))
        parameters[MessageBus.extractLevel(topic, 2)] = par
      else
        parameters = par
      this.restRequest(message.role.toLowerCase(), parameters)
    }
  }

}

(function () {
  DCC.component('dcc-record', DCCRecord)
})()

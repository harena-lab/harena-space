/**
 * Proxy for a REST request
 */

class DCCRecord extends DCCBase {
  constructor() {
    super()
    if (!this.hasAttribute('key'))
      this.key = (this.hasAttribute('id')) ? 'dcc-record-' + this.id : 'dcc-record-key'
    this.store = this.store.bind(this)
    this.retrieve = this.retrieve.bind(this)
    this.retrieveC = this.retrieveC.bind(this)
    this._subscribe('data/record/store', this.store)
    this._subscribe('data/record/retrieve', this.retrieve)
    if (this.hasAttribute('id'))
      this._provides(this.id, 'data/record/retrieve', this.retrieveC)
  }

  /* Properties
     **********/

  static get observedAttributes () {
    return DCCBase.observedAttributes.concat(
      ['key'])
  }

  // key stored in the local storage
  get key () {
    return this.getAttribute('key')
  }

  set key (newValue) {
    this.setAttribute('key', newValue)
  }

  store(topic, message) {
    localStorage.setItem(this.key,
      JSON.stringify((message.body) ? message.body : message))
  }

  retrieve(topic, message) {
    this._publish(MessageBus.buildResponseTopic(topic, message),
      this.retrieveC(topic, message))
  }

  retrieveC(topic, message) {
    console.log('=== retrieve C')
    console.log(topic)
    console.log(message)
    console.log(this.key)
    console.log(localStorage.getItem(this.key))
    return JSON.parse(localStorage.getItem(this.key))
  }

  async notify (topic, message) {
    switch (topic.toLowerCase()) {
      case 'store': this.store(topic, message)
                    break
    }
  }

}

(function () {
  DCC.webComponent('dcc-record', DCCRecord)
})()

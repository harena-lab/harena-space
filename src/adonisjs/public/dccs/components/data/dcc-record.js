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
    MessageBus.int.subscribeWithConnection('data/record/store', this.store)
    MessageBus.int.subscribeWithConnection('data/record/retrieve', this.retrieve)
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
    localStorage.setItem(this.key, (message.body) ? message.body : message)
  }

  retrieve(topic, message) {
    MessageBus.int.publish(MessageBus.buildResponseTopic(topic, message), localStorage.getItem(this.key))
  }

  async notify (topic, message) {
    if (message.role) {
      switch (message.role) {
        case 'store': this.store(topic, message)
                      break
      }
    }
  }

}

(function () {
  DCC.component('dcc-record', DCCRecord)
})()

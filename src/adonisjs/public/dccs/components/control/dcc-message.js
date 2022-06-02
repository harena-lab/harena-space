/* Message DCC
  ************/
class DCCMessage extends DCCBase {
  connectedCallback () {
    super.connectedCallback()
    if (this.autorun)
      this._publish(this.topic, null, true)
  }

  /* Attribute Handling */

  static get observedAttributes () {
    return DCCBase.observedAttributes.concat(['topic', 'autorun'])
  }

  get topic () {
    return this.getAttribute('topic')
  }

  set topic (newValue) {
    this.setAttribute('topic', newValue)
  }

  // defines if the expression run at start
  get autorun () {
    return this.hasAttribute('autorun')
  }

  set autorun (isActive) {
    if (isActive) {
      this.setAttribute('autorun', '')
    } else {
      this.removeAttribute('autorun')
    }
  }

  async notify (topic, message, track) {
    const tp = topic.toLowerCase()
    if (tp == 'publish')
      this._publish(this.topic, message, track)
  }
}

(function () {
  DCC.webComponent('dcc-message', DCCMessage)
})()

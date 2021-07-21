/* DCC Subscriber
  ***************/

class SubscribeDCC extends HTMLElement {
  connectedCallback () {
    this.publishWithMap = this.publishWithMap.bind(this)
    if (this.hasAttribute('topic')) {
      this._targetObj = (this.hasAttribute('target'))
        ? document.querySelector('#' + this.target) : this.parentNode

      if (!this.hasAttribute('map')) {
        MessageBus.ext.subscribe(this.topic, this._targetObj.notify) }
      else {
        MessageBus.ext.subscribe(this.topic, this.publishWithMap) }
    }
  }

  disconnectedCallback () {
    if (!this.hasAttribute('map')) {
      MessageBus.ext.unsubscribe(this.topic, this._targetObj.notify) }
    else {
      MessageBus.ext.unsubscribe(this.topic, this.publishWithMap) }
  }

  publishWithMap (topic, message) {
    // this._targetObj.notify(topic, { role: this.role, body: message })
    this._targetObj.notify(this.map, message)
  }

  /* Properties
      **********/

  static get observedAttributes () {
    return ['target', 'topic', 'map']
  }

  get target () {
    return this.getAttribute('target')
  }

  set target (newValue) {
    this.setAttribute('target', newValue)
  }

  get topic () {
    return this.getAttribute('topic')
  }

  set topic (newValue) {
    this.setAttribute('topic', newValue)
  }

  get map () {
    return this.getAttribute('map')
  }

  set map (newValue) {
    this.setAttribute('map', newValue)
  }
}

(function () {
  customElements.define('subscribe-dcc', SubscribeDCC)
})()

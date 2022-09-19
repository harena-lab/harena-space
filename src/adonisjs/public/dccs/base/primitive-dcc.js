/**
 * Primitive for any element in the DCC context
 */

class PrimitiveDCC extends HTMLElement {
  constructor () {
    super()
    this._bus = MessageBus.i
  }

  connectedCallback () {
    let ag = this._findAggregator(ScopeDCC)
    if (ag != null)
      this._bus = ag.bus
  }

  _findAggregator(agClass) {
    let parent = (this.parentNode != null)
      ? this.parentNode
      : ((this instanceof DocumentFragment) ? this.host : null)
    while (parent != null && !(parent instanceof agClass))
      parent = (parent.parentNode != null)
        ? parent.parentNode
        : ((parent instanceof DocumentFragment) ? parent.host : null)
    return parent
  }

  static get rootPath () {
    return PrimitiveDCC._rootPath
  }

  static set rootPath (newValue) {
    PrimitiveDCC._rootPath = newValue
  }

  /*
   * Bus Proxy
   */

  _subscribe (topic, callback) {
    return this._bus.subscribe(topic, callback)
  }

  _unsubscribe (topic, callback) {
    this._bus.unsubscribe(topic, callback)
  }

  async _publish (topic, message, track) {
    await this._bus.publish(topic, message, track)
  }

  _hasSubscriber (topic, regexp) {
    return this._bus.hasSubscriber(topic, regexp)
  }

  async _request (requestTopic, requestMessage, responseTopic, track) {
    return await this._bus.request(requestTopic, requestMessage, responseTopic, track)
  }

  _publishHasResponse (topic, requestMessage, responseMessage, track) {
    this._bus.publishHasResponse (topic, requestMessage, responseMessage, track)
  }

  async _waitMessage (topic) {
    return await this._bus.waitMessage(topic)
  }

  _provides (id, topic, service) {
    this._bus.provides(id, topic, service)
  }

  _withhold (id, topic) {
    this._bus.withhold(id, topic)
  }

  _connect (id, topic, callback) {
    this._bus.connect(id, topic, callback)
  }

  async _requestC (id, topic, message) {
    return await this._bus.requestC(id, topic, message)
  }
}

(function () {
  PrimitiveDCC._rootPath = ""
})()

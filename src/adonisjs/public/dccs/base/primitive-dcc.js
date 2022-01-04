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
    let parent = this.parentNode
    while (parent != null && !(parent instanceof agClass))
      parent = parent.parentNode
    return parent
  }

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

  _connect (id, topic, callback) {
    this._bus.connect(id, topic, callback)
  }

  async _requestC (id, topic, message) {
    return await this._bus.requestC(id, topic, message)
  }
}

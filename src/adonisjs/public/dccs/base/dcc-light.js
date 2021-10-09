/**
 * Light version of DCCs without Element overload
 */

class DCCLight {

  // <TODO> All the following methods are a copy of PrimitiveDCC

  constructor () {
    this._bus = MessageBus.i
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

  async _request (requestTopic, requestMessage, responseTopic) {
    return await this._bus.request(requestTopic, requestMessage, responseTopic)
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

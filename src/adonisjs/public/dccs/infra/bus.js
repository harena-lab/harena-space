/**
 * Bus
 */

class MessageBus {
  constructor () {
    this._listeners = []
    this._providers = {}
    this._connections = {}
    this._bridge = null
    this._debugger = null
    this.publish = this.publish.bind(this)
  }

  // <TODO> provisory, while it is not possible to debug only tracked messages
  get debugger() {
    return this._debugger
  }

  set debugger(newDebugger) {
    this._debugger = newDebugger
  }

  get bridge() {
    return this._bridge
  }

  set bridge(newBridge) {
    this._bridge = newBridge
  }

  // <TODO> provisory
  defineRunningCase (runningCase) {
    this._runningCase = runningCase
  }

  subscribe (topic, callback) {
    const status = true

    // Topic Filter: transform wildcards in regular expressions
    if (topic.indexOf('+') > -1 || topic.indexOf('#') > -1) {
      const reTopic = MessageBus._convertRegExp(topic)
      this._listeners.push({
        topic: topic,
        regexp: reTopic,
        callback: callback
      })
    } else {
      this._listeners.push({
        topic: topic,
        callback: callback
      })
    }

    return status
  }

  showListeners () {
    console.log('=== listeners')
    console.log(this._listeners)
  }

  unsubscribe (topic, callback) {
    let found = false
    for (let l = 0; l < this._listeners.length && !found; l++) {
      if (this._listeners[l].topic == topic &&
             this._listeners[l].callback == callback) {
        this._listeners.splice(l, 1)
        found = true
      }
    }
  }

  async publish (topic, message, track, byBridge) {
    /*
    console.log('----- message: ' + topic)
    console.log(message)
    if (this._runningCase && this._runningCase.track)
      console.log(this._runningCase.track.userid)
    else {
      console.log('[no running case]')
    }
    */

    if (this.debugger != null)
      this.debugger(topic, message, track)

    if (this._bridge != null && !byBridge)
      this._bridge.publish(topic, message, track, true)

    let listeners = this._listeners.slice()
    for (const l in listeners) {
      if (this._matchTopic(listeners[l], topic)) {
        if (listeners[l].callback)
          listeners[l].callback(topic, message, track)
      }
    }

    /*
    if (track != null) {
      if (DCCCommonServer.loggerAddressAPI) {
        const currentDateTime = new Date()
        let extMessage = {
          localTime: currentDateTime.toJSON()
        }
        if (message != null) extMessage.content = message
        let extTopic = topic
        if (this._runningCase != null) {
          extMessage.track = {
            userid: this._runningCase.track.userid,
            caseid: this._runningCase.track.caseid
          }
          extTopic = this._runningCase.runningId + '/' + topic
        }

        const response = await fetch(DCCCommonServer.loggerAddressAPI + 'message', {
          method: 'POST',
          body: JSON.stringify({
            'harena-log-stream-version': '1',
            'harena-log-stream': [
              {
                topic: extTopic,
                payload: extMessage
              }]
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const status = await response.json()
      }

      parent.postMessage({ topic: topic, message: message }, '*')
    }
    */
  }

  /* Checks if this topic has a subscriber */
  /* default: does not check regular expression */
  hasSubscriber (topic, regexp, byBridge) {
    let hasSub = false
    let listeners = this._listeners.slice()
    for (let l = 0; !hasSub && l < listeners.length; l++) {
      if (regexp != null && regexp)
        hasSub = this._matchTopic(listeners[l], topic)
      else
        hasSub = (topic == listeners[l].topic)
    }
    if (!hasSub && this._bridge != null && !byBridge)
      hasSub = this._bridge.hasSubscriber(topic, regexp, true)

    return hasSub
  }

  _matchTopic (listener, topic) {
    let matched = false
    if (listener.regexp) {
      const matchStr = listener.regexp.exec(topic)
      if (matchStr != null && matchStr[0] === topic) { matched = true }
    } else if (listener.topic === topic) { matched = true }
    return matched
  }

  async request (requestTopic, requestMessage, responseTopic, track) {
    let rt
    let rm = (requestMessage != null) ? requestMessage : null
    if (responseTopic) { rt = responseTopic } else {
      if (rm == null) { rm = {} } else if (typeof rm !== 'object') { rm = { body: rm } }
      rm.responseStamp = MessageBus._stamp
      rt = 'response/' + MessageBus._stamp + '/' + requestTopic
      MessageBus._stamp++
    }

    const promise = new Promise((resolve, reject) => {
      const callback = function (topic, message) {
        resolve({ topic: topic, message: message, callback: callback })
      }
      this.subscribe(rt, callback)
      this.publish(requestTopic, rm, track)
    })

    const returnMessage = await promise
    this.unsubscribe(rt, returnMessage.callback)

    return {
      topic: returnMessage.topic,
      message: returnMessage.message
    }
  }

  /*
   Publishes the response only if a request exists
   */
  publishHasResponse (topic, requestMessage, responseMessage, track) {
    if (requestMessage.responseStamp)
      this.publish(
        MessageBus.buildResponseTopic(topic, requestMessage),
        responseMessage, track)
  }

  async waitMessage (topic) {
    const promise = new Promise((resolve, reject) => {
      const callback = function (topic, message) {
        resolve({ topic: topic, message: message, callback: callback })
      }
      this.subscribe(topic, callback)
    })

    const returnMessage = await promise
    this.unsubscribe(topic, returnMessage.callback)

    return {
      topic: returnMessage.topic,
      message: returnMessage.message
    }
  }

  /* Connection-oriented communication
   ***********************************/

  /*
   * Components declare provided services. Each topic defines a service.
   *   id: unique id of the component that offers the service
   *   topic: topic related to the provided service
   *   service: the component method that implements the service
   */
  provides (id, topic, service) {
    let status = true
    const key = id + ':' + topic
    if (this._providers[key])
      status = false
    else {
      this._providers[key] = service
      if (this._connections[key] != null) {
        for (let c of this._connections[key])
          c.connectionReady(id, topic)
        delete this._connections[key]
      }
    }
  }

  /*
   * Removes a provided service (usually when the component is destroyed)
   */
  withhold (id, topic) {
    const key = id + ':' + topic
    if (this._providers[key])
      delete this._providers[key]
  }

  /*
   * Connects a component to another one based on the id and a topic (service).
   *   id: id of the component that offers the service
   *   topic: topic related to the provided service
   *   callback: instance that will be notified as soon as the service is
   *             connected
   */
  connect (id, topic, callback) {
    const key = id + ':' + topic
    if (this._providers[key])
      callback.connectionReady(id, topic)
    else
      if (this._connections[key])
        this._connections[key].push(callback)
      else
        this._connections[key] = [callback]
  }

  /*
   * Triggers a service defined by an id and topic, sending an optional
   * message to it.
   */
  async requestC (id, topic, message) {
    let response = null
    const key = id + ':' + topic
    if (this._providers[key] != null)
      response = await this._providers[key](topic, message)
    return response
  }

  static create (busId) {
    let bus = new MessageBus()
    if (busId != null)
      MessageBus._bus[busId] = bus
    return bus
  }

  /* Message analysis services
     *************************/

  static _convertRegExp (filter) {
    return new RegExp(filter.replace(/\//g, '\\/')
      .replace(/\+/g, '[^\/]+') // "[\\w -\.\*<>]+"
      .replace(/#/g, '.+')) // "[\\w\\/ -\.\*<>]+"
  }

  static matchFilter (topic, filter) {
    let match = false
    const regExp = MessageBus._convertRegExp(filter)
    const matched = regExp.exec(topic)
    if (matched != null && matched[0] === topic) { match = true }
    return match
  }

  /*
   * Returns the label at a specific level of the message.
   */
  static extractLevel (topic, level) {
    const levelSet = MessageBus._splitLevels(topic, level)
    return (levelSet == null) ? null : levelSet[level - 1]
  }

  /*
   * Returns the hierarchy from a level to a level of the message.
   */
  static extractLevelsSegment (topic, levelFrom, levelTo) {
    let hierarchy = null
    const levelSet = MessageBus._splitLevels(topic)
    if (levelSet != null) {
      if (levelTo == null)
        levelTo = levelSet.length
      if (levelTo >= levelFrom) {
        if (levelSet != null) {
          hierarchy = ''
          for (let l = levelFrom-1; l < levelTo; l++)
            hierarchy += levelSet[l] + ((l < levelTo-1) ? '/' : '')
        }
      }
    }
    return hierarchy
  }

  static _splitLevels (topic, level) {
    let split = null
    if (topic != null) {
      const levelSet = topic.split('/')
      if (level == null || level <= levelSet.length)
        split = levelSet
    }
    return split
  }

  /* Message building services
      *************************/
  static buildResponseTopic (topic, message) {
    return 'response/' + message.responseStamp + '/' + topic
  }
}

(function () {
  MessageBus._stamp = 1
  MessageBus._connection = 1

  MessageBus._bus = {}
  MessageBus.i = MessageBus.create('default')
})()

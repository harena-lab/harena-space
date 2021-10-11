/**
 * DCC which is the basis of all components
 */

class DCCBase extends PrimitiveDCC {
  constructor () {
    super()
    this.edit = this.edit.bind(this)
    this.toNotify = this.toNotify.bind(this)
    this.notify = this.notify.bind(this)
  }

  connectedCallback () {
    super.connectedCallback()
    if (this.hasAttribute('bind'))
      this._setup = DCC.retrieve(this.bind.toLowerCase(), this.nodeName.toLowerCase())
    if (this.hasAttribute('subscribe'))
      this._subscribeTopic(this.subscribe)
    if (this.hasAttribute('connect')) {
      this._connectTo(this.connect)
    }
  }

  disconnectedCallback () {
    if (this._substopic != null) {
      if (this._subsmap != null)
        this._unsubscribe(this._substopic, this.toNotify)
      else
        this._unsubscribe(this._substopic, this.notify)
    }
  }

  static get observedAttributes () {
    return ['id', 'role', 'author', 'bind', 'subscribe', 'connect']
  }

  static get replicatedAttributes () {
    return []
  }

  get id () {
    return this.getAttribute('id')
  }

  set id (newValue) {
    this.setAttribute('id', newValue)
  }

  // role of the component inside compositions
  get role () {
    return this.getAttribute('role')
  }

  set role (newValue) {
    this.setAttribute('role', newValue)
  }

  get author () {
    return this.hasAttribute('author')
  }

  set author (isAuthor) {
    if (isAuthor) { this.setAttribute('author', '') } else { this.removeAttribute('author') }
  }

  // binds this DCC to a content component
  get bind () {
    return this.getAttribute('bind')
  }

  set bind (newValue) {
    this.setAttribute('bind', newValue)
  }

  get subscribe () {
    return this.getAttribute('subscribe')
  }

  set subscribe (newValue) {
    this.setAttribute('subscribe', newValue)
    this._subscribeTopic(newValue)
  }

  _subscribeTopic (topicMap) {
    const colon = topicMap.lastIndexOf(':')
    if (colon != -1) {
      this._substopic = topicMap.substring(0, colon)
      this._subsmap = topicMap.substring(colon + 1)
      this._subscribe(this._substopic, this.toNotify)
    } else {
      this._substopic = topicMap
      this._subscribe(topicMap, this.notify)
    }
  }

  toNotify (topic, message) {
    // this.notify(topic, {role: this._subsmap, body: message})
    this.notify((this._subsmap) ? this._subsmap : topic, message)
  }

  notify (topic, message) {
    /* implemented in the subclasses */
  }

  // connects this DCC to annother component
  get connect () {
    return this.getAttribute('connect')
  }

  set connect (newValue) {
    this.setAttribute('connect', newValue)
    this._connectTo(newValue)
  }

  _connectTo (triggerIdTopic) {
    const colonTrigger = triggerIdTopic.indexOf(':')
    const colonId = triggerIdTopic.lastIndexOf(':')
    if (colonTrigger != -1 && colonId != -1) {
      this.connectTo(
        triggerIdTopic.substring(0, colonTrigger),
        triggerIdTopic.substring(colonTrigger + 1, colonId),
        triggerIdTopic.substring(colonId+1)
      )
    }
  }

  /*
   * Connects this DCC to another
   *   trigger - event in this component that triggers the request through
   *             this connection
   *   id - identification of the target component to be connected
   *   topic - identifies, in the target component, the specific services
   *           related to this connection (services are related to topics
   *           and declared in the bus provides interface)
   */
  connectTo (trigger, id, topic) {
    if (trigger != null && id != null && topic != null) {
      if (this._connections == null) this._connections = {}
      if (this._connections[trigger] == null) this._connections[trigger] = []
      this._connections[trigger].push({id: id, topic: topic})
      this._connect(id, topic, this)
    }
  }

  connectionReady (id, topic) {
    /* implemented in the subclasses */
  }

  async request (trigger, message, id) {
    let response = null
    if (this._connections != null && this._connections[trigger] != null)
      if (id != null) {
        const conId = this._connections[trigger].find(con => con.id == id)
        response =
            await this._requestC(id, conId.topic, message)
      } else
        response =
            await this._requestC(
              this._connections[trigger][0].id,
              this._connections[trigger][0].topic, message)
    return response
  }

  async multiRequest (trigger, message) {
    let response = {}
    if (this._connections != null && this._connections[trigger] != null)
      for (let c of this._connections[trigger])
        response[c.id] = await this._requestC(c.id, c.topic, message)
    return response
  }

  // <FUTURE> Makes sense?
  // one way notification for connected componentes
  /*
  async update (topic, message) {
    if (this._connections != null && this._connections[topic] != null)
      for (let c of this._connections[topic]) {
        await this._publish(topic + '/' + c, message)
  }
  */

  edit () {
    /* nothing */
  }

  // serializes the component in HTML
  toHTML () {
    return this.outerHTML()
  }
}

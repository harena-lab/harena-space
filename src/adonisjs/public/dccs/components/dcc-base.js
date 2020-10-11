/**
 * DCC which is the basis of all components
 */

class DCCBase extends HTMLElement {
  constructor () {
    super()
    this.edit = this.edit.bind(this)
    this.toNotify = this.toNotify.bind(this)
    this.notify = this.notify.bind(this)
    console.log('=== dcc id')
    console.log(this.id)
  }

  connectedCallback () {
    console.log('=== callback')
    console.log(this.id)
    if (this.hasAttribute('bind'))
      this._setup = DCC.retrieve(this.bind.toLowerCase(), this.nodeName.toLowerCase())
    if (this.hasAttribute('subscribe'))
      this._subscribeTopic(this.subscribe)
    if (this.hasAttribute('connect')) {
      console.log('=== has connection')
      this._connectTo(this.connect)
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

  _subscribeTopic (topicRole) {
    const colon = topicRole.lastIndexOf(':')
    if (colon != -1) {
      this._subsrole = topicRole.substring(colon + 1)
      MessageBus.ext.subscribe(topicRole.substring(0, colon), this.toNotify)
      console.log('=== subscribed')
      console.log(topicRole.substring(colon + 1))
      console.log(topicRole.substring(0, colon))
    } else
      MessageBus.ext.subscribe(topicRole, this.notify)
  }

  toNotify (topic, message) {
    console.log('=== to notify')
    console.log(this._subsrole)
    console.log(topic)
    console.log(message)
    this.notify(topic, {role: this._subsrole, body: message})
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

  _connectTo (idTopicRole) {
    console.log('=== base connect to')
    console.log(idTopicRole)
    const colonId = idTopicRole.indexOf(':')
    const colonRole = idTopicRole.lastIndexOf(':')
    if (colonId != -1 && colonRole != -1) {
      this.connectTo(
        idTopicRole.substring(0, colonId),
        idTopicRole.substring(colonId + 1, colonRole),
        idTopicRole.substring(colonRole+1)
      )
    }
  }

  // connects this DCC to another
  connectTo (id, topic, role) {
    console.log('=== connection')
    console.log(id)
    console.log(topic)
    console.log(role)
    if (id != null && topic != null && role != null) {
      if (this._connections == null) this._connections = {}
      if (this._connections[role] == null) this._connections[role] = []
      this._connections[role].push({id: id, topic: topic})
      MessageBus.page.connect(id, topic, this)
    }
  }

  connectionReady (id, topic) {
    /* implemented in the subclasses */
  }

  async request (role, message, id) {
    let response = null
    if (this._connections != null && this._connections[role] != null)
      if (id != null) {
        const conId = this._connections[role].find(con => con.id == id)
        response =
            await MessageBus.page.requestC(id, conId.topic, message)
      } else
        response =
            await MessageBus.page.requestC(
              this._connections[role][0].id, this._connections[role][0].topic, message)
    return response
  }

  async multiRequest (role, message) {
    let response = {}
    console.log('=== multi request')
    console.log(this._connections)
    if (this._connections != null && this._connections[role] != null)
      for (let c of this._connections[role])
        response[c.id] = await MessageBus.page.requestC(c.id, c.topic, message)
    return response
  }

  // <FUTURE> Makes sense?
  // one way notification for connected componentes
  /*
  async update (topic, message) {
    if (this._connections != null && this._connections[topic] != null)
      for (let c of this._connections[topic]) {
        await MessageBus.page.publish(topic + '/' + c, message)
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

/**
 * DCC which is the basis of all components
 */

class DCCBase extends HTMLElement {
  constructor () {
    super()
    this.edit = this.edit.bind(this)
  }

  connectedCallback () {
    if (this.hasAttribute('bind'))
      this._content = DCC.retrieve(this.bind.toLowerCase(), this.nodeName.toLowerCase())
  }

  static get observedAttributes () {
    return ['id', 'role', 'author', 'bind', 'connect']
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

  // connects this DCC to annother component
  get connect () {
    return this.getAttribute('connect')
  }

  set connect (newValue) {
    this.setAttribute('connect', newValue)
    const colon = newValue.indexOf(':')
    if (colon != -1) {
      this.connectTo(newValue.substring(0, colon), newValue.substring(colon + 1))
      console.log('=== connect')
      console.log(newValue.substring(0, colon) + '; topic: ' + newValue.substring(colon + 1))
    }
  }

  // connects this DCC to another
  connectTo (id, topic) {
    if (id != null && topic != null) {
      if (this._connections == null) this._connections = {}
      if (this._connections[topic] == null) this._connections[topic] = []
      this._connections[topic].push(id)
    }
  }

  async request (topic, message) {
    let response = {}
    if (this._connections != null && this._connections[topic] != null)
      for (let c of this._connections[topic]) {
        const result = await MessageBus.int.request(topic + '/' + c, message)
        response[c] = (result != null) ? result.message : null
      }
    return response
  }

  // <FUTURE> Makes sense?
  // one way notification for connected componentes
  /*
  async update (topic, message) {
    if (this._connections != null && this._connections[topic] != null)
      for (let c of this._connections[topic]) {
        await MessageBus.int.publish(topic + '/' + c, message)
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

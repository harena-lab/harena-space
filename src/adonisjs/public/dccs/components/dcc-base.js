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
    return ['id', 'role', 'author', 'bind']
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

  // connects this DCC to another
  connect (id, topic) {
    if (id != null && topic != null) {
      if (this._connections == null) this._connections = {}
      if (this._connections[topic] == null) this._connections[topic] = []
      this._connections[topic].push(id)
    }
  }

  async request (topic) {
    let response = {}
    if (this._connections != null && this._connections[topic] != null)
      for (let c of this._connections[topic]) {
        const result = await MessageBus.int.request(topic + '/' + c)
        response[c] = (result != null) ? result.message : null
      }
    return response
  }

  edit () {
    /* nothing */
  }

  // serializes the component in HTML
  toHTML () {
    return this.outerHTML()
  }
}

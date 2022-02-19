class ScopeDCC extends PrimitiveDCC {
  connectedCallback () {
    super.connectedCallback ()
    this._bus = MessageBus.create(this.id)
    if (this.externalize) {
      this._bus.bridge = MessageBus.i
      MessageBus.i.bridge = this._bus
    }
  }

  static get observedAttributes () {
    return ['id', 'externalize']
  }

  get id () {
    return this.getAttribute('id')
  }

  set id (newValue) {
    this.setAttribute('id', newValue)
  }

  get externalize () {
    return this.hasAttribute('externalize')
  }

  set externalize (isAuthor) {
    if (isAuthor)
      this.setAttribute('externalize', '')
    else
      this.removeAttribute('externalize')
  }

  get bus () {
    return this._bus
  }
}

(function () {
  ScopeDCC.elementTag = 'scope-dcc'
  customElements.define(ScopeDCC.elementTag, ScopeDCC)
})()

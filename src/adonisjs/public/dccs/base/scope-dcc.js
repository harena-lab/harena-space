class ScopeDCC extends PrimitiveDCC {
  connectedCallback () {
    super.connectedCallback ()
    this._bus = MessageBus.create(this.id)
  }

  static get observedAttributes () {
    return ['id']
  }

  get id () {
    return this.getAttribute('id')
  }

  set id (newValue) {
    this.setAttribute('id', newValue)
  }

  get bus () {
    return this._bus
  }
}

(function () {
  ScopeDCC.elementTag = 'scope-dcc'
  customElements.define(ScopeDCC.elementTag, ScopeDCC)
})()

/* Media DCC
  **********/

class DCCMedia extends DCCVisual {
  connectedCallback () {
    const mtype = (this.hasAttribute('type')) ? this.type : 'video'
    let html = '<' + mtype + ' id="presentation-dcc"><source src="' +
               Basic.service.imageResolver(this.source) + '">' +
               '</' + mtype + '>'
    this._setPresentation(this._shadowHTML(html))
    this._presentationIsReady()
    super.connectedCallback()
  }

  /* Properties
      **********/

  static get observedAttributes () {
    return DCCVisual.observedAttributes.concat(
      ['type', 'source'])
  }

  get type () {
    return this.getAttribute('type')
  }

  set type (newValue) {
    this.setAttribute('type', newValue)
  }

  get source () {
    return this.getAttribute('source')
  }

  set source (newValue) {
    this.setAttribute('source', newValue)
  }
}

(function () {
  customElements.define('dcc-media', DCCMedia)
})()

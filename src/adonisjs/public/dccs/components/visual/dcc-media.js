/* Media DCC
  **********/

class DCCMedia extends DCCVisual {
  connectedCallback () {
    const mtype = (this.hasAttribute('type')) ? this.type : 'video'
    let html = (this.hasAttribute('source')) ?
      '<' + mtype +
      ((this.controls) ? ' controls' : '') +
      ' id="presentation-dcc" ><source src="' +
      DCCVisual.imageResolver(this.source) + '">' +
      '</' + mtype + '>' :
      '<div id="presentation-dcc" style="width:320px;height:256px">' +
      DCCMedia.mediaStub + '</div>'
    this._setPresentation(this._shadowHTML(html))
    this._presentationIsReady()
    super.connectedCallback()
  }

  /* Properties
     **********/

  static get observedAttributes () {
    return DCCVisual.observedAttributes.concat(
      ['type', 'source', 'controls'])
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

  get controls () {
    return this.hasAttribute('controls')
  }

  set controls (hasControls) {
    if (hasControls) {
      this.setAttribute('controls', '') }
    else {
      this.removeAttribute('controls') }
  }

  editButtons () {
    return {
      default: super.editButtons().default.concat([DCCVisual.editDCCExpand])
    }
  }
}

(function () {
  // https://fontawesome.com/v5.15/icons/film?style=solid
  DCCMedia.mediaStub =
`<svg viewBox="0 70 512 512"><path fill="currentColor" d="M488 64h-8v20c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12V64H96v20c0 6.6-5.4 12-12 12H44c-6.6 0-12-5.4-12-12V64h-8C10.7 64 0 74.7 0 88v336c0 13.3 10.7 24 24 24h8v-20c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v20h320v-20c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v20h8c13.3 0 24-10.7 24-24V88c0-13.3-10.7-24-24-24zM96 372c0 6.6-5.4 12-12 12H44c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40zm0-96c0 6.6-5.4 12-12 12H44c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40zm0-96c0 6.6-5.4 12-12 12H44c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40zm272 208c0 6.6-5.4 12-12 12H156c-6.6 0-12-5.4-12-12v-96c0-6.6 5.4-12 12-12h200c6.6 0 12 5.4 12 12v96zm0-168c0 6.6-5.4 12-12 12H156c-6.6 0-12-5.4-12-12v-96c0-6.6 5.4-12 12-12h200c6.6 0 12 5.4 12 12v96zm112 152c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40zm0-96c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40zm0-96c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40z"></path></svg>`

  customElements.define('dcc-media', DCCMedia)
})()

/* Dynamic HTML DCC
  *****************/

class DCCDHTML extends DCCBase {
  connectedCallback () {
    this._includeHTML = this._includeHTML.bind(this)
    super.connectedCallback()
  }

  /* Properties
      **********/

  static get observedAttributes () {
    return DCCBase.observedAttributes.concat(
      ['each'])
  }

  get each () {
    return this.getAttribute('each')
  }

  set each (newValue) {
    this.setAttribute('each', newValue)
  }

  _includeHTML () {
    for (let node of this._xhr.responseXML.body.childNodes) {
      this.appendChild(node)
    }    
  }
}

(function () {
  DCC.component('dcc-dhtml', DCCDHTML)
})()

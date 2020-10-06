/* Dynamic HTML DCC
  *****************/

class DCCDHTML extends DCCBase {
  connectedCallback () {
    this._originalHTML = this.innerHTML
    this.recordUpdate = this.recordUpdate.bind(this)
    super.connectedCallback()
    if (this.hasAttribute('subscribe'))
      MessageBus.ext.subscribe(this.subscribe, this.recordUpdate)
    this._renderHTML()
  }

  /* Properties
     **********/

  static get observedAttributes () {
    return DCCBase.observedAttributes.concat(
      ['subscribe', 'each'])
  }

  get subscribe () {
    return this.getAttribute('subscribe')
  }

  set subscribe (newValue) {
    this.setAttribute('subscribe', newValue)
  }

  get each () {
    return this.getAttribute('each')
  }

  set each (newValue) {
    this.setAttribute('each', newValue)
  }

  _renderHTML () {
    let html = this._originalHTML
    if (this._record != null) {
      if (typeof this._record === 'object')
        html = this._replaceFields(html, this._record)
      else
        html = this._originalHTML.replace(/\{\{[ \t]*value[ \t]*\}\}/igm, this._record)
    }
    this.innerHTML = html.replace(/\{\{[^}]*\}\}/igm, '')
  }

  _replaceFields (html, record) {
    for (let r in record) {
      if (record[r] != null && typeof record[r] === 'object')
        html = this._replaceFields(html, record[r])
      else
        html = html.replace(new RegExp('\{\{[ \t]*' + r + '[ \t]*\}\}', 'igm'), record[r])
    }
    return html
  }

  recordUpdate (topic, message) {
    console.log('=== record update')
    console.log(topic)
    console.log(message)
    this._record = ((message.body)
      ? ((message.body.value) ? message.body.value : message)
      : ((message.value) ? message.value : message))
    this._renderHTML()
  }
}

(function () {
  DCC.component('dcc-dhtml', DCCDHTML)
})()

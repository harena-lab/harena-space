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
        html = this._replaceEach(html, this._record)
      else
        html = this._originalHTML.replace(/\{\{[ \t]*value[ \t]*\}\}/igm, this._record)
    }
    this.innerHTML = html.replace(/\{\{[^}]*\}\}/igm, '')
  }

  _replaceEach (html, record) {
    const eachBlocks = html.split(
      /\{\{[ \t]*@foreach[ \t]+([^ \t]+)[ \t]+([^ \t}]+)[ \t]*\}\}/im)
    let part = 0
    html = ''
    while (part < eachBlocks.length) {
      let phtml = this._replaceFields(eachBlocks[part], '', record)
      html += phtml
      part++
      if (part < eachBlocks.length) {
        let field = eachBlocks[part]
        let item = eachBlocks[part+1]
        let phtml = eachBlocks[part+2]
        const it = (field == '.') ? record : record[field]
        for (let i of it) {
          let shtml = phtml
          shtml = this._replaceFields(shtml, '', record)
          shtml = this._replaceFields(
            shtml, (field == '.') ? item : item + '.' + field, i)
          html += shtml
        }
        part += 3
      }
    }
    return html
  }

  _replaceFields (html, prefix, record) {
    if (prefix != '') prefix += '.'
    for (let r in record) {
      let pr = prefix + r
      if (record[r] != null && typeof record[r] === 'object')
        html = this._replaceFields(html, pr, record[r])
      else
        html = html.replace(new RegExp('\{\{[ \t]*' + pr + '[ \t]*\}\}', 'igm'),
                            (record[r] != null) ? record[r] : '')
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

  async connectionReady (id, topic) {
    super.connectionReady (id, topic)
    if (topic == 'data/record/retrieve') {
      const response = await this.request(topic)
      this.recordUpdate(topic, response)
    }
  }
}

(function () {
  DCC.component('dcc-dhtml', DCCDHTML)
})()

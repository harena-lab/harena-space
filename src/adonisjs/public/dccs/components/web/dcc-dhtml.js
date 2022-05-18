/* Dynamic HTML DCC
  *****************/

class DCCDHTML extends DCCBase {
  constructor() {
    super()
    this._originalHTML = ''
    this.recordUpdate = this.recordUpdate.bind(this)
    this.checkStatus = this.checkStatus.bind(this)
    this._contentUpdated = this._contentUpdated.bind(this)
  }

  async connectedCallback () {
    super.connectedCallback()

    const template = document.createElement('template')
    template.innerHTML =
      '<div style="display:none"><slot></slot></div>'
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' })
      shadow.appendChild(template.content.cloneNode(true))
      const div = document.createElement('div')
      div.setAttribute('display', 'inline-block')
      if (this.hasAttribute('class'))
        div.setAttribute('class', this.getAttribute('class'))
      if (this.hasAttribute('style'))
        div.setAttribute('style', this.getAttribute('style'))
      this._dhtmlRender = div
      this.parentNode.insertBefore(this._dhtmlRender, this.nextSibling)
    }

    this._renderHTML()

    this._observer = new MutationObserver(this._contentUpdated)
    this._observer.observe(this,
                           {attributes: true, childList: true, subtree: true})
    this._contentUpdated()

    if (this.hasAttribute('autoupdate')) {
      let record = await this._request('var/get/*', null, null, true)
      record = (record == null || record.message == null) ? {} : record.message
      this.recordUpdate('var/get/*', record)
      this.fieldUpdate = this.fieldUpdate.bind(this)
      this._subscribe('var/set/#', this.fieldUpdate)
    }

    this._ready = false

    this._subscribe('control/dhtml/status/request', this.checkStatus)
  }

  /*
    * Property handling
    */

  static get observedAttributes () {
    return DCCBase.observedAttributes.concat(['autoupdate'])
  }

  get autoupdate () {
    return this.getAttribute('autoupdate')
  }

  set autoupdate (newValue) {
    this.setAttribute('autoupdate', newValue)
  }

  _contentUpdated(mutationsList, observer) {
    let fragment = this.innerHTML
    while (fragment.length != this.innerHTML.length)
      fragment = this.innerHTML
    this.innerHTML = ''
    this._originalHTML += fragment
    this._renderHTML()
  }

  _renderHTML () {
    let html = this._originalHTML
    if (html != null) {
      if (this._record != null) {
        if (typeof this._record === 'object') {
          html = this._replaceIf(html, this._record)
          html = this._replaceEach(html, this._record)
        } else
          html = html.replace(/\{\{[ \t]*value[ \t]*\}\}/igm, this._record)
      }
      this._dhtmlRender.innerHTML = html.replace(/\{\{[^}]*\}\}/igm, '')
    }
    if (!this.hasAttribute('connect')) {
      this._ready = true
      this._publish('control/dhtml/ready')
    }
  }

  _replaceIf (html, record) {
    const ifBlocks = html.split(
      /(?:<!--[ \t]*)?\{\{[ \t]*@if[ \t]+([^ \t]+)[ \t]*\}\}(?:[ \t]*-->)?/im)
    let part = 0
    html = ''
    while (part < ifBlocks.length) {
      html += ifBlocks[part]
      part++
      if (part < ifBlocks.length) {
        const vhtml = ifBlocks[part+1]
          .split(/(?:<!--[ \t]*)?\{\{[ \t]*@endif[ \t]*\}\}(?:[ \t]*-->)?/im)
        if (record[ifBlocks[part]] && record[ifBlocks[part]] == true)
          html += vhtml[0]
        html += vhtml[1]
        part += 2
      }
    }
    return html
  }

  _replaceEach (html, record) {
    const eachBlocks = html.split(
      /(?:<!--[ \t]*)?\{\{[ \t]*@foreach[ \t]+([^ \t]+)[ \t]+([^ \t}]+)[ \t]*\}\}(?:[ \t]*-->)?/im)
    let part = 0
    html = ''
    while (part < eachBlocks.length) {
      let phtml = this._replaceFields(eachBlocks[part], '', record)
      html += phtml
      part++
      if (part < eachBlocks.length) {
        let field = eachBlocks[part]
        let item = eachBlocks[part+1]
        const vhtml = eachBlocks[part+2].split(/(?:<!--[ \t]*)?\{\{[ \t]*@endfor[ \t]*\}\}(?:[ \t]*-->)?/im)
        const phtml = this._replaceFields(vhtml[0], '', record)
        if (phtml.includes('{{')) {
          const it = (record != null) ? ((field == '.') ? record : record[field]) : null
          if (it != null && typeof it[Symbol.iterator] === 'function') { // check if it is iterable
            for (let i of it)
              html += this._replaceFields(
                phtml, item, i)
                // phtml, (field == '.') ? item : item + '.' + field, i)
          }
        }
        if (vhtml.length > 1)
          html += this._replaceFields(vhtml[1], '', record)
        part += 3
      }
    }
    return html
  }

  _replaceFields (html, prefix, record) {
    if (html.includes('{{')) {
      if (prefix != '') prefix += '.'
      for (let r in record) {
        if (!html.includes('{{')) break;
        let pr = prefix + r
        if (record[r] != null && typeof record[r] === 'object')
          html = this._replaceFields(html, pr, record[r])
        else {
          if (typeof record[r] === 'number' || typeof record[r] === 'boolean')
            record[r] = record[r].toString()
          const content = (record[r] == null) ? '' :
                            record[r].replace(/&/gm, '&amp;')
                                     .replace(/"/gm, '&quot;')
                                     .replace(/'/gm, '&#39;')
                                     .replace(/</gm, '&lt;')
                                     .replace(/>/gm, '&gt;')
          html = html.replace(
            new RegExp('\{\{[ \\t]*' + pr + '[ \\t]*\}\}', 'igm'), content)

          let condExp = '\{\{[ \\t]*([^?\}]+)[ \\t]*\\?[ \\t]*' + pr +
                        '[ \\t]*:[ \\t]*([^\}]+)[ \\t]*\}\}(?:="")?'
          let conditions = html.match(new RegExp(condExp, 'igm'))
          if (conditions != null)
            for (let c of conditions) {
              let inside = c.match(new RegExp(condExp, 'im'))
              html = html.replace(
                new RegExp('\{\{[ \\t]*' + inside[1] + '[ \\t]*\\?[ \\t]*' + pr +
                           '[ \\t]*:[ \\t]*' + inside[2] + '[ \\t]*\}\}(?:="")?',
                           'igm'),
                ((inside[2] == '' + content) ? inside[1] : '')
              )
            }
        }
      }
    }
    return html
  }

  notify (topic, message) {
    switch (topic.toLowerCase()) {
      case 'update': this.recordUpdate(topic, message)
                     break
    }
  }

  recordUpdate (topic, message) {
    this._record = this._extractValue(message)
    this._updateRender()
  }

  fieldUpdate (topic, message) {
    const id = MessageBus.extractLevelsSegment(topic, 3).replace(/\//g, '.')
    const value = this._extractValue(message)
    if (id == '*')
      this._record = value
    else
      this._record[id] = value
    this._updateRender()
  }

  _extractValue (message) {
     return ((message.body != null)
      ? ((message.body.value != null) ? message.body.value : message.body)
      : ((message.value != null) ? message.value : message))
  }

  _updateRender () {
    this._renderHTML()
    this._publish('web/dhtml/record/updated', DCCDHTML.elementTag)
    this._publish('control/dhtml/updated')
  }

  async connectionReady (id, topic) {
    super.connectionReady (id, topic)
    // if (topic == 'data/record/retrieve' || topic == 'service/request/get') {
    const response = await this.request('retrieve', null, id)
    this.recordUpdate(topic, response)
    //}
    this._ready = true
    this._publish('control/dhtml/ready',
      (this.hasAttribute('id')) ? {id: this.id} : null)
  }

  checkStatus (topic, message) {
    if (message == null ||
        message.id == null ||
        (this.hasAttribute('id') && message.id == this.id))
      this._publish('control/dhtml/' +
        ((this._ready) ? "ready" : "not-ready"),
        (this.hasAttribute('id')) ? {id: this.id} : null)
  }
}

(function () {
  DCCDHTML.elementTag = 'dcc-dhtml'
  DCC.webComponent(DCCDHTML.elementTag, DCCDHTML)
})()

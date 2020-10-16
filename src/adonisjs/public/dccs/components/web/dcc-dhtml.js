/* Dynamic HTML DCC
  *****************/

class DCCDHTML extends DCCBase {
  connectedCallback () {
    this._originalHTML = this.innerHTML
    console.log('=== original HTML')
    console.log(this._originalHTML)
    this.recordUpdate = this.recordUpdate.bind(this)
    super.connectedCallback()
    this._renderHTML()
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
      else {
        const content = (record[r] == null) ? '' :
                          record[r].replace(/&/gm, '&amp;')
                                   .replace(/"/gm, '&quot;')
                                   .replace(/'/gm, '&#39;')
                                   .replace(/</gm, '&lt;')
                                   .replace(/>/gm, '&gt;')
        html = html.replace(new RegExp('\{\{[ \t]*' + pr + '[ \t]*\}\}', 'igm'), content)
      }
    }
    return html
  }

  notify (topic, message) {
    if (message.role != null) {
      switch (message.role) {
        case 'update': this.recordUpdate(topic, message)
                       break
      }
    }
  }

  recordUpdate (topic, message) {
<<<<<<< Updated upstream
    // console.log('=== record update')
    // console.log(topic)
    // console.log(message)
=======
>>>>>>> Stashed changes
    this._record = ((message.body)
      ? ((message.body.value) ? message.body.value : message.body)
      : ((message.value) ? message.value : message))
    this._renderHTML()
    MessageBus.int.publish('web/dhtml/record/updated', DCCDHTML.elementTag)
  }

  async connectionReady (id, topic) {
    super.connectionReady (id, topic)
<<<<<<< Updated upstream
    // console.log('=== ready')
    // console.log(topic)
    // console.log(id)
    // console.log(this._connections)
=======
>>>>>>> Stashed changes
    if (topic == 'data/record/retrieve' || topic == 'service/request/get') {
      const response = await this.request('retrieve', null, id)
      this.recordUpdate(topic, response)
    }
  }
}

(function () {
  DCCDHTML.elementTag = 'dcc-dhtml'
  DCC.webComponent(DCCDHTML.elementTag, DCCDHTML)
})()

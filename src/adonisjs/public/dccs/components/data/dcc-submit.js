/**
 * Transforms data from a form in a REST submission
 */

class DCCSubmit extends DCCButton {
  async connectTo (trigger, id, topic) {
    super.connectTo(trigger, id, topic)
    if (trigger == 'schema') {
      const result = await this.request(trigger, null, id)
      if (result != null && result[id] != null)
        this._schema = result[id]
    }
  }

  async _computeTrigger () {
    if (this._active) {
      const message = { sourceType: this.nodeName.toLowerCase() }
      const topic = (this.hasAttribute('topic'))
        ? this.topic
        : (this.hasAttribute('variable'))
          ? 'var/' + this.varible + '/changed'
          : 'button/' + this.label + '/clicked'
      if (this.hasAttribute('message')) { message.value = this.message }
      let form = null
      if (this._schema != null) {
        const schema = Object.keys(this._schema)
        for (let s of schema) {
          let field = document.querySelector('#' + s)
          if (field != null)
            message[s] = field.value
        }
      } else {
        form = this.parentNode
        while (form != null && form.nodeName.toLowerCase() != 'form')
          form = form.parentNode
        message.value = {}
        if (form != null)
          for (let f of form)
            message.value[f.id] = f.value
      }
      if (this._checkPre(message, form)) {
          if (this._connections != null) {
          const response = await this.multiRequest('submit', message)
          if (this._setup != null && this._setup.pos != null)
            this._setup.pos(response)
        } else
          MessageBus.ext.publish(topic, message)
      }
    }
  }

  _checkPre(message, form) {
    let result = true
    if (this._setup != null && this._setup.pre != null)
      result = this._setup.pre(message, form, this._schema)
    return result
  }
}

(function () {
  DCC.webComponent('dcc-submit', DCCSubmit)
})()

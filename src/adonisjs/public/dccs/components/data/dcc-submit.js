/**
 * Transforms data from a form in a REST submission
 */

class DCCSubmit extends DCCButton {
  async connectTo (id, topic, role) {
    super.connectTo(id, topic, role)
    console.log('=== submit connect')
    console.log(id)
    console.log(topic)
    console.log(role)
    if (role == 'schema') {
      const result = await this.request(role, null, id)
      if (result != null && result[id] != null)
        this._schema = result[id]
      console.log('=== requested schema')
      console.log(this._schema)
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
      if (this._schema != null) {
        const schema = Object.keys(this._schema)
        console.log('=== form schema')
        console.log(schema)
        for (let s of schema) {
          let field = document.querySelector('#' + s)
          if (field != null)
            message[s] = field.value
        }
      } else {
        let form = this.parentNode
        while (form != null && form.nodeName.toLowerCase() != 'form')
          form = form.parentNode
        message.value = {}
        if (form != null)
          for (let f of form)
            message.value[f.id] = f.value
      }
      console.log('=== form')
      console.log(topic)
      console.log(message)
      console.log(this._connections)
      if (this._connections != null) {
        const response = await this.multiRequest('submit', message)
        if (this._setup != null && this._setup.pos != null)
          this._setup.pos(response)
      } else
        MessageBus.ext.publish(topic, message)
    }
  }
}

(function () {
  DCC.webComponent('dcc-submit', DCCSubmit)
})()

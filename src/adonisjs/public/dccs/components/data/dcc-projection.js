/* Projection DCC
  ************/

class DCCProjection extends DCCBase {
  connectedCallback () {
    super.connectedCallback()
  }

  /* Attribute Handling */

  static get observedAttributes () {
    return DCCBase.observedAttributes.concat(['fields'])
  }

  get fields () {
    return this.getAttribute('fields')
  }

  set fields (newValue) {
    this.setAttribute('fields', newValue)
  }

  notify (topic, message) {
    if (!topic.includes('/'))
      topic = 'table/' + topic
    switch (topic.toLowerCase()) {
      case 'table/update':
        this._value = ((message.value) ? message.value : message)
        this._updateTable(this._value.table)
        break
    }
  }

  _updateTable (table) {
    if (this.hasAttribute('fields') && table.schema) {
      const fields = this.fields.split(',')
      for (const f in fields)
        fields[f] = fields[f].trim()
      const prj = []
      for (const f of fields) {
        const p = table.schema.indexOf(f)
        if (p > -1)
          prj.push(p)
      }
      const nTable = {
        schema: fields,
        content: []
      }
      for (const c of table.content) {
        const line = []
        for (const p of prj)
          line.push(c[p])
        nTable.content.push(line)
      }
      this._publish('table/projected',
        {
          table: nTable
        })
    }
  }
}

(function () {
  DCC.webComponent('dcc-projection', DCCProjection)
})()

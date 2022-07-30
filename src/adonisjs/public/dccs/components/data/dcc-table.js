/* Presents a Table
  *****************/

class DCCTable extends DCCVisual {
  constructor() {
    super()
  }

  connectedCallback () {
    super.connectedCallback()
    this.render()
  }

  render() {
    if (!this.shadowRoot) {
      const template = document.createElement('template')
      template.innerHTML = DCCTable.templateHTML
        .replace(/{width}/igm, this.hasAttribute('width') ?
          'width: ' + this.getAttribute('width') + ';' : '')
        .replace(/{height}/igm, this.hasAttribute('height') ?
          'height: ' + this.getAttribute('height') + ';' : '')
      const shadow = this.attachShadow({ mode: 'open' })
      shadow.appendChild(template.content.cloneNode(true))
      this._tableContent = shadow.querySelector('#table-content')
      this._tableView = shadow.querySelector('#presentation-dcc')
    }
  }

  retrieve(field, index) {
    if (this._table && this._table.schema) {
      const column = this._table.schema.indexOf(field)
      if (column > -1 && this._table.content[index-1]) {
        console.log('=== ' + field.replace(/\./g, '/'))
        console.log(this._table.content[index-1][column])
        this._publish('var/set/' + field.replace(/\./g, '/'),
                      this._table.content[index-1][column])
      }
    }
  }

  notify (topic, message) {
    if (!topic.includes('/'))
      topic = 'table/' + topic
    switch (topic.toLowerCase()) {
      case 'table/update':
        this._value = ((message.value) ? message.value : message)
        this._updateTable(this._value.table)
        break
      default:
        if (tp.startsWith('table/retrieve/')) {
          const value = ((message.body != null)
            ? ((message.body.value != null) ? message.body.value : message.body)
            : ((message.value != null) ? message.value : message))
          this.retrieve(tp.substring(15), value)
        }
        break
    }
  }

  _updateTable (table) {
    let htmlTable = '<table>'
    if (table.schema) {
      htmlTable += '<tr>'
      for (const c of table.schema)
        htmlTable += '<th>' + c + '</th>'
      htmlTable += '</tr>'
    }
    for (const l of table.content) {
      htmlTable += '<tr>'
      for (const c of l)
        htmlTable += '<td>' + c + '</td>'
      htmlTable += '</tr>'
    }
    htmlTable += '</table>'
    this._tableView.innerHTML = htmlTable
  }
}

(function () {
  DCC.webComponent('dcc-table', DCCTable)

  DCCTable.templateHTML =
`<style>
#presentation-dcc {
  overflow: scroll;
  {width}
  {height}
}
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
}
td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
tr:nth-child(even) {
  background-color: #dddddd;
}
</style>
<div id="table-content" style="display:none"><slot></slot></div>
<div id="presentation-dcc"></div>`
})()

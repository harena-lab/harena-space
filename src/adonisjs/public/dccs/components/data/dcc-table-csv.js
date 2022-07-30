/* Proccess an CSV Content
  ************************/

class DCCTableCSV extends DCCVisual {
  constructor() {
    super()
    this._tableUpdated = this._tableUpdated.bind(this)
    this._tableDrag = this._tableDrag.bind(this)
    this._tableDropped = this._tableDropped.bind(this)
  }

  connectedCallback () {
    super.connectedCallback()

    this._observer = new MutationObserver(this._tableUpdated)
    this._observer.observe(this,
                           {attributes: true, childList: true, subtree: true})

    this.render()
    this._tableUpdated()
  }

  render() {
    if (!this.shadowRoot) {
      const template = document.createElement('template')
      template.innerHTML = DCCTableCSV.templateHTML
        .replace(/{width}/igm, this.hasAttribute('width') ?
          'width: ' + this.getAttribute('width') + ';' : '')
        .replace(/{height}/igm, this.hasAttribute('height') ?
          'height: ' + this.getAttribute('height') + ';' : '')
      const shadow = this.attachShadow({ mode: 'open' })
      shadow.appendChild(template.content.cloneNode(true))
      this._tableContent = shadow.querySelector('#table-content')
      this._tableView = shadow.querySelector('#presentation-dcc')

      this._dropZone = shadow.querySelector('#drop-zone')
      this._dropZone.addEventListener('drop', this._tableDropped)
      this._dropZone.addEventListener('dragover', this._tableDrag)
    }
  }

  static get observedAttributes () {
    return DCCVisual.observedAttributes.concat(
      ['drop', 'view', 'schema', 'content', 'separator'])
  }

  get drop () {
    return this.hasAttribute('drop')
  }

  set drop (hasDrop) {
    if (hasDrop) { this.setAttribute('drop', '') }
    else { this.removeAttribute('drop') }
  }

  get view () {
    return this.hasAttribute('view')
  }

  set view (hasView) {
    if (hasView) { this.setAttribute('view', '') }
    else { this.removeAttribute('view') }
  }

  get schema () {
    return this.getAttribute('schema')
  }

  set schema (newValue) {
    this.setAttribute('schema', newValue)
  }

  get content () {
    return this.getAttribute('content')
  }

  set content (newValue) {
    this.setAttribute('content', newValue)
  }

  get separator () {
    return this.getAttribute('separator')
  }

  set separator (newValue) {
    this.setAttribute('separator', newValue)
  }

  _tableDrag (event) {
    this._dropZone.innerHTML = 'Drop your file here'
    event.preventDefault()
  }

  async _tableDropped (event) {
    event.preventDefault();

    let file = null
    if (event.dataTransfer.items) {
      for (let item of event.dataTransfer.items) {
        if (item.kind === 'file')
          file = item.getAsFile()
      }
    } else
      file = event.dataTransfer.files[0]
    const content = await file.text()
    console.log('file = ' + content)

    this._hideDropZone()
    this._processTable(content)
  }

  _tableUpdated (mutationsList, observer) {
    let content = (this.hasAttribute('content'))
      ? this.content.replace(/;/g, '\n') : this.innerHTML.trim()
    if (content.length > 0) {
      this._hideDropZone()
      this._processTable(content)
    }
  }

  _processTable (csv) {
    const sep = (this.hasAttribute('separator')) ? this.separator : ','
    const lineRE =
      new RegExp('(?:^|' + sep + ')[ \\t]*(?:(?:"([^"]*)")|([^' + sep + ']*))',
      'g')

    let prSchema = false
    let lines = csv.split(/\r\n|\r|\n/)
    this._table = {
    }
    if (this.hasAttribute('schema')) {
      prSchema = true
      if (this.schema.length > 0)
        lines.unshift(this.schema)
    }
    const content = []
    for (let l of lines) {
      let cells = l.matchAll(lineRE)
      let ln = []
      for (const c of cells) {
        if (c[0] != null && c[0].length > 0)
          ln.push((c[1] != null) ? c[1] : c[2])
      }
      if (prSchema) {
        this._table.schema = ln
        prSchema = false
      } else if (ln.length > 0)
        content.push(ln)
    }
    this._table.content = content

    if (this.view) {
      let htmlTable = '<table>'
      if (this._table.schema) {
        htmlTable += '<tr>'
        for (const c of this._table.schema)
          htmlTable += '<th>' + c + '</th>'
        htmlTable += '</tr>'
      }
      for (const l of this._table.content) {
        htmlTable += '<tr>'
        for (const c of l)
          htmlTable += '<td>' + c + '</td>'
        htmlTable += '</tr>'
      }
      htmlTable += '</table>'
      this._tableView.innerHTML = htmlTable
    }

    console.log('===== table')
    console.log(this._table)
    this._publish('table/updated',
      {
        table: this._table,
        csv: csv
      })
  }

  _hideDropZone () {
    this._dropZone.removeEventListener('drop', this._tableDropped)
    this._dropZone.removeEventListener('dragover', this._tableDrag)
    this._dropZone.style.display = 'none'
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

  async notify (topic, message) {
    const tp = topic.toLowerCase()
    if (tp.startsWith('table/retrieve/')) {
      const value = ((message.body != null)
        ? ((message.body.value != null) ? message.body.value : message.body)
        : ((message.value != null) ? message.value : message))
      this.retrieve(tp.substring(15), value)
    }
  }
}

(function () {
  DCC.webComponent('dcc-table-csv', DCCTableCSV)

  DCCTableCSV.templateHTML =
`<style>
#drop-zone {
  border: 5px solid;
  {width}
  {height}
}
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
<div id="drop-zone">Drop Zone</div>
<div id="presentation-dcc"></div>`
})()

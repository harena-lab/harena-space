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
    return DCCVisual.observedAttributes.concat(['drop', 'view', 'separator'])
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

  set messages (hasView) {
    if (hasView) { this.setAttribute('view', '') }
    else { this.removeAttribute('view') }
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
    const content = this.innerHTML.trim()
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

    let lines = csv.split(/\r\n|\r|\n/)
    this._table = []
    for (let l of lines) {
      let cells = l.matchAll(lineRE)
      let ln = []
      for (const c of cells)
        ln.push((c[1] != null) ? c[1] : c[2])
      this._table.push(ln)
    }

    let htmlTable = '<table>'
    let open = '<th>'
    let close = '</th>'
    for (let l of this._table) {
      htmlTable += '<tr>'
      for (let c of l)
        htmlTable += open + c + close
      htmlTable += '</tr>'
      open = '<td>'
      close = '</td>'
    }
    htmlTable += '</table>'
    this._tableView.innerHTML = htmlTable

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

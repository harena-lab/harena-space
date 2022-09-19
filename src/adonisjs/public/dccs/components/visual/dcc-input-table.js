/**
 * Input Table DCC
 *****************/

class DCCInputTable extends DCCInput {
  constructor () {
    super()
    this.inputChanged = this.inputChanged.bind(this)
  }

  async connectedCallback () {
    if (!this.hasAttribute('rows')) { this.rows = 2 }

    if (!this.hasAttribute('cols')) {
      if (this.hasAttribute('schema'))
        this.cols = this.schema.split(',').length
      else
        this.cols = 2
    }

    this._value = []
    for (let r = 0; r < this.rows; r++)
      this._value.push(new Array(parseInt(this.cols)).fill(null))

    if (this.hasAttribute('initialize')) {
      if (this._hasSubscriber(
          'var/get/' + this.initialize.replace(/\./g, '/'), true)) {
        let mess = await this._request(
          'var/get/' + this.initialize.replace(/\./g, '/'), null, null, true)
        if (mess.message != null) {
          for (let r = 0; r < this.rows; r++)
            for (let c = 0; c < this.cols; c++)
              if (mess.message[r]) {
                if (Array.isArray(mess.message[r]) && mess.message[r][c])
                  this._value[r][c] = mess.message[r][c]
                else
                  this._value[r][0] = mess.message[r]
              }
        }
        console.log(this._value)
      }
    }

    super.connectedCallback()
    this.innerHTML = ''

    this._publish('input/ready/' + this._variable.replace(/\./g, '/'),
                  DCCInputTable.elementTag)
  }

  disconnectedCallback () {
    if (this._inputSet != null) {
      for (const i of this._inputSet) {
        if (i != null) { i.removeEventListener('change', this.inputChanged) }
      }
    }
  }

  /*
    * Property handling
    */

  static get observedAttributes () {
    return DCCInput.observedAttributes.concat(
      ['rows', 'cols', 'schema', 'initialize', 'freeze', 'player'])
  }

  get rows () {
    return this.getAttribute('rows')
  }

  set rows (newValue) {
    this.setAttribute('rows', newValue)
  }

  get cols () {
    return this.getAttribute('cols')
  }

  set cols (newValue) {
    this.setAttribute('cols', newValue)
  }

  get schema () {
    return this.getAttribute('schema')
  }

  set schema (newValue) {
    this.setAttribute('schema', newValue)
  }

  get initialize () {
    return this.getAttribute('initialize')
  }

  set initialize (newValue) {
    this.setAttribute('initialize', newValue)
  }

  get freeze () {
    return this.getAttribute('freeze')
  }

  set freeze (newValue) {
    this.setAttribute('freeze', newValue)
  }

  get player () {
    return this.getAttribute('player')
  }

  set player (newValue) {
    this.setAttribute('player', newValue)
  }

  /* Event handling */

  inputChanged (event) {
    this.changed = true

    let id = event.target.id
    let p = id.lastIndexOf('_')
    const col = parseInt(id.substring(p + 1)) - 1
    id = id.substring(0, p)
    p = id.lastIndexOf('_')
    const row = parseInt(id.substring(p + 1)) - 1
    this._value[row][col] = event.target.value

    let v = this._value
    // extracts an array if it has only one dimension
    if (this.cols == 1) {
      v = []
      for (let c of this._value)
        v.push(c[0])
    }

    this._publish('input/changed/' + this._variable.replace(/\./g, '/'),
      {
        sourceType: DCCInputTable.elementTag,
        value: v
      }, true)
  }

  /* Rendering */

  elementTag () {
    return DCCInputTable.elementTag
  }

  externalLocationType () {
    return 'input'
  }

  // _injectDCC(presentation, render) {
  async _renderInterface () {
    const templateElements =
      "<style> @import '" +
         DCCVisual.themeStyleResolver('dcc-input-table.css') +
      "' </style>" +
      "<div id='presentation-dcc-input'>" +
         '[statement]' +
         "<table id='[variable]' class='[render]'>[content]</table>" +
      '</span>'

    // === pre presentation setup
    const statement = (this._xstyle.startsWith('out'))
                        ? '' : this._statement

    let content = ''
    const ro = {}
    if (this.hasAttribute("freeze")) {
      const fr = this.freeze.split(',')
      for (let f of fr)
        ro[f.trim()] = true
    }
    const types = []
    const readonly = []
    if (this.hasAttribute('schema')) {
      content += '<tr>'
      const sch = this.schema.split(',')
      for (const s of sch) {
        const schtype = s.split(':')
        types.push((schtype.length > 1) ? schtype[1].trim() : 's')
        readonly.push((ro[schtype[0].trim()]) ? ' readonly' : '')
        content += '<th>' + schtype[0].trim() + '</th>'
      }
      content += '</tr>'
    }

    if (this.hasAttribute('player')) {
      const value = await this._request(
        'var/get/>/' + this.player.replace(/\./g, '/'),
        this.innerHTML, null, true)
      const input = value.message
      const nr = (input.length < value.length) ? input.length : value.length
      const nc = (input[0].length < value[0].length) ? input[0].length : value[0].length
      for (let r = 0; r < nr; r++) {
        for (let c = 0; c < nc; c++) { this._value[r][c] = input[r][c] }
      }
    }

    for (let r = 0; r < this.rows; r++) {
      content += '<tr>'
      for (let c = 0; c < this.cols; c++) {
        content += '<td>' + DCCInputTable.cellHTML[types[c]]
                     .replace('[id]', this._variable + '_' + (r+1) + '_' + (c+1))
                     .replace('[value]', (this._value[r][c] == null)
                                          ? '' : this._value[r][c])
                     .replace('[readonly]', readonly[c]) +
                   '</td>'
      }
      content += '</tr>'
    }

    const html = templateElements
      .replace('[statement]', statement)
      .replace('[variable]', this._variable)
      .replace('[render]', this._renderStyle())
      .replace('[content]', content)

    // === presentation setup (DCC Block)
    let presentation
    if (this._xstyle.startsWith('out')) {
      await this._applyRender(this._statement, 'innerHTML', 'text')
      presentation = await this._applyRender(html, 'innerHTML', 'input')
    } else { presentation = await this._applyRender(html, 'innerHTML', 'input') }

    // === post presentation setup
    if (presentation != null) {
      this._inputSet = []
      for (let r = 1; r <= this.rows; r++) {
        for (let c = 1; c <= this.cols; c++) {
          const v = presentation.querySelector(
            '#' + this._variable.replace(/\./g, '\\.') + '_' + r + '_' + c)
          // getElementById(this._variable + '_' + r + '_' + c)
          v.addEventListener('change', this.inputChanged)
          this._inputSet.push(v)
        }
      }
    }

    this._presentationIsReady()
  }
}

(function () {
  DCCInputTable.elementTag = 'dcc-input-table'
  DCCInputTable.editableCode = false
  customElements.define(DCCInputTable.elementTag, DCCInputTable)

  DCCInputTable.cellHTML = {
    's' : '<input type="text" id="[id]" value="[value]"[readonly]></input>',
    't' : '<textarea id="[id]"[readonly]>[value]</textarea>'
  }
})()

/**
 * Input Typed DCC
 *****************/

class DCCInputTyped extends DCCInput {
  constructor () {
    super()
    this.inputTyped = this.inputTyped.bind(this)
    this.inputChanged = this.inputChanged.bind(this)
  }

  connectedCallback () {
    super.connectedCallback()
    this.innerHTML = ''

    this._publish('input/ready/' + this._variable.replace(/\./g, '/'),
      DCCInputTyped.elementTag)
  }

  /*
    * Property handling
    */

  static get observedAttributes () {
    return DCCInput.observedAttributes.concat(
      ['itype', 'rows', 'vocabularies'])
  }

  get itype () {
    return this.getAttribute('itype')
  }

  set itype (newValue) {
    this.setAttribute('itype', newValue)
  }

  get rows () {
    return this.getAttribute('rows')
  }

  set rows (newValue) {
    this.setAttribute('rows', newValue)
  }

  get vocabularies () {
    return this.getAttribute('vocabularies')
  }

  set vocabularies (newValue) {
    this.setAttribute('vocabularies', newValue)
  }

  /* Event handling */

  inputTyped () {
    this.changed = true
    this.value = this._inputVariable.value
    this._publish('input/typed/' + this._variable.replace(/\./g, '/'),
      {
        sourceType: DCCInputTyped.elementTag,
        value: this.value
      }, true)
  }

  inputChanged () {
    this.changed = true
    this.value = this._inputVariable.value
    this._publish('input/changed/' + this._variable.replace(/\./g, '/'),
      {
        sourceType: DCCInputTyped.elementTag,
        value: this.value
      }, true)
  }

  /* Rendering */

  elementTag () {
    return DCCInputTyped.elementTag
  }

  externalLocationType () {
    return 'input'
  }

  // _injectDCC(presentation, render) {
  async _renderInterface () {
    // === pre presentation setup
    const statement = (this._xstyle.startsWith('out'))
                        ? '' : this._statement

    let html
    if (this.hasAttribute('rows') && this.rows > 1) {
      html = DCCInputTyped.templateElements.area
        .replace('[statement]', statement)
        .replace('[rows]', this.rows)
        .replace('[variable]', this._variable)
        .replace('[render]', this._renderStyle())
    } else {
      html = DCCInputTyped.templateElements.text
        .replace('[statement]', statement)
        .replace('[variable]', this._variable)
        .replace('[render]', this._renderStyle())
        .replace('[itype]', (this.hasAttribute('itype'))
          ? " type='" + this.itype + "'" : '')
    }

    // === presentation setup (DCC Block)
    let presentation
    if (this._xstyle.startsWith('out')) {
      await this._applyRender(this._statement, 'innerHTML', 'text')
      presentation = await this._applyRender(html, 'innerHTML', 'input')
    } else { presentation = await this._applyRender(html, 'innerHTML', 'input') }

    // === post presentation setup
    const selector = '#' + this._variable.replace(/\./g, '\\.')
    this._inputVariable = presentation.querySelector(selector)
    this._inputVariable.addEventListener('input', this.inputTyped)
    this._inputVariable.addEventListener('change', this.inputChanged)

    this._presentationIsReady()
  }

  // <TODO> provisory - deactivate button edit
  _activateAuthorPresentation (presentation, listener) {}
}

(function () {
  // <TODO> temporary (size = 50)
  // <TODO> temporary (width: 100%)
  // <TODO> transfer the definition of font to CSS
  DCCInputTyped.templateElements = {
    text: "<div class='[render]'><label>[statement]</label><input type='text' id='[variable]' [itype]></input></div>",
    area: "<div class='[render]'><label>[statement]</label><textarea placeholder='You can write here...' rows='[rows]' style='width:100%' id='[variable]'></textarea></div>"
  }

  DCCInputTyped.elementTag = 'dcc-input-typed'
  DCCInputTyped.editableCode = false
  customElements.define(DCCInputTyped.elementTag, DCCInputTyped)
})()

/**
 * Slider DCC
 ***********/

class DCCSlider extends DCCInput {
  constructor () {
    super()
    this.inputChanged = this.inputChanged.bind(this)
  }

  connectedCallback () {
    // <TODO> replicated provisory
    if (this.hasAttribute('variable'))
      this._variable = this.getAttribute('variable')
    else
      this._variable = DCC.generateVarName()

    this._min = (this.hasAttribute('min')) ? this.min : DCCSlider.defaultValueMin
    this._max = (this.hasAttribute('max')) ? this.max : DCCSlider.defaultValueMax

    this._value = (this.hasAttribute('value')) ? parseInt(this.value) :
        Math.round((parseInt('' + this._min) + parseInt('' + this._max)) / 2)

    super.connectedCallback()
    this.innerHTML = ''

    this._publish('input/ready/' + this._variable.replace(/\./g, '/'),
      DCCSlider.elementTag)
  }

  /*
    * Property handling
    */

  static get observedAttributes () {
    return DCCInput.observedAttributes.concat(
      ['min', 'max', 'index'])
  }

  get min () {
    return this.getAttribute('min')
  }

  set min (newValue) {
    this._min = newValue
    this.setAttribute('min', newValue)
  }

  get max () {
    return this.getAttribute('max')
  }

  set max (newValue) {
    this._max = newValue
    this.setAttribute('max', newValue)
  }

  get index () {
    return this.hasAttribute('index')
  }

  set index (hasIndex) {
    if (hasIndex) { this.setAttribute('index', '') } else { this.removeAttribute('index') }
  }

  /* Event handling */

  inputChanged () {
    this.changed = true
    this._value = this._inputVariable.value
    if (this._inputIndex) { this._inputIndex.innerHTML = this._value }
    this._publish('input/changed/' + this._variable.replace(/\./g, '/'),
      {
        sourceType: DCCSlider.elementTag,
        value: this._value
      }, true)
  }

  /* Rendering */

  elementTag () {
    return DCCSlider.elementTag
  }

  externalLocationType () {
    return 'input'
  }

  // _injectDCC(presentation, render) {
  async _renderInterface () {
    // === pre presentation setup
    const statement = (this._xstyle.startsWith('out'))
                        ? '' : this._statement

    const index = (this.index)
      ? "<span id='" + this._variable + "-index'>" +
              ((this.mandatory) ? '  ' : this._value) +
           '</span>'
      : ''

    const html = DCCSlider.templateElement
      .replace('[statement]', statement)
      .replace('[variable]', this._variable)
      .replace('[value]', this._value)
      .replace('[min]', this._min)
      .replace('[max]', this._max)
      .replace('[render]', this._renderStyle())
      .replace('[index]', index)

    // === presentation setup (DCC Block)
    let presentation
    if (this._xstyle.startsWith('out')) {
      await this._applyRender(this._statement, 'innerHTML', 'text')
      presentation = await this._applyRender(html, 'innerHTML', 'slider')
    } else { presentation = await this._applyRender(html, 'innerHTML', 'slider') }

    // === post presentation setup
    const selector = '#' + this._variable.replace(/\./g, '\\.')
    this._inputVariable = presentation.querySelector(selector)
    this._inputVariable.oninput = this.inputChanged
    if (this.hasAttribute('index')) { this._inputIndex = presentation.querySelector(selector + '-index') }

    this._presentationIsReady()
  }
}

(function () {
  DCCSlider.templateElement =
`[statement]&nbsp;
<div style="width:100%; display:flex; flex-direction:row">
   <span style="flex:initial">[index]&nbsp;</span>
   <input type="range" id="[variable]" min="[min]" max="[max]"
          value="[value]" class="[render]" style="flex:auto">
</div>`

  DCCSlider.defaultValueMin = 0
  DCCSlider.defaultValueMax = 100

  DCCSlider.elementTag = 'dcc-slider'
  customElements.define(DCCSlider.elementTag, DCCSlider)
})()

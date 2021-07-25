/* Progress Bar DCC
  *****************/
class DCCProgress extends DCCVisual {
  constructor () {
    super()
  }

  connectedCallback () {
    this._min = (this.hasAttribute('min')) ? this.min : DCCProgress.defaultValueMin
    this._max = (this.hasAttribute('max')) ? this.max : DCCProgress.defaultValueMax
    this._value = (this.hasAttribute('value')) ? this.value : '0%'

    const html = DCCProgress.svgTemplate
      .replace(/\[width\]/g,
        (this.hasAttribute('width')) ? this.width : 150)
      .replace(/\[height\]/g,
        (this.hasAttribute('height')) ? this.height : 25)

    let presentation = this._shadowHTML(html)
    this._progressBar = presentation.querySelector('#progress-bar')
    this._progressValue =
      presentation.querySelector('#progress-value').childNodes[0]
    this._setPresentation(presentation)
    super.connectedCallback()

    this._updateProgressBar()

    this._presentationIsReady()
  }

  /*
    * Property handling
    */

  static get observedAttributes () {
    return DCCVisual.observedAttributes.concat(
      ['value', 'min', 'max', 'index'])
  }

  get value () {
    return this.getAttribute('value')
  }

  set value (newValue) {
    this.setAttribute('value', newValue)
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

  notify (topic, message) {
    if (!topic.includes('/'))
      topic = 'action/' + topic
    switch (topic.toLowerCase()) {
      case 'action/update':
        this._value = ((message.value) ? message.value : message)
        this._updateProgressBar()
        break
    }
  }

  _updateProgressBar () {
    this._progressBar.setAttribute('width',
      (this._value.endsWith('%')) ? this._value :
      (parseInt(this._value)*100/(parseInt(this._max)-parseInt(this._min))) + '%')
    if (this.index)
      this._progressValue.nodeValue = this._value
  }
}

(function () {
  customElements.define('dcc-progress', DCCProgress)

  DCCProgress.defaultValueMin = 0
  DCCProgress.defaultValueMax = 100

  DCCProgress.svgTemplate =
`<style>
  .dcc-progress-back {fill: var(--dcc-progress-back);}
  .dcc-progress-front {fill: var(--dcc-progress-front);}
</style>
<div id="progress-wrapper">
<svg id="presentation-dcc" width="[width]" height="[height]" xmlns="http://www.w3.org/2000/svg">
  <rect class="dcc-progress-back" x="0" y="0" width="100%" height="100%"/>
  <rect id="progress-bar" class="dcc-progress-front" x="0" y="0" width="0%" height="100%"/>
  <text id="progress-value" dominant-baseline="middle" x="10px" y="50%">&nbsp;</text>
</svg>
</div>`
})()

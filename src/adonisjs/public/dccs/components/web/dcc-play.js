/* Mini Environment to Play
  *************************/

class DCCPlay extends DCCVisual {
  constructor() {
    super()
    this._computeRender = this._computeRender.bind(this)
    this._unlockScript = this._unlockScript.bind(this)
    this._scriptUpdated = this._scriptUpdated.bind(this)
  }

  connectedCallback () {
    this._observer = new MutationObserver(this._scriptUpdated)
    this._observer.observe(this,
                           {attributes: true, childList: true, subtree: true})
    const template = document.createElement('template')
    template.innerHTML =
    '<div id="presentation-dcc"><textarea style="width:97%;cursor:pointer" id="script-dcc" readonly>' +
    this.innerHTML.replace('=""', '').trim() +
    '</textarea><button id="button-render" style="width:auto;display:none">Render</button>' +
    '<div id="render-dcc"><slot></slot></div></div>'
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' })
      shadow.appendChild(template.content.cloneNode(true))
      this._setPresentation(shadow.querySelector('#presentation-dcc'))
      shadow.querySelector('#button-render')
            .addEventListener('click', this._computeRender)
      this._scriptPanel = shadow.querySelector('#script-dcc')
      this._scriptPanel.addEventListener('click', this._unlockScript)
      this._renderPanel = shadow.querySelector('#render-dcc')
      this._buttonRender = shadow.querySelector('#button-render')
      this._presentationIsReady()
    }
    super.connectedCallback()
  }

  _computeRender() {
    if (this._scriptPanel != null)
      this._renderPanel.innerHTML = this._scriptPanel.value
  }

  _unlockScript() {
    this._scriptPanel.removeEventListener('click', this._unlockScript)
    this._scriptPanel.style.width = '90%'
    this._scriptPanel.readOnly = false
    this._buttonRender.style.display = 'initial'
  }

  _scriptUpdated(mutationsList, observer) {
    this._scriptPanel.value = this.innerHTML.replace('=""', '').trim()
  }
}

(function () {
  DCC.webComponent('dcc-play', DCCPlay)
})()

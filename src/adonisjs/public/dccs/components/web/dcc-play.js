/* Mini Environment to Play
  *************************/

class DCCPlay extends ScopeDCC {
  constructor() {
    super()
    this._computeRender = this._computeRender.bind(this)
    this._unlockScript = this._unlockScript.bind(this)
    this._scriptUpdated = this._scriptUpdated.bind(this)
  }

  connectedCallback () {
    super.connectedCallback()
    this._observer = new MutationObserver(this._scriptUpdated)
    this._observer.observe(this,
                           {attributes: true, childList: true, subtree: true})

    let html = this._prepareHTML()

    const template = document.createElement('template')
    template.innerHTML =
    // '<div id="presentation-dcc">' +
    '<textarea style="width:97%;cursor:pointer;font-family:var(--dcc-play-font-family);' +
      'font-size:var(--dcc-play-font-size);background-color:var(--dcc-play-background-color)" rows="' +
    html.split(/\r\n|\r|\n/).length + '" id="script-dcc" readonly>' + html +
    '</textarea><button id="button-render" style="width:auto;display:none">Render</button>' +
    '<scope-dcc><div id="render-dcc"><slot></slot></div></scope-dcc>'
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' })
      shadow.appendChild(template.content.cloneNode(true))
      // this._setPresentation(shadow.querySelector('#presentation-dcc'))
      shadow.querySelector('#button-render')
            .addEventListener('click', this._computeRender)
      this._scriptPanel = shadow.querySelector('#script-dcc')
      this._scriptPanel.addEventListener('click', this._unlockScript)
      this._renderPanel = shadow.querySelector('#render-dcc')
      this._buttonRender = shadow.querySelector('#button-render')
      // this._presentationIsReady()
    }
  }

  _prepareHTML () {
    let html = this.innerHTML.replace('=""', '')
                             .replace(/^[\r\n]+/, '')
                             .replace(/[\r\n]+$/, '')
    if (html.startsWith(' ') || html.startsWith('\t')) {
      let indent = html.match(/^[ \t]+/)
      html = html.replace(new RegExp('^' + indent, 'gm'), '')
    }
    return html
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
    let html = this._prepareHTML()
    this._scriptPanel.value = html
    this._scriptPanel.rows = html.split(/\r\n|\r|\n/).length
  }
}

(function () {
  DCC.webComponent('dcc-play', DCCPlay)
})()

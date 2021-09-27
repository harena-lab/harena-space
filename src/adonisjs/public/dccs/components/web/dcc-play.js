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

    this._messages =
      '<div id="messages-panel-{type}" style="width:97%;font-family:var(--dcc-play-font-family);' +
        'font-size:var(--dcc-play-font-size);' +
        'background-color:var(--dcc-play-background-color);display:none">' +
      '<b>Messages on the Bus</b><br>' +
      '<dcc-monitor id="monitor-{type}"{subscribe}></dcc-monitor>' +
      '</div>'

    this._observer = new MutationObserver(this._scriptUpdated)
    this._observer.observe(this,
                           {attributes: true, childList: true, subtree: true})

    let html = this._prepareHTML()

    const template = document.createElement('template')
    template.innerHTML =
    '<textarea style="width:97%;cursor:pointer;font-family:var(--dcc-play-font-family);' +
      'font-size:var(--dcc-play-font-size);background-color:var(--dcc-play-background-color)" rows="' +
    html.split(/\r\n|\r|\n/).length + '" id="script-dcc" readonly>' + html +
    '</textarea><button id="button-render" style="width:auto;display:none">Render</button>' +
    '<scope-dcc>' +
    '<div id="render-dcc"><slot></slot></div>' +
    this._messages.replace(/{type}/gm, 'inside').replace('{subscribe}', ' subscribe="#"') +
    '</scope-dcc>' + this._messages.replace(/{type}/gm, 'outside').replace('{subscribe}', '')
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' })
      shadow.appendChild(template.content.cloneNode(true))
      shadow.querySelector('#button-render')
            .addEventListener('click', this._computeRender)
      this._scriptPanel = shadow.querySelector('#script-dcc')
      this._scriptPanel.addEventListener('click', this._unlockScript)
      this._renderPanel = shadow.querySelector('#render-dcc')
      this._buttonRender = shadow.querySelector('#button-render')
      this._messagesPanelInside = shadow.querySelector('#messages-panel-inside')
      this._messagesPanelOutside = shadow.querySelector('#messages-panel-outside')
      this._monitor = shadow.querySelector('#monitor-outside')
    }

    if (this.messages) {
      this._monitor._bus = this._bus
      this._monitor._bus.subscribe('#', this._monitor.notify)
      this._messagesPanelOutside.style.display = 'block'
    }
  }

  static get observedAttributes () {
    return ScopeDCC.observedAttributes.concat(['messages'])
  }

  get messages () {
    return this.hasAttribute('messages')
  }

  set messages (showMessages) {
    if (showMessages) { this.setAttribute('messages', '') }
    else { this.removeAttribute('messages') }
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
    if (this._scriptPanel != null) {
      this._renderPanel.innerHTML = this._scriptPanel.value
      this._messagesPanelOutside.style.display = 'none'
      this._messagesPanelInside.style.display = 'block'
    }
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

/*
 * Versum Author Environment
 *
 * Authoring environment to test the Versum language.
 */

class AuthorVersumManager {
  constructor () {
   	// MessageBus.page = new MessageBus(false)
    Basic.service.rootPath = '../../'
    new PlayState()
    new Tracker()
    DCCCommonServer.instance.local = true
    this._theme = null
  }

  start () {
    this.translate = this.translate.bind(this)
    this.updateVisibility = this.updateVisibility.bind(this)
    this.clearConsole = this.clearConsole.bind(this)
    this.showJson = this.showJson.bind(this)
    this.convertTheme = this.convertTheme.bind(this)

    MessageBus.i.subscribe('control/translate/example', this.translate)
    MessageBus.i.subscribe('control/clear/console', this.clearConsole)
    MessageBus.i.subscribe('input/changed/output', this.updateVisibility)
    MessageBus.i.subscribe('control/theme/convert', this.convertTheme)

    document.querySelector('#json-message').value = ''
    MessageBus.i.subscribe('#', this.showJson)
  }

  async translate (topic, message) {
    Translator.instance.authoringRender = false

    Basic.service.currentThemeFamily = 'plain'
    DCCCommonServer.instance.local = true

    const compiled = await Translator.instance.compileMarkdown(
      'test', document.querySelector('#editor').value)
    document.querySelector('#object-results').value = JSON.stringify(compiled, null, 3)
    let html = ''
    for (const knot in compiled.knots) {
      // let mkHTML = await Translator.instance.generateKnotHTML(compiled.knots[knot].content);
      const mkHTML = await Translator.instance.generateHTML(compiled.knots[knot])
      html += mkHTML
    }
    if (this._theme != null)
      html = this._theme.replace('{knot}', html)
    document.querySelector('#html-panel').value = html
    document.querySelector('#render-panel').innerHTML = html
  }

  updateVisibility (topic, message) {
    for (const si in AuthorVersumManager.stateId) {
      const s = document.querySelector('#' + AuthorVersumManager.stateId[si] + '-block')
      if (s != null) {
        s.style.display =
               (AuthorVersumManager.stateVis[message.value][si] == 0) ? 'none' : 'initial'
      }
    }
  }

  showJson(topic, message) {
     if (topic != 'control/render/example')
        document.querySelector('#json-message').value =
           document.querySelector('#json-message').value +
           'topic: ' + topic + '\n' +
           'message: ' + JSON.stringify(message) + '\n\n'
  }

  clearConsole(topic, message) {
    document.querySelector('#json-message').value = ''
  }

  dragOver(event) {
    event.preventDefault()
    event.target.innerHTML = 'Upload Here'
  }

  async drop(event) {
    event.preventDefault()

    let file = null
    if (event.dataTransfer.items) {
      for (const item of event.dataTransfer.items) {
        if (item.kind === 'file')
          file = item.getAsFile()
      }
    } else
      file = event.dataTransfer.files[0]
    this._theme = await file.text()

    document.querySelector('#drop-status').innerHTML = 'Uploaded'
    event.target.innerHTML = 'Replace'
  }

  convertTheme(topic, message) {
    const a = document.createElement('a')
    a.style.display = 'none'
    document.body.appendChild(a)
    const themeName = document.querySelector('#theme-name').value
    const content = '(function () { const localTheme = `\n' +
                    this._theme + '\n`' +
                    '\nMessageBus.i.publish("control/theme/' + themeName + '/load/ready", localTheme)' +
                    '\n})()'
    a.href = window.URL.createObjectURL(
      new Blob([content], {type: 'text/plain'}))
    a.setAttribute('download', themeName + '.js')
    a.click()
    window.URL.revokeObjectURL(a.href)
    document.body.removeChild(a)
  }
}

(function () {
  AuthorVersumManager.stateId = ['versum', 'object', 'html', 'rendered']

  AuthorVersumManager.stateVis = {
    'versum-object': [1, 1, 0, 0],
    'versum-html': [1, 0, 1, 0],
    'versum-rendered': [1, 0, 0, 1],
    'object-html': [0, 1, 1, 0],
    'object-rendered': [0, 1, 0, 1]
  }

  AuthorVersumManager.s = new AuthorVersumManager()
})()

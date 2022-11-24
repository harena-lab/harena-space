/**
 * Utilities in general
 */

class Basic {
  constructor () {
    this.host = null
    this.rootPath = '../'

    // initial values of shared states
    this._currentThemeFamily = Basic.standardThemeFamily
    this._currentThemeCSS = null
    this._currentCustomCSS = null
    this.currentCaseId = null

    DCCVisual.externalResolver = this

    /*
      this.requestCurrentThemeFamily = this.requestCurrentThemeFamily.bind(this);
      MessageBus.i.subscribe("control/_current_theme_name/get",
                               this.requestCurrentThemeFamily);
      */
  }

  /*
    * Properties
    */

  get host () {
    return this._host
  }

  set host (newValue) {
    this._host = newValue
  }

  get rootPath () {
    return this._rootPath
  }

  set rootPath (newValue) {
    this._rootPath = newValue
    PrimitiveDCC.rootPath = newValue
  }

  /*
    * States shared by author, player, and other environments
    */

  get currentThemeFamily () {
    return this._currentThemeFamily
  }

  set currentThemeFamily (newValue) {
    this._currentThemeFamily = newValue
    DCCVisual.currentThemeFamily = newValue

    this._currentThemeCSS =
         this.replaceStyle(document, this._currentThemeCSS, newValue)
  }

  get currentCustomTheme () {
    return this._currentCustomTheme
  }

  set currentCustomTheme (newValue) {
    this._currentCustomTheme = newValue
    DCCVisual.currentCustomTheme = newValue

    this._currentCustomCSS =
         this.replaceStyle(document, this._currentCustomCSS, this.currentThemeFamily,
           newValue + '/theme.css')
  }

  composedThemeFamily (themeFamily) {
    const dtf = this.decomposeThemeFamily(themeFamily)
    this.currentThemeFamily = dtf.family
    this.currentCustomTheme = dtf.custom
  }

  decomposeThemeFamily (themeFamily) {
    let family = themeFamily
    let custom = 'default'
    if (family.includes('(')) {
      custom = family.substring(family.indexOf('(') + 1, family.length - 1)
      family = family.substring(0, family.indexOf('('))
    }
    return { family: family, custom: custom }
  }

  /*
   requestCurrentThemeFamily(topic, message) {
      MessageBus.i.publish(MessageBus.buildResponseTopic(topic, message),
                           this.currentThemeFamily, true);
   }
   */

  set currentCaseId (newValue) {
    this._currentCaseId = newValue
  }

  get currentCaseId () {
    return this._currentCaseId
  }

  isBlank (str) {
    return (!str || /^\s*$/.test(str))
  }

  /*
    * Authoring State
    * <TODO> Unify with State
    */
  authorStateRetrieve () {
    let state = null
    const stateS = localStorage.getItem(Basic.authorStateId)
    if (stateS != null) { state = JSON.parse(stateS) }
    // DCCCommonServer.instance.token = state.token;
    return state
  }

  authorStateStore (state) {
    localStorage.setItem(Basic.authorStateId,
      JSON.stringify(state))
  }

  authorStateClean () {
    localStorage.removeItem(Basic.authorStateId)
  }

  authorIdStore (userid, userEmail, token) {
    const state = {
      userid: userid,
      email: userEmail,
      token: token
    }
    this.authorStateStore(state)
  }

  authorPropertyStore (property, value) {
    const state = this.authorStateRetrieve()
    if (state != null) {
      state[property] = value
      this.authorStateStore(state)
    }
  }

  authorPropertyRemove (property) {
    const state = this.authorStateRetrieve()
    if (state != null && state[property]) {
      delete state[property]
      this.authorStateStore(state)
    }
  }

  screenDimensions () {
    const dimensions = {
      left: (window.screenLeft != undefined) ? window.screenLeft : window.screenX,
      top: (window.screenTop != undefined) ? window.screenTop : window.screenY,
      width: (window.innerWidth)
        ? window.innerWidth
        : (document.documentElement.clientWidth)
          ? document.documentElement.clientWidth
          : screen.width,
      height: (window.innerHeight)
        ? window.innerHeight
        : (document.documentElement.clientHeight)
          ? document.documentElement.clientHeight
          : screen.height
    }
    dimensions.zoom = dimensions.width / window.screen.availWidth
    return dimensions
  }

  centralize (width, height) {
    const dimensions = this.screenDimensions()
    return {
      left: ((dimensions.width - width) / 2) / dimensions.zoom + dimensions.left,
      top: ((dimensions.height - height) / 2) / dimensions.zoom + dimensions.top
    }
  }

  imageResolver (path) {
    let result = path
    // <TODO> improve
    if (path.startsWith('theme/')) {
      result = this._rootPath +
                  'themes/' + this.currentThemeFamily +
                  '/images/' + path.substring(6)
    } else if (path.startsWith('template_fix/')) {
      result = this._rootPath +
                  'templates/' + path.substring(13)
    } else if (path.startsWith('template/')) {
      result = this._rootPath +
                  'templates/' + this.currentThemeFamily +
                  '/images/' + path.substring(9)
    } else if (!path.includes('/')) {
      result = DCCCommonServer.managerAddress + 'resources/artifacts/cases/' +
                  ((this.host != null) ? this.currentCaseId + '/' : '') +
                  path
    }
    return result
  }

  imageAbsoluteToRelative (path) {
    const absoluteImagePrefix = DCCCommonServer.managerAddress + 'artifacts/cases/' +
                                  ((this.host != null) ? this.currentCaseId + '/' : '')
    let relative = path
    if (path.startsWith(absoluteImagePrefix)) { relative = path.substring(absoluteImagePrefix.length) }
    return relative
  }

  replaceStyle (targetDocument, oldCSS, newTheme, cssFile) {
    if (oldCSS) { targetDocument.body.removeChild(oldCSS) }

    const cssF = (cssFile) || 'theme.css'

    const newCSS = document.createElement('link')
    newCSS.setAttribute('rel', 'stylesheet')
    newCSS.setAttribute('type', 'text/css')
    newCSS.setAttribute('href', DCCVisual.themeStyleResolver(cssF))
    targetDocument.body.appendChild(newCSS)

    return newCSS
  }

  downloadFile (data, fileName, type = 'text/plain') {
    const a = document.createElement('a')
    a.style.display = 'none'
    document.body.appendChild(a)
    a.href = window.URL.createObjectURL(
      new Blob([data], { type })
    )
    a.setAttribute('download', fileName)

    a.click()

    window.URL.revokeObjectURL(a.href)
    document.body.removeChild(a)
  }

  generateUID () {
    function s4 () {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }
    const currentDateTime = new Date()
    return currentDateTime.toJSON() + '-' +
             s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
  }
}

(function () {
  Basic.standardThemeFamily = 'plain'

  // <TODO> provisory based on SVG from XD
  Basic.referenceViewport = { width: 1920, height: 1080 }

  // <TODO> unify with State
  Basic.storeId = 'harena-state'
  Basic.authorStateId = 'harena-state-author'

  Basic.service = new Basic()
})()

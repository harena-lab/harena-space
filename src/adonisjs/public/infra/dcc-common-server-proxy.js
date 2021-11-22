/**
 * All service requests shared by Harena environments
 */

class DCCCommonServer {
  constructor () {
    this.casesList = this.casesList.bind(this)
    MessageBus.i.subscribe('data/case/*/list', this.casesList)
    this.loadCase = this.loadCase.bind(this)
    MessageBus.i.subscribe('case/get/+', this.loadCase)
    this.loadTheme = this.loadTheme.bind(this)
    this.themeFamilySettings = this.themeFamilySettings.bind(this)
    MessageBus.i.subscribe('data/theme_family/+/settings',
      this.themeFamilySettings)
    MessageBus.i.subscribe('data/theme/+/get', this.loadTheme)
    this.contextList = this.contextList.bind(this)
    MessageBus.i.subscribe('data/context/*/list', this.contextList)
    this.loadContext = this.loadContext.bind(this)
    MessageBus.i.subscribe('data/context/+/get', this.loadContext)
  }

  async casesList (topic, message, track) {
    const clearance = new URL(document.location).searchParams.get('clearance')
    const config = {
      method: 'GET',
      url: DCCCommonServer.managerAddressAPI + 'user/cases?clearance=' + clearance,
      withCredentials: true
    }
    let jsonResponse
    await axios(config)
      .then(function (endpointResponse) {
        jsonResponse = endpointResponse.data.cases
      })
      .catch(function (error) {
        console.log(error)
        console.log(error.code)
      })
    const busResponse = []
    for (const c in jsonResponse.cases) {
      busResponse.push({
        id: jsonResponse.cases[c].id,
        title: jsonResponse.cases[c].title
      })
      busResponse.push({pages: jsonResponse.pages})
    }
    busResponse.sort(function (c1, c2) {
      return (c1.title < c2.title) ? -1 : 1
    })
    MessageBus.i.publish(MessageBus.buildResponseTopic(topic, message),
      busResponse, track)
  }

  async loadCase (topic, message, track) {
    let caseComplete

    if (HarenaConfig.local) {
      this._caseScript = document.createElement('script')
      this._caseScript.src = Basic.service.rootPath + 'cases/current-case.js'
      document.head.appendChild(this._caseScript)
      // <TODO> adjust topic
      const caseM = await MessageBus.i.waitMessage('control/case/load/ready')
      caseComplete = caseM.message
    } else {
      // <TODO> the topic service/request/get is extremely fragile -- refactor
      const caseId = MessageBus.extractLevel(topic, 3)
      const caseObj = await MessageBus.i.request(
        'service/request/get', {caseId: caseId}, null, track)

      caseComplete = caseObj.message
      const template =
        caseComplete.source.
          match(/^___ Template ___[\n]*\*[ \t]+template[ \t]*:[ \t]*(.+)$/im)
      if (template != null && template[1] != null) {
        const templateMd =
          await MessageBus.i.request(
            'data/template/' + template[1].replace(/\//g, '.') +
              '/get', {static: true}, null, track)
        caseComplete.source += templateMd.message
      }
    }

    MessageBus.i.publish(MessageBus.buildResponseTopic(topic, message),
                         caseComplete, track)
  }

  async themeFamilySettings (topic, message, track) {
    let settings = {}
    if (!HarenaConfig.local) {
      const themeFamily = MessageBus.extractLevel(topic, 3)
      const header = {
        async: true,
        crossDomain: true,
        method: 'GET',
        headers: {
          'Content-Type': 'text/json'
        }
      }
      const response = await fetch(Basic.service.rootPath + 'themes/' +
                                      themeFamily + '/theme.json', header)
      settings = await response.json()
    }
    MessageBus.i.publish(MessageBus.buildResponseTopic(topic, message),
      settings, track)
  }

  async loadTheme (topic, message, track) {
    let themeObj
    const themeCompleteName = MessageBus.extractLevel(topic, 3)
    const separator = themeCompleteName.indexOf('.')
    const themeFamily = themeCompleteName.substring(0, separator)
    const themeName = themeCompleteName.substring(separator + 1)
    let caseObj
    if (HarenaConfig.local) {
      this._themeScript = document.createElement('script')
      this._themeScript.src = Basic.service.rootPath + 'themes/' +
                                 themeFamily + '/local/' + themeName + '.js'
      document.head.appendChild(this._themeScript)
      // <TODO> adjust topic
      const themeM = await MessageBus.i.waitMessage('control/theme/' +
                                                         themeName +
                                                         '/load/ready')
      themeObj = themeM.message
    } else {
      const header = {
        async: true,
        crossDomain: true,
        method: 'GET',
        headers: {
          'Content-Type': 'text/html'
        }
      }
      const response = await fetch(Basic.service.rootPath + 'themes/' +
                                      themeFamily + '/' + themeName +
                                      '.html', header)
      themeObj = await response.text()
    }
    MessageBus.i.publish(MessageBus.buildResponseTopic(topic, message),
      themeObj, track)
  }

  async contextList (topic, message, track) {
    let ctxCatalog = {}
    if (!HarenaConfig.local) {
      const header = {
        async: true,
        crossDomain: true,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch(Basic.service.rootPath + 'context/context.json',
        header)
      ctxCatalog = await response.json()
    }
    MessageBus.i.publish(MessageBus.buildResponseTopic(topic, message),
      ctxCatalog, track)
  }

  async loadContext (topic, message, track) {
    const header = {
      async: true,
      crossDomain: true,
      method: 'GET',
      headers: {
        'Content-Type': 'text/json'
      }
    }
    const response = await fetch(Basic.service.rootPath + 'context/' +
                                   message.body, header)
    const textResponse = await response.text()
    MessageBus.i.publish(MessageBus.buildResponseTopic(topic, message),
      textResponse, track)
  }
}

(function () {
  DCCCommonServer.instance = new DCCCommonServer()
})()

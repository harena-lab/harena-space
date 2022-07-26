/**
 * Server Proxy Component
 *
 * Component following the Digital Content Component (DCC) model responsible for acting
 * as a proxy between the authoring environment and the server.
 */
// const axios = require('axios');
class DCCAuthorServer {
  constructor () {
    this.loadModule = this.loadModule.bind(this)
    MessageBus.i.subscribe('data/module/+/get', this.loadModule)
    this.loadTemplate = this.loadTemplate.bind(this)
    MessageBus.i.subscribe('data/template/+/get', this.loadTemplate)
    this.loadTemplateComments = this.loadTemplateComments.bind(this)
    MessageBus.i.subscribe('data/template_comments/+/get', this.loadTemplateComments)
    this.saveCase = this.saveCase.bind(this)
    MessageBus.i.subscribe('data/case/+/set', this.saveCase)
    this.newCase = this.newCase.bind(this)
    MessageBus.i.subscribe('data/case//new', this.newCase)
    this.deleteCase = this.deleteCase.bind(this)
    MessageBus.i.subscribe('data/case/+/delete', this.deleteCase)

    this.themeFamiliesList = this.themeFamiliesList.bind(this)
    MessageBus.i.subscribe('data/theme_family/*/list', this.themeFamiliesList)

    this.templatesList = this.templatesList.bind(this)
    MessageBus.i.subscribe('data/template/*/list', this.templatesList)
    this.uploadArtifact = this.uploadArtifact.bind(this)
    MessageBus.i.subscribe('data/asset//new', this.uploadArtifact)

    /*
      this.prepareCaseHTML = this.prepareCaseHTML.bind(this);
      MessageBus.i.subscribe("case/+/prepare", this.prepareCaseHTML);
      this.saveKnotHTML = this.saveKnotHTML.bind(this);
      MessageBus.i.subscribe("knot/+/set", this.saveKnotHTML);
      this.saveCaseObject = this.saveCaseObject.bind(this);
      MessageBus.i.subscribe("case/+/set", this.saveCaseObject);
      */
  }

  // wrapper of the services

  async themeFamiliesList (topic, message, track) {
    const header = {
      async: true,
      crossDomain: true,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const response = await fetch('../themes/themes.json', header)
    const jsonResponse = await response.json()
    /*
      let busResponse = {};
      for (var t in jsonResponse)
         busResponse[jsonResponse[t].path] = {
            name: t,
            icon: "../themes/" + jsonResponse[t].path + "/images/" + jsonResponse[t].icon
         };
      */
    const busResponse = []
    for (const t in jsonResponse) {
      busResponse.push({
        id: jsonResponse[t].path,
        name: t,
        icon: '../themes/' + jsonResponse[t].path + '/images/' + jsonResponse[t].icon
      })
    }
    MessageBus.i.publish(MessageBus.buildResponseTopic(topic, message),
      busResponse, track)
  }

  async templatesList (topic, message, track) {
    const header = {
      async: true,
      crossDomain: true,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const response = await fetch(Basic.service.rootPath + 'templates/templates.json', header)
    const jsonResponse = await response.json()
    const busResponse = []
    for (const t in jsonResponse) {
      if (jsonResponse[t].scope == message.scope) {
        busResponse.push({
          id: jsonResponse[t].path,
          name: t,
          icon: 'template_fix/' + jsonResponse[t].icon,
          description: jsonResponse[t].description,
          questId: jsonResponse[t].questId,
          environment: jsonResponse[t].environment
        })
      }
    }
    MessageBus.i.publish(MessageBus.buildResponseTopic(topic, message),
      busResponse, track)
  }

  async newCase (topic, message, track) {
    const header = {
      async: true,
      crossDomain: true,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + DCCCommonServer.token
      },
      body: JSON.stringify({
        title: message.title,
        source: message.source
      })
    }
    console.log('=== request:')
    console.log(DCCCommonServer.managerAddressAPI + 'case')
    console.log(header)
    const response =
         await fetch(DCCCommonServer.managerAddressAPI + 'case', header)
    console.log('=== response:')
    console.log(response)
    const jsonResponse = await response.json()
    MessageBus.i.publish(MessageBus.buildResponseTopic(topic, message),
      jsonResponse.id, track)
  }

  async saveCase (topic, message, track) {
    if (message.format == 'markdown') {
      const caseId = MessageBus.extractLevel(topic, 3)

      /*
          * <TODO> Provisory
          * Read the case before writing to preserve the fields not maintained
          * by the authoring environment.
          ********************************************************************/
      /*
        const headerRead = {
          async: true,
          crossDomain: true,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + DCCCommonServer.token
          }
        }

        const responseRead =
              await fetch(DCCCommonServer.managerAddressAPI + 'case/' + caseId,
                headerRead)

        const jsonRead = await responseRead.json()

        write the case

        const header = {
          async: true,
          crossDomain: true,
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + DCCCommonServer.token
          },
          body: JSON.stringify({
            title: document.getElementById('case_title').value,
            description: document.getElementById('description').value,
            language: document.getElementById('language').value,
            domain: document.getElementById('domain').value,
            specialty: document.getElementById('specialty').value,
            keywords: document.getElementById('keywords').value,
            source: message.source
          })
        }
      */
      const config = {
        method: 'PUT',
        url: DCCCommonServer.managerAddressAPI + 'case',
        data: {
          caseId: caseId,
          title: document.getElementById('case_title').value,
          description: document.getElementById('description').value,
          language: document.getElementById('language').value,
          domain: document.getElementById('domain').value,
          specialty: document.getElementById('specialty').value,
          keywords: document.getElementById('keywords').value,
          originalDate: document.getElementById('creationDate').value,
          // institution: document.getElementById('institution').value,
          complexity: document.getElementById('complexity').value,
          source: message.source
        },
        withCredentials: true
      }
      console.log('=== save request')
      console.log(DCCCommonServer.managerAddressAPI + 'case/' + caseId)
      await axios(config)
        .then(function (response) {
          if(!response.data.error){
            MessageBus.i.publish(MessageBus.buildResponseTopic(topic, message),
              response.data.source, track)
          }else {
            MessageBus.i.publish(MessageBus.buildResponseTopic(topic, message),
              response.data.error, track)
          }

        })
        .catch(function (error) {
          console.log('=== save error')
          console.log(error.response)
          MessageBus.i.publish(MessageBus.buildResponseTopic(topic, message),
            error.response.statusText)
        })
      /* const response =
            await fetch(DCCCommonServer.managerAddressAPI + 'case/' + caseId, header)
        console.log(response)
        const jsonResponse = await response.json()
      */
    } else {
      console.log('save failed else')
    }
  }

  async deleteCase (topic, message, track) {
    const caseId = MessageBus.extractLevel(topic, 3)
    /*
    const header = {
      async: true,
      crossDomain: true,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + DCCCommonServer.token
      }
    }

    const response =
         await fetch(DCCCommonServer.managerAddressAPI + 'case/' + caseId, header)
    console.log('=== delete case')
    console.log(response)
    const jsonResponse = await response.json()
    MessageBus.i.publish(MessageBus.buildResponseTopic(topic, message),
      jsonResponse, true)
    */
    const config = {
      method: 'DELETE',
      url: DCCCommonServer.managerAddressAPI + 'case',
      data: {
        caseId: caseId
      },
      withCredentials: true
    }
    await axios(config)
      .then(function (response) {
        // return response.redirect('/')
        console.log('=== delete case')
        console.log(response)
        MessageBus.i.publish(MessageBus.buildResponseTopic(topic, message),
          response, track)
      })
      .catch(function (error) {
        console.log('=== delete case error')
        console.log(error)
      })
  }

  async loadModule (topic, message, track) {
    const moduleName = MessageBus.extractLevel(topic, 3)
    const header = {
      async: true,
      crossDomain: true,
      method: 'GET',
      headers: {
        'Content-Type': 'text/html'
      }
    }
    const response = await fetch('../modules/' + moduleName + '.html', header)
    const textResponse = await response.text()
    MessageBus.i.publish(MessageBus.buildResponseTopic(topic, message),
      textResponse, track)
  }

  async loadTemplate (topic, message, track) {
    const templatePath =
         MessageBus.extractLevel(topic, 3).replace(/\./g, '/')
    /*
    const header = {
      async: true,
      crossDomain: true,
      method: 'GET',
      headers: {
        'Content-Type': 'text/plain'
      }
    }
    */

    const sd = templatePath.includes('/knot/') ? '' :
      ((message != null && message.static) ? '-static' : '-dynamic')

    const serviceRequest = {
      method: 'GET',
      url: '/templates/' + templatePath + sd + '.md'
    }
    let serviceResponse = null
    await axios(serviceRequest)
      .then(function (endpointResponse) {
        serviceResponse = endpointResponse.data
    })
      .catch(function (error) {
        console.log('=== load ' + sd + ' template error')
        console.log(error)
        console.log(error.code)
    })

    // const response = await fetch(Basic.service.rootPath + 'templates/' + templatePath +
    //                                '.md', header)
    // const textResponse = await response.text()
    if (serviceResponse != null)
      MessageBus.i.publish(MessageBus.buildResponseTopic(topic, message),
        serviceResponse, track)
  }

  async loadTemplateComments (topic, message, track) {
    const templatePath =
         MessageBus.extractLevel(topic, 3).replace(/\./g, '/')

    const bar = templatePath.lastIndexOf('/')
    const path = templatePath.substring(0, bar) + '/comments' +
                 templatePath.substring(bar)

    const serviceRequest = {
      method: 'GET',
      url: '/templates/' + path + '.json'
    }
    let serviceResponse = null
    await axios(serviceRequest)
      .then(function (endpointResponse) {
        serviceResponse = endpointResponse.data
    })
      .catch(function (error) {
        console.log('=== load comments template error')
        console.log(error)
        console.log(error.code)
    })

    if (serviceResponse != null) {
      MessageBus.i.publish(MessageBus.buildResponseTopic(topic, message),
        serviceResponse, track)
    }
  }

  b64toBlob (imageURL) {
    const block = imageURL.split(';')
    const contentType = block[0].split(':')[1]
    const b64Data = block[1].split(',')[1]

    const sliceSize = 1024

    const byteCharacters = atob(b64Data)
    const byteArrays = []

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize)

      const byteNumbers = new Array(slice.length)
      for (var i = 0; i < slice.length; i++) { byteNumbers[i] = slice.charCodeAt(i) }

      const byteArray = new Uint8Array(byteNumbers)

      byteArrays.push(byteArray)
    }

    var blob = new Blob(byteArrays, { type: contentType })
    return blob
  }

  async uploadArtifact (topic, message, track) {
    const data = new FormData()
    if (message.file) {
      data.append('file', message.file)
    } else if (message.b64) {
      data.append('image', this.b64toBlob(message.b64))
    }
    data.append('caseId', message.caseid)
    const config = {
      method: 'POST',
      url: DCCCommonServer.managerAddressAPI + 'artifact',
      data: data,
      withCredentials: true,
      onUploadProgress: function(progressEvent) {
        let percentCompleted =
          Math.round((progressEvent.loaded * 100) / progressEvent.total) + '%'
        if (message.progress)
          MessageBus.i.publish(message.progress, percentCompleted, true)
        console.log('upload: ' + percentCompleted)
      }
    }
    await axios(config)
      .then(function (response) {
        console.log('=== response media upload')
        console.log(response)
        MessageBus.i.publish(MessageBus.buildResponseTopic(topic, message),
          response.data, track)
      })
      .catch(function (error) {
        console.log('=== media upload error')
        console.log(error)
      })
  }

  /*
   async prepareCaseHTML(topic, themeFamily) {
      const caseName = MessageBus.extractLevel(topic, 2);
      const response = await fetch(DCCCommonServer.managerAddressAPI + "prepare-case-html", {
         method: "POST",
         body: JSON.stringify({"themeFamily": themeFamily,
                               "caseName": caseName}),
         headers:{
           "Content-Type": "application/json"
         }
      });
      const jsonResponse = await response.json();
      MessageBus.i.publish("case/" + caseName + "/prepare/directory", jsonResponse.directory, true);
   }

   async saveKnotHTML(topic, message) {
      const knotId = MessageBus.extractLevel(topic, 2);

      const response = await fetch(DCCCommonServer.managerAddressAPI + "save-knot-html", {
         method: "POST",
         body: JSON.stringify({"caseName": message.caseId,
                               "knotFile": knotId + ".js",
                               "knotHTML": message.source}),
         headers:{
           "Content-Type": "application/json"
         }
      });
      const jsonResponse = await response.json();
      MessageBus.i.publish("knot/" + knotId + "/set/status", jsonResponse.status, true);
   }

   async saveCaseObject(topic, message) {
      if (message.format == "json") {
         const caseId = MessageBus.extractLevel(topic, 2);

         // <TODO> change the name of the service
         const response = await fetch(DCCCommonServer.managerAddressAPI + "save-case-script", {
            method: "POST",
            body: JSON.stringify({"caseName": caseId,
                                  "scriptFile": "case.js",
                                  "scriptJS": message.source}),
            headers:{
              "Content-Type": "application/json"
            }
         });
         const jsonResponse = await response.json();
         MessageBus.i.publish("case/" + caseId + "/set/status", jsonResponse.status, true);
      }
   }
   */
}

(function () {
  DCCAuthorServer.instance = new DCCAuthorServer()
})()

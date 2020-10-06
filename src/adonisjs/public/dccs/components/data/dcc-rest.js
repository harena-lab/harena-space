/**
 * Proxy for a REST request
 */

class DCCRest extends DCCBase {
  constructor () {
    super()
  }

  async connectedCallback () {
    super.connectedCallback()

    // this.presentReport = this.presentReport.bind(this)

    /*
    const schema = await this.request('data/schema')

    console.log('=== schema')
    console.log(schema)
    */
  }

  async connect (id, topic) {
    super.connect(id, topic)
    this._schema = await this.request('data/schema')
  }

  async restRequest(method, parameters) {
    if (this._content != null && this._content.oas != null &&
        this._content.oas.paths != null) {
      const paths = Object.keys(this._content.oas.paths)
      if (paths.length > 0) {
        let url = paths[0]
        for (let p in parameters)
          url = url.replace('{' + p + '}', parameters[p])

        const request = {
          method: method.toUpperCase(),
          url: url,
          async: true,
          crossDomain: true,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }

        if (this._content.credentials && this._content.credentials == 'use' &&
            DCCRest.token)
          request.headers['Authorization'] = 'Bearer ' + DCCRest.token

        let pathDetails = this._content.oas.paths[paths[0]]
        let opid = ''
        if (pathDetails[method] != null) {
          if (pathDetails[method].operationId) opid = pathDetails[method].operationId
          if (pathDetails[method].parameters != null) {
            if (method == 'get') {
              let body = {}
              for (let p of pathDetails[method].parameters)
                if (p.in != null && p.in == 'query')
                  body[p.name] = parameters[p.name]
              request.data = JSON.stringify(body)
              /*
              request.data = new FormData()
              for (let p of pathDetails[method].parameters)
                if (p.in != null && p.in == 'query')
                  request.data.append(p.name, parameters[p.name])
              */
            } else {
              let body = {}
              for (let p of pathDetails[method].parameters)
                if (p.in != null && p.in == 'query')
                  body[p.name] = parameters[p.name]
              request.body = JSON.stringify(body)
            }
          }
        }

        console.log("=== request header")
        console.log(request)

        const jsonResp = await fetch(url, request)
          .then(response => response.json())
          .catch(error => console.log('error', error))

        if (this._content.credentials && this._content.credentials == 'store') {
          if (jsonResp.token) {
            DCCRest.token = jsonResp.token
            // removes to avoid sending to the bus
            delete jsonResp.token
          }
          if (jsonResp.refreshToken) {
            DCCRest.refreshToken = jsonResp.refreshToken
            // removes to avoid sending to the bus
            delete jsonResp.refreshToken
          }
        }

        MessageBus.ext.publish('data/service/' + opid, jsonResp)
      }
    }
  }

  async notify (topic, message) {
    if (message.role) {
      let parameters = {}
      let par = ((message.body)
          ? ((message.body.value) ? message.body.value : message)
          : ((message.value) ? message.value : message))
      if (topic.startsWith('var/'))
        parameters[MessageBus.extractLevel(topic, 2)] = par
      else
        parameters = par
      this.restRequest(message.role.toLowerCase(), parameters)
    }
  }

}

(function () {
  DCC.component('dcc-rest', DCCRest)
})()

/**
 * Proxy for a REST request
 */

class DCCRest extends DCCBase {

  constructor() {
    super()
    this.serviceRequest = this.serviceRequest.bind(this)
    this.serviceRequestC = this.serviceRequestC.bind(this)
    MessageBus.int.subscribe('service/request/+', this.request)
  }

  // <FUTURE> Considering a complex schema
  async connectedCallback () {
    super.connectedCallback()

    if (this.hasAttribute('id')) {
      MessageBus.page.provides(this.id, 'service/request/get', this.serviceRequestC)
      MessageBus.page.provides(this.id, 'service/request/post', this.serviceRequestC)
      MessageBus.page.provides(this.id, 'service/request/put', this.serviceRequestC)
      MessageBus.page.provides(this.id, 'service/request/delete', this.serviceRequestC)
    }
    /*
    const schema = await this.request('data/schema')

    console.log('=== schema')
    console.log(schema)
    */
  }

  async connectTo (id, topic, role) {
    super.connectTo(id, topic, role)
    if (role == 'schema')
      this._schema = await this.request(role, null, id)
  }

  async restRequest(method, parameters) {
    console.log('=== rest request parameters')
    console.log(parameters)

    let result = null

    if (this._setup.environment)
      for (let e in this._setup.environment)
        parameters[e] = this._setup.environment[e]

    if (this._setup != null && this._setup.oas != null &&
        this._setup.oas.paths != null) {
      const paths = Object.keys(this._setup.oas.paths)
      if (paths.length > 0) {
        let url = paths[0]
        for (let p in parameters)
          url = url.replace('{' + p + '}', parameters[p])

        const request = {
          method: method.toUpperCase(),
          url: url,
          withCredentials: true
          /*
          async: true,
          crossDomain: true,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
          */
        }

        /*
        if (this._setup.credentials && this._setup.credentials == 'use' &&
            DCCRest.token)
          request.headers['Authorization'] = 'Bearer ' + DCCRest.token
        */

        let pathDetails = this._setup.oas.paths[paths[0]]
        let opid = ''
        if (pathDetails[method] != null) {
          if (pathDetails[method].operationId) opid = pathDetails[method].operationId
          if (pathDetails[method].parameters != null) {
            let body = {}
            for (let p of pathDetails[method].parameters)
              if (p.in != null && p.in == 'query')
                body[p.name] = parameters[p.name]
            request.data = body
          }
        }

        console.log("=== request header")
        console.log(request)

        /*
        const jsonResp = await fetch(url, request)
          .then(response => response.json())
          .catch(error => console.log('error', error))
        */

        await axios(request)
          .then(function (endpointResponse) {
            console.log(endpointResponse.status)
            // MessageBus.ext.publish('data/service/' + opid, endpointResponse.data)
            result = endpointResponse.data
          })
          .catch(function (error) {
            console.log(error)
          })

        /*
        if (this._setup.credentials && this._setup.credentials == 'store') {
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
        */

        
      }
    }
    return result
  }

  async serviceRequest (topic, message) {
    let result = await this.serviceRequestC(topic, message)
    MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message), result)
    if (this.hasAttribute('id'))
      MessageBus.ext.publish('service/response/' + MessageBus.extractLevel(topic, 3) + '/' + this.id, result)
  }

  async serviceRequestC (topic, message) {
    return await this.restRequest(MessageBus.extractLevel(topic, 3),
      this._extractParameters(message))
  }

  async notify (topic, message) {
    if (message.role) {
      let parameters = {}
      let par = this._extractParameters(message)
      if (topic.startsWith('var/'))
        parameters[MessageBus.extractLevel(topic, 2)] = par
      else
        parameters = par
      // this.restRequest(message.role.toLowerCase(), parameters)
      this.serviceRequest('service/request/' + message.role.toLowerCase(), parameters)
    }
  }

  _extractParameters(message) {
    return (message == null)
             ? {}
             : ((message.body)
               ? ((message.body.value) ? message.body.value : message)
               : ((message.value) ? message.value : message))
  }

}

(function () {
  DCC.webComponent('dcc-rest', DCCRest)
})()

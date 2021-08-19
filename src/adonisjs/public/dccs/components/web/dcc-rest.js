/**
 * Proxy for a REST request
 */

class DCCRest extends DCCBase {

  constructor() {
    super()
    this.serviceRequest = this.serviceRequest.bind(this)
    this.serviceRequestC = this.serviceRequestC.bind(this)
    this._subscribe('service/request/+', this.request)
  }

  // <FUTURE> Considering a complex schema
  async connectedCallback () {
    super.connectedCallback()

    if (this.hasAttribute('id')) {
      this._provides(this.id, 'service/request/get', this.serviceRequestC)
      this._provides(this.id, 'service/request/post', this.serviceRequestC)
      this._provides(this.id, 'service/request/put', this.serviceRequestC)
      this._provides(this.id, 'service/request/delete', this.serviceRequestC)
    }
    /*
    const schema = await this.request('data/schema')

    console.log('=== schema')
    console.log(schema)
    */
  }

  async connectTo (trigger, id, topic) {
    super.connectTo(trigger, id, topic)
    if (trigger == 'schema')
      this._schema = await this.request(trigger, null, id)
  }

  async restRequest(method, parameters) {
    // console.log('============ rest method')
    // console.log(method)
    // console.log('=== service request')
    // console.log(method)
    // console.log(parameters)
    let result = null

    if (this._setup.environment)
      for (let e in this._setup.environment)
        parameters[e] = this._setup.environment[e]

    if (this._setup != null && this._setup.oas != null &&
        this._setup.oas.paths != null) {
      // console.log('--- inside request')
      const paths = Object.keys(this._setup.oas.paths)
      if (paths.length > 0) {
        let url = paths[0]
        for (let p in parameters)
          url = url.replace('{' + p + '}', parameters[p])

        const request = {
          method: method.toUpperCase(),
          url: url,
          withCredentials: true
        }

        let pathDetails = this._setup.oas.paths[paths[0]]
        let opid = ''
        if (pathDetails[method] != null) {
          if (pathDetails[method].operationId) opid = pathDetails[method].operationId
          if (pathDetails[method].parameters != null) {
            let body = {}
            for (let p of pathDetails[method].parameters)
              if (p.in != null && p.in == 'query')
                body[p.name] = parameters[p.name]
            if (request.method == 'GET')
              request.params = body
            else
              request.data = body
          }
        }

        await axios(request)
          .then(function (endpointResponse) {
            // console.log(endpointResponse.status)
            // this._publish('data/service/' + opid, endpointResponse.data, true)
            result = endpointResponse.data
            // console.log('============')
            // console.log(endpointResponse.data)
          })
          .catch(function (error) {
            console.log('===== error in request')
            console.log(error.message)
            console.log('=====')
            result = error.message
          })

      }
    }
    return result
  }

  async serviceRequest (topic, message) {
    let result = await this.serviceRequestC(topic, message)
    this._publish(MessageBus.buildResponseTopic(topic, message), result, true)
    if (this.hasAttribute('id'))
      this._publish('service/response/' + MessageBus.extractLevel(topic, 3) + '/' + this.id,
        result, true)
  }

  async serviceRequestC (topic, message) {
    return await this.restRequest(MessageBus.extractLevel(topic, 3),
      this._extractParameters(message))
  }

  async notify (topic, message) {
    let parameters = {}
    let par = this._extractParameters(message)
    if (topic.startsWith('par/'))
      parameters[MessageBus.extractLevel(topic, 2)] = par
    else
      parameters = par
    this.serviceRequest(topic, parameters)
  }

  _extractParameters(message) {
    return (message == null)
             ? {}
             : ((message.body)
               ? ((message.body.value) ? message.body.value : message.body)
               : ((message.value) ? message.value : message))
  }

}

(function () {
  DCC.webComponent('dcc-rest', DCCRest)
})()

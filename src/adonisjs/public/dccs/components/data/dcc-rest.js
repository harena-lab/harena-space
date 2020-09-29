/**
 * Embeds a data model
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
    const schema = await this.request('data/schema')
  }

  async restRequest(method, parameters) {
    console.log('=== rest request')
    console.log(method)
    console.log(parameters)
    if (this._content != null && this._content.paths != null) {
      const paths = Object.keys(this._content.paths)
      if (paths.length > 0) {
        let url = paths[0]
        for (let p in parameters)
          url = url.replace('{' + p + '}', parameters[p])
        const request = {
          method: method.toUpperCase(),
          url: url,
          crossDomain: true,
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        }
        console.log("=== request header")
        console.log(request)
        axios(request)
          .then(function (response) {
            console.log('=== REST response')
            console.log(response)
            // MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
            //   response.data.source)
          })
          .catch(function (error) {
            console.log('=== REST error')
            console.log(error)
          })
        /*
        const header = {
          async: true,
          crossDomain: true,
          method: method.toUpperCase(),
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          }
        }
        const response = await fetch(url, header)
        const jsonResponse = await response.json()
        */
      }
    }
  }

  async notify (topic, message) {
    console.log('=== notify')
    console.log(topic)
    console.log(message.role)
    if (message.role) {
      switch (message.role.toLowerCase()) {
        case 'get':
          if (topic.startsWith('var/')) {
            let parameters = {}
            parameters[MessageBus.extractLevel(topic, 2)] =
              ((message.body)
                ? ((message.body.value) ? message.body.value : message)
                : ((message.value) ? message.value : message))
            this.restRequest('get', parameters)
          }
          break
      }
    }
  }

}

(function () {
  DCC.component('dcc-rest', DCCRest)
})()

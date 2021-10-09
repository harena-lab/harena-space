/**
 * Embeds a data model
 */

class DCCModel extends DCCBase {
  connectedCallback () {
    super.connectedCallback()

    this.requestSchema = this.requestSchema.bind(this)
    this._subscribe('data/schema/' + this.id, this.requestSchema)

    console.log('=== model schema')
    console.log(this.schema)
  }

  /* Properties
     **********/

  get schema () {
    return (this._setup != null) ? this._setup.schema : null;
  }

  requestSchema (topic, message) {
    this._publish(MessageBus.buildResponseTopic(topic, message), this.schema)
  }
}

(function () {
  DCC.webComponent('dcc-model', DCCModel)
})()

/* Logger DCC
  ***********/
class DCCLogger extends DCCLight {
  constructor() {
    super()

    this._notifyLogger = this._notifyLogger.bind(this)
    this._subscribe('#', this._notifyLogger)

    this.buffer_message = []

  }

  //Função que realiza o envio das mensagens. 
  //  Data é um vetor de jsons. 
  //  url é uma string com a url da requisição
  async _send_message(data ,url) {
    
    var message = {
      "messages": data
    }

    const config = {
      method: 'POST',
      url: url,
      withCredentials: false,
      data: message
    };
    await axios(config);
  }

  _notifyLogger (topic, message, track) {
    if (track) {
      try{
        for(var i=0;i<CONFIG_LOGGER.config_json.length;i++){
          var type_message =  CONFIG_LOGGER.config_json[i]
          if(MessageBus.matchFilter(topic, type_message.topic_format)){
            var schema_message = Object.assign({}, type_message.schema)
            schema_message.topic = topic
            schema_message.payload_body = JSON.stringify(message)
            if(type_message.accumulator=="accumulate"){
              this.buffer_message.push(schema_message);
              if (this.buffer_message.length == CONFIG_LOGGER.size_buffer){
                this._send_message([...this.buffer_message], type_message.endpoint)
                this.buffer_message = [];
              }
            }
            else
            {
              if(type_message.accumulator=="send"){
                this.buffer_message.push(schema_message);
                this._send_message([...this.buffer_message], type_message.endpoint)
                this.buffer_message = [];
              }
              else{
                  this._send_message([schema_message], type_message.endpoint)
              }
            }
          }
        }
      }catch (e) {
          console.log('ERROR!');
          console.log(e);
      }
    }
  }
}

(function () {
  DCCLogger.i = new DCCLogger()
})()

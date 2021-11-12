/* Logger DCC
  ***********/
class DCCLogger extends DCCLight {
  constructor() {
    super()

    this._notifyLogger = this._notifyLogger.bind(this)
    this._subscribe('#', this._notifyLogger)

  }

  async _send_message(data ,url) {
    
    console.log('request:');
    console.log(data);

    const config = {
      method: 'POST',
      url: url,
      withCredentials: false,
      data: data
    };
    await axios(config);
  }

  _notifyLogger (topic, message, track) {
    if (track) {
      try{
        //console.log('=== logger DCC: ' + topic);
        //console.log(message);
        for(var i=0;i<CONFIG_LOGGER.config_json.length;i++){
          var type_message =  CONFIG_LOGGER.config_json[i]
          if(type_message.topic_regex.test(topic)){
            
            var  schema_message = Object.assign({}, type_message.schema)
            schema_message.payload_body = JSON.stringify(message)
            schema_message.topic = topic
            //this._send_message(schema_message, type_message.endpoint)
            console.log(schema_message)
            break;
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

/* Logger DCC
  ***********/
class DCCLogger extends DCCLight {
  constructor() {
    super()

    this._notifyLogger = this._notifyLogger.bind(this)
    this._subscribe('#', this._notifyLogger)

    this.old_topic = ''
    this.buffer_message = []

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
            
            if((this.old_topic==topic && type_message.accumulator==true && this.buffer_message.length<=CONFIG_LOGGER.size_buffer)){
              this.buffer_message.push(message)
            }else{
              

              if(this.buffer_message.length>1){
                var  schema_message = Object.assign({}, type_message.schema)
                schema_message.topic = this.old_topic
                schema_message.payload_body = JSON.stringify(this.buffer_message);
                //this._send_message(schema_message, type_message.endpoint)
                console.log(schema_message);

                this.buffer_message = []

              }
              
              if(this.buffer_message.length==1){
                var  schema_message = Object.assign({}, type_message.schema)
                schema_message.topic = this.old_topic
                schema_message.payload_body = JSON.stringify(this.buffer_message[0])
                //this._send_message(schema_message, type_message.endpoint)
                console.log(schema_message);
                this.buffer_message = []


              }
              
              
              if(this.buffer_message.length==0){
                var  schema_message = Object.assign({}, type_message.schema)
                schema_message.topic = topic
                schema_message.payload_body = JSON.stringify(message)
                //this._send_message(schema_message, type_message.endpoint)
                console.log(schema_message);

              }


            }
            this.old_topic=topic
            break;
          }
        }
        }catch (e) {
          console.log('ERROR!');
          console.log(e);
      // console.log('=== logger DCC: ' + topic)
      // console.log(message)

      if (MessageBus.matchFilter(topic, 'user/login/+')) {
        console.log('=== user logged')
        console.log(MessageBus.extractLevel(topic, 3))
      }

      if (MessageBus.matchFilter(topic, 'case/start/+')) {
        console.log('=== case started')
        console.log('user id: ' + message.userId)
        console.log('case id: ' + message.caseId)
        console.log('instance id: ' + MessageBus.extractLevel(topic, 3))
      }
    }
  }
}

(function () {
  DCCLogger.i = new DCCLogger()
})()

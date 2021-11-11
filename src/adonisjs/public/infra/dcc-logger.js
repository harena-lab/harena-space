/* Logger DCC
  ***********/

class DCCLogger extends DCCLight {
  constructor() {
    super()

    this._notifyLogger = this._notifyLogger.bind(this)
    this._subscribe('#', this._notifyLogger)

    this.messages = []
    this.numberOfMessages = 0
    this.end_topics = ['knot/end', 'case/summary', 'flow/>/navigate'] // "knot/end" nao existe dessa forma no log, era mais pra representar a ideia do que pode ser um topico que finaliza o empacotamento
  }

  async _send_message() {
    
    let request = {
      "messages": [...this.messages],
      "version": 0.1
    };
    this.numberOfMessages = 0
    this.messages = []
    
    console.log('request:');
    console.log(request);

    const config = {
      method: 'POST',
      url: 'http://localhost/api/v1/kafka_messages/',
      withCredentials: false,
      data: request
    };
    await axios(config);
  }

  empacota_mensagem (topic, message){

    let pacote = {
      "topic": topic,
      "payload": message
    };

    this.messages.push(pacote)
    this.numberOfMessages += 1;
  }

  _notifyLogger (topic, message, track) {
    if (track) {
      try{
        console.log('=== logger DCC: ' + topic);
        console.log(message);
        this.empacota_mensagem(topic, message);
        if(this.numberOfMessages > 15 || this.end_topics.includes(topic)){
          this._send_message();
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

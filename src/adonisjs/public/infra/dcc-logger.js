/* Logger DCC
  ***********/

class DCCLogger extends DCCLight {
  constructor() {
    super()

    this._notifyLogger = this._notifyLogger.bind(this)
    this._subscribe('case/summary', this._notifyLogger)
  }

  async _send_message(message) {
    
    let request = {
      "case": 100,
      "payload": JSON.stringify(message),
      "origin_ip": "teste_ddc",
      "event": "chamada ddc"
    }
    
    console.log('request:')
    console.log(request)

    const config = {
      method: 'POST',
      url: 'http://localhost/api/v1/kafka_messages/',
      withCredentials: false,
      data: request
    }

    await axios(config)

    // let response = await fetch('https://localhost/api/v1/kafka_messages/', 
    //                     {
    //                       async: true,
    //                       crossDomain: true,
    //                       method: 'post',
    //                       headers: {'Content-Type': 'application/json'},
    //                       body: JSON.stringify(request) // string or object
    //                     }
    //                     ).catch(err => {
    //                       // trata se alguma das promises falhar
    //                       console.error('Failed retrieving information', err);
    //                     });
    // let js = await response.json();
    // console.log(js); 

  }

  _notifyLogger (topic, message, track) {
    if (track) {
      
      try{
        console.log('=== logger DCC: ' + topic);
        console.log(message);
        // this._send_message(message);
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

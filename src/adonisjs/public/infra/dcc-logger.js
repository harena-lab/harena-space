/* Logger DCC
  ***********/

class DCCLogger extends DCCLight {
  constructor() {
    super()

    this._notifyLogger = this._notifyLogger.bind(this)
    this._subscribe('case/summary', this._notifyLogger)
  }

  _notifyLogger (topic, message, track) {
    if (track) {
      console.log('=== logger DCC: ' + topic)
      console.log(message)
    }
  }
}

(function () {
  DCCLogger.i = new DCCLogger()
})()

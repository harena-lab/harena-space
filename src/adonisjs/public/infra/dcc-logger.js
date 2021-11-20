/* Logger DCC
  ***********/

class DCCLogger extends DCCLight {
  constructor() {
    super()

    this._notifyLogger = this._notifyLogger.bind(this)
    this._subscribe('#', this._notifyLogger)
  }

  _notifyLogger (topic, message, track) {
    if (track) {
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

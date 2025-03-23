/* Logger DCC
  ***********/

class DCCLoggerManager extends DCCLight {
  constructor() {
    super()

    this._notifyLogger = this._notifyLogger.bind(this)
    this._subscribe('case/record/#', this._notifyLogger)
    this._subscribe('case/summary/#', this._notifyLogger)
    this._subscribe('case/track/#', this._notifyLogger)
  }

  async _notifyLogger (topic, message, track) {
    if (track) {
      if (message.userId != null)
        delete message.userId
      let caseId = null
      if (message.caseId != null) {
        caseId = message.caseId
        delete message.caseId
      }
      message.logType = MessageBus.extractLevel(topic, 2)
      let logger = await MessageBus.i.request('logger/create/post',
        {
          caseId: caseId,
          instanceId: MessageBus.extractLevel(topic, 3),
          log: JSON.stringify(message)
        }
      )
      if (logger.message.error) {
        console.log('--- error')
        console.log(logger.message.error)
      }
    }
  }
}

(function () {
  DCCLoggerManager.i = new DCCLoggerManager()
})()

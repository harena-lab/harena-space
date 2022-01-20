/* Logger DCC
  ***********/

class DCCLoggerManager extends DCCLight {
  constructor() {
    super()

    this._notifyLogger = this._notifyLogger.bind(this)
    this._subscribe('case/summary/#', this._notifyLogger)
  }

  async _notifyLogger (topic, message, track) {
    if (track) {
      let logger = await MessageBus.i.request('logger/create/post',
        {
          caseId: message.caseId,
          instanceId: MessageBus.extractLevel(topic, 3),
          log: JSON.stringify(message)
        }
      )
      if (logger.message.error) {
        console.log('--- error')
        console.log(logger.message.error)
      } else {
        console.log('=== success ===')
        console.log(logger.message)
      }
    }
  }
}

(function () {
  DCCLoggerManager.i = new DCCLoggerManager()
})()

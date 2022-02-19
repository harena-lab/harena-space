class EnvControlManager {
  start () {
    this._activateQuiz = this._activateQuiz.bind(this)
    MessageBus.i.subscribe('tbl/quiz/activate', this._activateQuiz)
    this._deactivateQuiz = this._deactivateQuiz.bind(this)
    MessageBus.i.subscribe('tbl/quiz/deactivate', this._deactivateQuiz)
    this._activateCases = this._activateCases.bind(this)
    MessageBus.i.subscribe('tbl/cases/activate', this._activateCases)
    this._deactivateCases = this._deactivateCases.bind(this)
    MessageBus.i.subscribe('tbl/cases/deactivate', this._deactivateCases)
  }

  async _activateQuiz (topic, message) {
    this._activate(new URL(document.location).searchParams.get('quiz'),
                   '#quiz-status', 'Quiz Ativado')
  }

  async _deactivateQuiz (topic, message) {
    this._deactivate(new URL(document.location).searchParams.get('quiz'),
                     '#quiz-status', 'Quiz Desativado')
  }

  async _activateCases (topic, message) {
    this._activate(new URL(document.location).searchParams.get('cases'),
                   '#cases-status', 'Casos Ativados')
  }

  async _deactivateCases (topic, message) {
    this._deactivate(new URL(document.location).searchParams.get('cases'),
                     '#cases-status', 'Casos Desativados')
  }

  async _activate (caseId, statusId, message) {
    let user = await MessageBus.i.request('share/case/post',
      {
        entity: 'group',
        subject: new URL(document.location).searchParams.get('group'),
        clearance: '1',
        table_id: caseId
      }
    )
    if (user.message.error) {
      console.log('--- error')
      console.log(user.message.error)
    } else
      document.querySelector(statusId).innerHTML = message
  }

  async _deactivate (caseId, statusId, message) {
    let user = await MessageBus.i.request('withdraw/case/delete',
      {
        entity: 'group',
        subject: new URL(document.location).searchParams.get('group'),
        table_id: caseId
      }
    )
    if (user.message.error) {
      console.log('--- error')
      console.log(user.message.error)
    } else
      document.querySelector(statusId).innerHTML = message
  }
}

(function () {
  EnvControlManager.i = new EnvControlManager()
})()

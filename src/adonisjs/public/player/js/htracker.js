class Tracker {
  constructor () {
    this._variables = {}
    this._varUpdated = {}
    // this._varChanged = {} <FUTURE>
    this._mandatoryFilled = {}
    this._groupInput = null

    this._knotTrack = []
    this._caseCompleted = false

    this.inputReady = this.inputReady.bind(this)
    MessageBus.i.subscribe('input/ready/#', this.inputReady)
    this.inputMandatory = this.inputMandatory.bind(this)
    MessageBus.i.subscribe('input/mandatory/#', this.inputMandatory)
    this.inputTyped = this.inputTyped.bind(this)
    MessageBus.i.subscribe('input/typed/#', this.inputTyped)
    this.inputChanged = this.inputChanged.bind(this)
    MessageBus.i.subscribe('input/changed/#', this.inputChanged)
    this.stateChanged = this.stateChanged.bind(this)
    MessageBus.i.subscribe('input/state/#', this.stateChanged)
    this.inputSummary = this.inputSummary.bind(this)
    MessageBus.i.subscribe('input/summary', this.inputSummary)

    this.knotStart = this.knotStart.bind(this)
    MessageBus.i.subscribe('knot/start/#', this.knotStart)
    this.caseCompleted = this.caseCompleted.bind(this)
    MessageBus.i.subscribe('case/completed/+', this.caseCompleted)
    MessageBus.i.subscribe('session/close', this.caseCompleted)

    this.submitVariables = this.submitVariables.bind(this)
    MessageBus.i.subscribe('input/submit/*', this.submitVariables)
  }

  _extractEntityId (topic, position) {
    return MessageBus.extractLevelsSegment(topic, position).replace(/\//g, '.')
  }

  _exportEntityId (entity) {
    return entity.replace(/\./g, '/')
  }

  inputMandatory (topic, message, track) {
    if (MessageBus.extractLevel(topic, 3) == '*')
      MessageBus.i.publishHasResponse(
        topic, message, this._mandatoryFilled, track)
    else {
      const v = this._extractEntityId(topic, 3)
      if (v != null)
        this._mandatoryFilled[v] = { message: message, filled: false }
    }
  }

  inputReady (topic, message) {
    const type = MessageBus.extractLevel(topic, 3)
    const position = (type == '<' || type == '>') ? 4 : 3
    const v = this._extractEntityId(topic, position)
    if (v != null && this._variables[v] == null)
      switch (type) {
        case '<' : this._updateVariable(v, {})
                   this._groupInput = v
                   break
        case '>' : if (this._groupInput != null)
                     this._variables[this._groupInput][v] =
                       { content: message.content, state: ' ' }
              break
        default: this._updateVariable(v, '')
      }
  }

  inputTyped (topic, message) {
    this._updateVariable(this._extractEntityId(topic, 3), message.value)
    // this._changedVariable(topic, message.value) <FUTURE>
  }

  inputChanged (topic, message) {
    this._updateVariable(this._extractEntityId(topic, 3), message.value)
    // this._changedVariable(topic, message.value) <FUTURE>
  }

  stateChanged (topic, message) {
    if (this._groupInput != null)
      this._variables[this._groupInput][this._extractEntityId(topic, 3)].state =
        message.state
  }

  submitVariables (topic, message) {
    for (const v in this._variables) {
      if (this._varUpdated[v] == null || this._varUpdated[v]) {
        MessageBus.i.publish('var/set/' + this._exportEntityId(v),
                             this._variables[v], true)
        this._varUpdated[v] = false
      }
    }
  }

  /* <FUTURE>
  _changedVariable (topic, value) {
    const v = MessageBus.extractLevel(topic, 2)
    if (v != null) {
      if (this._varChanged[v] == null)
        this._varChanged[v] = []
      const currentDateTime = new Date()
      this._varChanged[v].push(
        {value: value, timestamp: currentDateTime.toJSON()})
      this._updateVariable(topic, value)
    }
  }
  */

  _updateVariable (variable, value) {
    if (variable != null) {
      this._variables[variable] = value
      this._varUpdated[variable] = true
      if (this._mandatoryFilled[variable] !== undefined) {
        this._mandatoryFilled[variable].filled = (value.length > 0) }
    }
  }

  knotStart (topic, message) {
    const currentDateTime = new Date()
    this._knotTrack.push(
      {knotid: this._extractEntityId(topic, 3),
       timeStart: currentDateTime.toJSON()})
  }

  inputSummary (topic, message) {
    MessageBus.i.publishHasResponse (
      topic, message, this._variables, false)
  }

  caseCompleted (topic, message) {
    if (!this._caseCompleted) {
      const currentDateTime = new Date()
      let kt = {
        event: topic,
        timeCompleted: currentDateTime.toJSON()
      }
      if (message && message.knotid)
        kt.knotid = message.knotid
      this._knotTrack.push(kt)
      MessageBus.i.publish('case/summary/' + MessageBus.extractLevel(topic, 3),
        {userId: message.userId,
         caseId: message.caseId,
         knotTrack: this._knotTrack,
         variables: this._variables}, true)
    }
  }
}

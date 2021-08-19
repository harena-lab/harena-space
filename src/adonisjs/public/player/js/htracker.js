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
    MessageBus.i.subscribe('var/+/input/ready', this.inputReady)
    this.inputMandatory = this.inputMandatory.bind(this)
    MessageBus.i.subscribe('var/+/input/mandatory', this.inputMandatory)
    this.groupinputReady = this.groupinputReady.bind(this)
    MessageBus.i.subscribe('var/+/group_input/ready', this.groupinputReady)
    this.subinputReady = this.subinputReady.bind(this)
    MessageBus.i.subscribe('var/+/subinput/ready', this.subinputReady)
    this.inputTyped = this.inputTyped.bind(this)
    MessageBus.i.subscribe('var/+/typed', this.inputTyped)
    this.inputChanged = this.inputChanged.bind(this)
    MessageBus.i.subscribe('var/+/changed', this.inputChanged)
    this.stateChanged = this.stateChanged.bind(this)
    MessageBus.i.subscribe('var/+/state_changed', this.stateChanged)
    this.allMandatoryFilled = this.allMandatoryFilled.bind(this)
    MessageBus.i.subscribe('var/*/input/mandatory/get', this.allMandatoryFilled)

    this.knotStart = this.knotStart.bind(this)
    MessageBus.i.subscribe('knot/+/start', this.knotStart)
    this.caseCompleted = this.caseCompleted.bind(this)
    MessageBus.i.subscribe('case/completed', this.caseCompleted)
    MessageBus.i.subscribe('session/close', this.caseCompleted)

    this.submitVariables = this.submitVariables.bind(this)
    MessageBus.i.subscribe('control/input/submit', this.submitVariables)
  }

  inputMandatory (topic, message) {
    const v = MessageBus.extractLevel(topic, 2)
    if (v != null) {
      this._mandatoryFilled[v] = { message: message, filled: false }
    }
  }

  inputReady (topic, message) {
    this._updateVariable(topic, '')
  }

  groupinputReady (topic, message) {
    this._updateVariable(topic, {})
    this._groupInput = MessageBus.extractLevel(topic, 2)
  }

  subinputReady (topic, message) {
    if (this._groupInput != null) {
      const id = MessageBus.extractLevel(topic, 2)
      this._variables[this._groupInput][id] =
            { content: message.content, state: ' ' }
    }
  }

  inputTyped (topic, message) {
    this._updateVariable(topic, message.value)
    // this._changedVariable(topic, message.value) <FUTURE>
  }

  inputChanged (topic, message) {
    this._updateVariable(topic, message.value)
    // this._changedVariable(topic, message.value) <FUTURE>
  }

  stateChanged (topic, message) {
    if (this._groupInput != null) {
      const id = MessageBus.extractLevel(topic, 2)
      this._variables[this._groupInput][id].state = message.state
    }
  }

  submitVariables (topic, message) {
    for (const v in this._variables) {
      if (this._varUpdated[v] == null || this._varUpdated[v]) {
        MessageBus.i.publish('var/' + v + '/set', this._variables[v], true)
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

  _updateVariable (topic, value) {
    const v = MessageBus.extractLevel(topic, 2)
    if (v != null) {
      this._variables[v] = value
      this._varUpdated[v] = true
      if (this._mandatoryFilled[v] !== undefined) {
        this._mandatoryFilled[v].filled = (value.length > 0) }
    }
  }

  allMandatoryFilled (topic, message) {
    MessageBus.i.publish(MessageBus.buildResponseTopic(topic, message),
      this._mandatoryFilled)
  }

  knotStart (topic, message) {
    const k = MessageBus.extractLevel(topic, 2)
    const currentDateTime = new Date()
    this._knotTrack.push(
      {knotid: k,
       timeStart: currentDateTime.toJSON()})
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
      MessageBus.i.publish('case/summary',
        {knotTrack: this._knotTrack,
         variables: this._variables}, true)
    }
  }
}

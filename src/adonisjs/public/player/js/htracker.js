class Tracker {
  constructor () {
    this._variables = {}
    this._mandatoryFilled = {}
    this._groupInput = null

    this.inputReady = this.inputReady.bind(this)
    MessageBus.int.subscribe('var/+/input/ready', this.inputReady)
    this.inputMandatory = this.inputMandatory.bind(this)
    MessageBus.int.subscribe('var/+/input/mandatory', this.inputMandatory)
    this.groupinputReady = this.groupinputReady.bind(this)
    MessageBus.int.subscribe('var/+/group_input/ready', this.groupinputReady)
    this.subinputReady = this.subinputReady.bind(this)
    MessageBus.int.subscribe('var/+/subinput/ready', this.subinputReady)
    this.inputTyped = this.inputTyped.bind(this)
    MessageBus.ext.subscribe('var/+/typed', this.inputTyped)
    this.inputChanged = this.inputChanged.bind(this)
    MessageBus.ext.subscribe('var/+/changed', this.inputChanged)
    this.stateChanged = this.stateChanged.bind(this)
    MessageBus.ext.subscribe('var/+/state_changed', this.stateChanged)
    this.allMandatoryFilled = this.allMandatoryFilled.bind(this)
    MessageBus.int.subscribe('var/*/input/mandatory/get', this.allMandatoryFilled)

    this.submitVariables = this.submitVariables.bind(this)
    MessageBus.ext.subscribe('control/input/submit', this.submitVariables)
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
  }

  inputChanged (topic, message) {
    console.log('=== update input variable')
    console.log(topic)
    console.log(message)
    this._updateVariable(topic, message.value)
  }

  stateChanged (topic, message) {
    if (this._groupInput != null) {
      const id = MessageBus.extractLevel(topic, 2)
      this._variables[this._groupInput][id].state = message.state
    }
  }

  submitVariables (topic, message) {
    for (const v in this._variables) { MessageBus.ext.publish('var/' + v + '/set', this._variables[v]) }
  }

  _updateVariable (topic, value) {
    const v = MessageBus.extractLevel(topic, 2)
    if (v != null) {
      this._variables[v] = value
      if (this._mandatoryFilled[v] !== undefined) {
        this._mandatoryFilled[v].filled = (value.length > 0) }
    }
  }

  allMandatoryFilled (topic, message) {
    MessageBus.int.publish(MessageBus.buildResponseTopic(topic, message),
      this._mandatoryFilled)
  }
}

class Tracker {
  constructor () {
    this.initializeTrack()

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
    this.sessionRound = this.sessionRound.bind(this)
    MessageBus.i.subscribe('case/completed/+', this.caseCompleted)
    MessageBus.i.subscribe('session/close', this.caseCompleted)
    MessageBus.i.subscribe('session/round/+', this.sessionRound)
    this.caseTryHalt = this.caseTryHalt.bind(this)
    MessageBus.i.subscribe('case/tryhalt', this.caseTryHalt)

    this.submitVariables = this.submitVariables.bind(this)
    MessageBus.i.subscribe('input/submit/*', this.submitVariables)
  }

  initializeTrack () {
    this._variables = {}
    this._varUpdated = {}
    this._varTrack = []
    // this._varChanged = {} <FUTURE>
    this._mandatoryFilled = {}
    this._groupInput = null

    this._knotTrack = []
    this._caseCompleted = false
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
      this._trackStore()
    }
  }

  inputReady (topic, message) {
    const type = MessageBus.extractLevel(topic, 3)
    const position = (type == '<' || type == '>') ? 4 : 3
    const v = this._extractEntityId(topic, position)
    if (v != null && this._variables[v] == null)
      switch (type) {
        case '<' : this._groupInput = v
                   this._updateVariable(v, {})
                   break
        case '>' : if (this._groupInput != null) {
                     this._variables[this._groupInput][v] =
                       { content: message.content, state: ' ' }
                     this._trackStore()
                   }
              break
        default: this._updateVariable(v, '')
      }
  }

  inputTyped (topic, message) {
    this._updateVariable(this._extractEntityId(topic, 3), message.value)
    // this._changedVariable(topic, message.value) <FUTURE>
  }

  inputChanged (topic, message) {
    const varid = this._extractEntityId(topic, 3)
    const currentDateTime = new Date()
    const tr = {changed: currentDateTime.toJSON()}
    tr[varid] = message.value
    this._varTrack.push(tr)
    this._updateVariable(this._extractEntityId(topic, 3), message.value)

    // <TODO> check for inconsistencies
    MessageBus.i.publish('var/set/' + MessageBus.extractLevel(topic, 3),
                         message.value, true)

    // this._changedVariable(topic, message.value) <FUTURE>
  }

  stateChanged (topic, message) {
    if (this._groupInput != null) {
      this._variables[this._groupInput][this._extractEntityId(topic, 3)].state =
        message.state
      this._trackStore()
    }
  }

  submitVariables (topic, message) {
    for (const v in this._variables) {
      if (this._varUpdated[v] == null || this._varUpdated[v]) {
        MessageBus.i.publish('var/set/' + this._exportEntityId(v),
                             this._variables[v], true)
        this._varUpdated[v] = false
      }
    }
    this._trackStore()
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
      this._trackStore()
    }
  }

  knotStart (topic, message) {
    const currentDateTime = new Date()
    this._knotTrack.push(
      {knotid: this._extractEntityId(topic, 3),
       timeStart: currentDateTime.toJSON()})
    this._trackStore()
  }

  inputSummary (topic, message) {
    MessageBus.i.publishHasResponse (
      topic, message, this._variables, false)
  }

  caseCompleted (topic, message) {
    if (!this._caseCompleted) {
      this._caseCompleted = true
      const currentDateTime = new Date()
      let kt = {
        event: topic,
        timeCompleted: currentDateTime.toJSON()
      }
      if (message && message.knotid)
        kt.knotid = message.knotid
      this._knotTrack.push(kt)
      this._trackStore()
      MessageBus.i.publish('case/summary/' + MessageBus.extractLevel(topic, 3),
        {userId: message.userId,
         caseId: message.caseId,
         knotTrack: this._knotTrack,
         variables: this._variables,
         varTrack: this._varTrack}, true)
    }
  }

  async sessionRound (topic, message) {
    const allVariables = await MessageBus.i.request('var/get/*')
    const currentDateTime = new Date()
    let kt = {
      event: topic,
      timeCompleted: currentDateTime.toJSON()
    }
    if (message && message.knotid)
      kt.knotid = message.knotid
    this._knotTrack.push(kt)
    this._trackStore()
    MessageBus.i.publish('case/summary/' + MessageBus.extractLevel(topic, 3),
      {userId: message.userId,
       caseId: message.caseId,
       knotSingleTrack: kt,
       variables: allVariables.message}, true)
  }

  async caseTryHalt (userId, caseId, instanceId) {
    const currentDateTime = new Date()
    this._knotTrack.push(
      {event: '*** try case halt ***',
       timeResume: currentDateTime.toJSON()}
    )
    this._variables['try case halt'] = '*** try case halt ***'
    await MessageBus.i.publish('case/summary/' + instanceId,
      {userId: userId,
       caseId: caseId,
       knotTrack: this._knotTrack,
       variables: this._variables,
       varTrack: this._varTrack}, true)
  }

  caseHalt (userId, caseId, instanceId) {
    const track = this._trackRetrieve()
    if (track != null) {
      const currentDateTime = new Date()
      track.knotTrack.push(
        {event: '*** case halted ***',
         timeResume: currentDateTime.toJSON()}
      )
      track.variables['case halted'] = '*** case halted ***'
      MessageBus.i.publish('case/summary/' + instanceId,
        {userId: userId,
         caseId: caseId,
         knotTrack: track.knotTrack,
         variables: track.variables,
         varTrack: this._varTrack}, true)
    }
  }

  /*
    * State Storage
    */
  _trackStore () {
    localStorage.setItem(Tracker.storeId,
      JSON.stringify(
        {knotTrack: this._knotTrack,
         variables: this._variables,
         varUpdated: this._varUpdated,
         varTrack: this._varTrack,
         mandatoryFilled: this._mandatoryFilled,
         groupInput: this._groupInput,
         caseCompleted: this._caseCompleted
       }
     ))
  }

  _trackRetrieve () {
    let track = null
    const trackS = localStorage.getItem(Tracker.storeId)
    if (trackS != null)
      track = JSON.parse(trackS)
    return track
  }

  pendingTrackRestore () {
    const track = this._trackRetrieve()
    if (track != null) {
      this._knotTrack = track.knotTrack
      this._variables = track.variables
      this._varTrack = track.varTrack
      this._varUpdated = track.varUpdated
      this._mandatoryFilled = track.mandatoryFilled
      this._groupInput = track.groupInput
      this._caseCompleted = track.caseCompleted
    }
    return (track != null)
  }
}

(function () {
  Tracker.storeId = 'harena-track'
})()

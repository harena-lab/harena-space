/**
 * Maintains the state of the play during its execution.
 *
 * State Object
 * {
 *   variables: {id: <variable name>, value: <variable value>},
 *   history: [<knot name>, ..., <knot name>]
 *   parameter: parameter object
 *   nextKnot: <integer> -- provisory
 *   completed: boolean
 * }
 *
 * MetaState Object
 * {
 *   script: {type: <instruction type>, }
 * }
 */

class PlayState {
  constructor () {
    this._state = {
      variables: {},
      history: [],
      parameter: null,
      nextKnot: 1,
      completed: false,
      flow: null
    }

    this._metastate = {}

    this.sessionRecord = this.sessionRecord.bind(this)
    MessageBus.i.subscribe('user/login/+', this.sessionRecord)

    this.variableGet = this.variableGet.bind(this)
    MessageBus.i.subscribe('var/get/#', this.variableGet)
    this.variableSet = this.variableSet.bind(this)
    MessageBus.i.subscribe('var/set/#', this.variableSet)
  }

  /*
   * Properties
   */

  // <TODO> Provisory - bring all flow dynamics to here
  get flow() {
    return this._state.flow
  }

  set flow(newFlow) {
    this._state.flow = newFlow
  }

  /*
    * State Storage
    */
  _stateStore () {
    localStorage.setItem(PlayState.storeId, JSON.stringify(this._state))
  }

  _stateRetrieve () {
    let state = null
    const stateS = localStorage.getItem(PlayState.storeId)
    if (stateS != null) { state = JSON.parse(stateS) }
    return (state == null || state.completed) ? null : state
  }

  sessionRecord (topic) {
    this._state.userid = MessageBus.extractLevel(topic, 3)
    // this._stateStore()
  }

  sessionCompleted () {
    this._state.completed = true
    this._stateStore()
  }

  pendingPlayCheck () {
    const state = this._stateRetrieve()
    return (state != null && !state.completed) ? state : null
  }

  pendingPlayId () {
    const state = this._stateRetrieve()
    return (state != null && state.caseid != null) ? state.caseid : null
  }

  pendingPlayRestore () {
    let currentKnot = null
    this._state = this._stateRetrieve()
    if (this._state.history.length > 0) {
      currentKnot = this._state.history[this._state.history.length - 1] }
    return currentKnot
  }

  /*
    * Properties
    */

  get userid () {
    return this._state.userid
  }

  get currentCase () {
    return this._state.caseid
  }

  set currentCase (caseid) {
    this._state.caseid = caseid
    this._stateStore()
  }

  get token () {
    return this._state.token
  }

  get parameter () {
    return this._state.parameter
  }

  set parameter (newValue) {
    this._state.parameter = newValue
    this._stateStore()
  }

  get runningCase () {
    return this._state.running
  }

  set runningCase (running) {
    this._state.running = running
    this._stateStore()
  }

  /*
    * Scenario Variables
    */

  _extractEntityId (topic, level) {
    return MessageBus.extractLevelsSegment(topic, level).replace(/\//g, '.')
  }

  variableGet (topic, message, track) {
    const type = MessageBus.extractLevel(topic, 3)
    let id = this._extractEntityId(topic, (type == '>') ? 4 : 3)

    if (id != null) {
      id = id.toLowerCase()

      if (id.startsWith('previous.')) {
        const previousKnot = this.historyPreviousId().toLowerCase()
        if (previousKnot != null) { id = previousKnot + '.' + id.substring(9) }
      }

      switch (type) {
        case '*':
          MessageBus.i.publishHasResponse (
            topic, message, this._state.variables, track)
          break
        case '>':
          let result = null
          while (this._state.variables[id] === undefined && id.indexOf('.') > -1)
            id = id.substring(id.indexOf('.') + 1)
          if (this._state.variables[id]) {
            for (const v in this._state.variables[id]) {
              if (this._state.variables[id][v].content == message.body)
                result = this._state.variables[id][v].state
            }
          }
          MessageBus.i.publishHasResponse (topic, message, result, track)
          break
        default:
          // handles an array index
          let aidx = -1
          const brk = id.indexOf('[')
          if (brk > -1) {
            // starts from 1 not 0
            aidx = parseInt(id.substring(brk+1, id.length-1)) - 1
            id = id.substring(0, brk)
          }

          // tries to give a scope to the variable
          if (this._state.variables[id] == null) {
            const currentKnot = this.historyCurrent()
            if (currentKnot != null &&
                this._state.variables[currentKnot + '.' + id] != null)
              id = currentKnot + '.' + id
          }

          MessageBus.i.publishHasResponse (
            topic, message,
            (aidx == -1 || this._state.variables[id] == null)
              ? this._state.variables[id] : this._state.variables[id][aidx],
            track)
      }
    }
  }

  variableSet (topic, message, track) {
    const id = this._extractEntityId(topic, 3)
    let status = false
    const content =
      (message.responseStamp != null && message.body != null) ?
      message.body : message

    if (id != null) {
      if (id == '*') {
        const vars = (content.value != null) ? content.value : content
        for (let v in vars)
          this._state.variables[v] = vars[v]
      } else
        this._state.variables[id.toLowerCase()] = content
      status = true
    }
    this._stateStore()

    MessageBus.i.publishHasResponse(topic, message, status, track)
 }

  /*
    * Navigation History
    */

  historyHasPrevious () {
    return (this._state.history.length > 1)
  }

  historyPreviousId () {
    return (this.historyHasPrevious())
      ? this._state.history[this._state.history.length - 2] : null
  }

  historyCurrent () {
    let current = null
    if (this._state.history.length > 0) { current = this._state.history[this._state.history.length - 1] }
    return current
  }

  historyPrevious () {
    let previous = null
    if (this.historyHasPrevious()) {
      this._state.history.pop()
      previous = this._state.history[this._state.history.length - 1]
      this._stateStore()
    }
    return previous
  }

  historyRecord (knot) {
    this._state.history.push(knot)
    this._stateStore()
  }

  /*
    * Next Knot Control (provisory)
    */
  nextKnot () {
    this._state.nextKnot++
    this._stateStore()
    return this._state.nextKnot.toString()
  }

  /*
    * MetaState Storage
    */
  _metastateStore () {
    localStorage.setItem(
      PlayState.storeMetaId, JSON.stringify(this._metastate))
  }

  _metastateRetrieve () {
    const metastateS = localStorage.getItem(PlayState.storeMetaId)
    if (metastateS != null) { this._metastate = JSON.parse(metastateS) }
  }

  /*
    * MetaScript Management
    */

  metascriptRecord (script) {
    this._metastate.script = script
    this._metastateStore()
  }

  metascriptNextInstruction () {
    let instruction = null
    this._metastateRetrieve()
    if (this._metastate != null && this._metastate.script &&
          this._metastate.script.length > 0) {
      instruction = this._metastate.script.shift()
      this._metastateStore()
    }
    return instruction
  }

  metaexecParameterSet (value) {
    this._metastateRetrieve()
    this._metastate.parameter = value
    this._metastateStore()
  }

  metaexecParameterGet () {
    this._metastateRetrieve()
    let parameter = null
    if (this._metastate != null && this._metastate.parameter) {
      parameter = this._metastate.parameter
      delete this._metastate.parameter
      this._metastateStore()
    }
    return parameter
  }
}

(function () {
  PlayState.storeId = 'harena-state'
  PlayState.storeMetaId = 'harena-metastate'
})()

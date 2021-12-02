class PrognosisBusDriver {
  //Controls and verifies message integrity. Ensures URL changes doesn't damage bus messages
  constructor() {
    this._lugagge = null
    this._lane = null
    this._storageKey = 'prognosis-bus-storage'
    this._caseId = null
    this._currentKnot = null
    this._knotSequence = []
    this._knotTrack = []
    this._variables = {}
    this._storedData = []
    this.travelPoint = this.travelPoint.bind(this)
    MessageBus.progn.subscribe('navigate/#', this.travelPoint)
    this.start()
    this.getCaseId()
    // this.verifyLocalStorage()
//     $( "#code" ).on('shown', function(){
//     alert("I want this to appear after the modal has opened!");
// });

  }

  async start (){
    this._lane = await this.busLaneCheck()
    this._lugagge = await this.verifyLocalStorage(this._storageKey)
    if(this._lugagge != null){
      this._variables = this._lugagge.variables || {}
      this.storedLaneCheck()
    }
    if(this._lane == 'case'){
      if(this._lugagge){
        await this.verifyKnotTrack()
        this.setKnotSequence()
        if(!this._lugagge.openKnot)
          this._currentKnot = this._knotSequence[0]
        else
          this._currentKnot = this._lugagge.openKnot
        if ((this._currentKnot != this._knotSequence[0])
        && new URL(document.location).pathname == '/prognosis/learn/player/') {
          MessageBus.progn.publish('knot/navigate/presentation')
        }
      }
    }
  }
  async currentCase (){
    if(this._caseId!= null)
      return this._caseId
    else
      return await this.getCaseId()
  }
  async verifyLocalStorage (){
    console.log('============ verifying bus lugagge')
    if(localStorage.getItem(this._storageKey)){
      console.log('============ lugagge in transit')
      return JSON.parse(localStorage.getItem(this._storageKey))
    }else {
      console.log('============ lugagge empty')
      return null
    }
  }

  async verifyKnotTrack (){
    const storedData = await this.verifyLocalStorage()
    if(storedData && storedData.knotTrack){
      this._knotTrack = storedData.knotTrack
    }
  }

  async dispatchLuggage (){
    const storedData = await this.verifyLocalStorage()
    console.log('======================================================================')
    console.log('============ Dispatching...')
    console.log('======================================================================')
    MessageBus.progn.publish(`progn/summary/${MessageBus.extractLevelsSegment(storedData.openLane, 3)}`,
      {userId: storedData.userId,
       laneId: storedData.openLane,
       trail: storedData.trail})
    console.log(`========= progn/summary/${MessageBus.extractLevelsSegment(storedData.openLane, 3)}`)
    console.log(JSON.stringify({userId: storedData.userId,
     laneId: storedData.openLane,
     trail: storedData.trail}))
     console.log('============ deleting localStorage...')
     localStorage.removeItem(this._storageKey)
     // let logger = await MessageBus.i.request('logger/create/post',
     //   {
     //     caseId: MessageBus.extractLevel(storedData.openLane, 3),
     //     instanceId: MessageBus.extractLevel(topic, 3),
     //     log: JSON.stringify(message)
     //   }
     // )
  }

  /*
      Message integrity verification (e.g. only one section/start should be active.
      Before section/navigate should end section/start)
  */
  async integrityCheck (message){
    const storedData = await this.verifyLocalStorage()
    console.log(storedData)
    if((message.lane == storedData.lane || message.navigate) && message.userId == storedData.userId){
      console.log('============ equal lane')
      if (message.topic != storedData.openLane) {
        console.log('============ different open lane')
        console.log('============ topic')
        console.log(message.topic)
        console.log('============open lane')
        console.log(storedData.openLane)
        return true
      }else {
        return false
      }
    }else{
      console.log('============ failed first integrityCheck')
      console.log(message.lane)
      console.log(storedData.lane)
      console.log(message.userId)
      console.log(message.userId)
      return false
    }
  }

  async storedLaneCheck (){
    const storedData = await this.verifyLocalStorage()
    if(storedData.lane != await this.busLaneCheck()){
      await this.dispatchLuggage()
    }
  }

  async busLaneCheck (){
    const url = new URL(document.location).pathname
    let currentLane
    switch (url) {
      case '/prognosis/':
        currentLane = 'section'
        break
      case '/prognosis/learn/':
        currentLane = 'section'
        break
      case '/prognosis/learn/progress/':
        currentLane = 'section'
        break
      default:
        currentLane = 'case'
    }
    console.log('============ current lane')
    console.log(currentLane)
    return currentLane
  }

  async startKnot (message){
    console.log('============ start knot by driver...')
    const storedData = await this.verifyLocalStorage()
    const currentDateTime = new Date()
    if(!storedData.knotTrack){
      this._knotTrack.push({
        knotId: MessageBus.extractLevel(message.topic, 3),
        timeStamp: currentDateTime.toJSON()
       })
      await this.storeLocalStorage(message)
      let newLuggage = await this.verifyLocalStorage()
      newLuggage.knotTrack = this._knotTrack
      newLuggage.openKnot = this._currentKnot
      localStorage.setItem(this._storageKey, JSON.stringify(newLuggage))
    }else{

      if(this._currentKnot != storedData.knotTrack[storedData.knotTrack.length-1].knotId){

        this._knotTrack = storedData.knotTrack
        this._knotTrack.push({
          knotId: MessageBus.extractLevel(message.topic, 3),
          timeStamp: currentDateTime.toJSON()
        })
        await this.storeLocalStorage(message)
        let newLuggage = await this.verifyLocalStorage()
        newLuggage.knotTrack = this._knotTrack
        newLuggage.openKnot = this._currentKnot
        localStorage.setItem(this._storageKey, JSON.stringify(newLuggage))
      }
    }
  }

  async storeVariables (knot){
    const storedData = await this.verifyLocalStorage()
    const _vars = document.querySelectorAll(`[data-bus-entity^="var/set"][data-bus-id^="${knot}"]`)
    for (let v of _vars) {
      let id = v.dataset.busId
      this._variables[id] = v.value
    }

  }

  async closeCurrentKnot (){

    const currentDateTime = new Date()
    const storedData = await this.verifyLocalStorage()
    this._currentKnot = storedData.openKnot
    await this.storeVariables(this._currentKnot)
    this._storedData = storedData.trail
    for (const v in this._variables) {
      console.log('============ logging variables')
      console.log(`var/set/${v}`)
      console.log(this._variables[v])
      let dump = {
        'topic': `var/set/${v}`,
        'value': this._variables[v],
        'timeStamp': currentDateTime.toJSON(),
      }
      this._storedData.push(dump)
      // MessageBus.progn.publish('var/set/' + v, this._variables[v])

    }

    let dump = {
      'topic': `knot/close/${this._currentKnot}`,
      'timeStamp': currentDateTime.toJSON(),
    }
    this._storedData.push(dump)
    let newLuggage = storedData
    newLuggage.trail = this._storedData
    newLuggage.variables = this._variables
    localStorage.setItem(this._storageKey, JSON.stringify(newLuggage))
  }

  async navigateKnot (message, direction){
    await this.closeCurrentKnot()
    const currentDateTime = new Date()
    const storedData = await this.verifyLocalStorage()
    this._knotTrack = storedData.knotTrack
    if(!direction)
      this._currentKnot = this._knotSequence[this._knotSequence.indexOf(MessageBus.extractLevel(message.topic, 3))]
    else if(direction == 'next' && this._knotSequence.length > this._knotSequence.indexOf(this._currentKnot))
      this._currentKnot = this._knotSequence[this._knotSequence.indexOf(this._currentKnot)+1]
    else if(direction == 'back' && this._knotSequence.indexOf(this._currentKnot) > 0)
      this._currentKnot = this._knotSequence[this._knotSequence.indexOf(this._currentKnot)-1]
    console.log('==============================================================================')
    console.log('==============================================================================')
    console.log('==============================================================================')
    console.log('============ navigating through knot')
    console.log('============ direction')
    console.log(direction)
    console.log('============ open knot')
    console.log(storedData.openKnot)
    console.log('============ knot')
    console.log(this._currentKnot)


    this._storedData = storedData.trail
    let dump = {
      'topic': message.topic,
      'timeStamp': message.timeStamp,
    }

    const knotManager = await this.knotAcrossURL(this._currentKnot, storedData.openKnot)


    this._storedData.push(dump)
    let newLuggage = storedData
    newLuggage.trail = this._storedData
    newLuggage.knotTrack = this._knotTrack
    if(knotManager.changeKnot == true)
      newLuggage.openKnot = this._knotSequence[0]
    else
      newLuggage.openKnot = this._currentKnot
    await localStorage.setItem(this._storageKey, JSON.stringify(newLuggage))
    let newTime = new Date()
    await this.startKnot({
      navigate: 'case',
      topic: `knot/start/${this._currentKnot}`,
      userId: sessionStorage.getItem('harena-user-id'),
      lane: 'case',
      timeStamp: newTime.toJSON()
    })
    if(knotManager.changeURL == true && knotManager.url)
      document.location.href = knotManager.url
  }

  knotAcrossURL(targetKnot, currentKnot){

    if((targetKnot == 'presentation' && currentKnot == 'overview')
    || (targetKnot == 'overview' && currentKnot == 'presentation')){
      return{changeURL:false}
    }else if((targetKnot == 'overview' && currentKnot == 'roulette')){
      return{changeURL:true, changeKnot:true, url:'/prognosis/learn/player/'}
    }else{
      return{changeURL:true, changeKnot:false}
    }
  }

  async storeLocalStorage (message){
    const storedData = await this.verifyLocalStorage()
    console.log('============ storing:')
    console.log(message)


    if(!storedData){
      console.log('============ empty storage')
      let dump = {
        userId: message.userId,
        lane: message.lane,
        openLane: message.topic,
        trail: [{
          'topic': message.topic,
          'timeStamp': message.timeStamp,
        },
        ],
      }
      localStorage.setItem(this._storageKey, JSON.stringify(dump))
    }else{
      if(await this.integrityCheck(message)){
        console.log('============ storing new')
        console.log(message)
        this._storedData = storedData.trail
        let dump = {
          'topic': message.topic,
          'timeStamp': message.timeStamp,
        }
        this._storedData.push(dump)
        let newLuggage = storedData
        newLuggage.trail = this._storedData

        if(MessageBus.extractLevel(message.topic,2) == 'start' && (MessageBus.extractLevel(message.topic,1) == storedData.lane)){
          newLuggage.openLane = message.topic
        }else{
          newLuggage.openLane = storedData.openLane
        }
        // console.log('============ setting after integrity check')
        localStorage.setItem(this._storageKey, JSON.stringify(newLuggage))
        // console.log('============ storage state after integrity check')
        // console.log(localStorage.getItem(this._storageKey))
      }else{
        // console.log('============ duplicate luggage')
        // console.log(message.topic)
      }
    }
    return localStorage.getItem(this._storageKey)
  }

  async storeTrigger (message){
    const storedData = await this.verifyLocalStorage()
    let dump = {
      topic: message.topic,
      timeStamp: message.timeStamp
    }
    console.log('============ storing trigger')
    console.log(dump)
    this._storedData = storedData.trail
    let newLuggage = storedData
    this._storedData.push(dump)
    newLuggage.trail = this._storedData
    localStorage.setItem(this._storageKey, JSON.stringify(newLuggage))
  }

  async storeInCodeVars(message, mode){
    const storedData = await this.verifyLocalStorage()
    let dump
    let newLuggage
    if(mode == 'trail'){
      dump={
        topic: message.topic,
        value: message.value,
        timeStamp: message.timeStamp,
      }
      console.log('============ storing in code var (only trails)')
      console.log(dump)
      this._storedData = storedData.trail
      newLuggage = storedData
      this._storedData.push(dump)
      newLuggage.trail = this._storedData
      localStorage.setItem(this._storageKey, JSON.stringify(newLuggage))
    }else if(mode == 'var'){
      dump={
        topic: message.topic,
        value: message.value,
        timeStamp: message.timeStamp,
      }
      console.log('============ storing in code var (only vars)')
      console.log(dump)
      this._variables[MessageBus.extractLevelsSegment(message.topic,3)] = message.value
    }else{
      dump={
        topic: message.topic,
        value: message.value,
        timeStamp: message.timeStamp,
      }
      this._variables[MessageBus.extractLevelsSegment(message.topic,3)] = message.value
      console.log('============ storing in code var (both trail and vars)')
      console.log(dump)
      this._storedData = storedData.trail
      newLuggage = storedData
      this._storedData.push(dump)
      newLuggage.trail = this._storedData
      localStorage.setItem(this._storageKey, JSON.stringify(newLuggage))
    }
  }

  async setKnotSequence (){
    const url = new URL(document.location).pathname
    switch (url) {
      case '/prognosis/learn/player/':
        this._knotSequence = ['presentation', 'overview', 'roulette']
        break
      case '/prognosis/learn/player/result/':
        this._knotSequence = ['presentation', 'overview', 'roulette']
        break
      case '/prognosis/challenge/1/':
        this._knotSequence = ['presentation', 'overview', 'result']
        break
      case '/prognosis/challenge/2/':
        this._knotSequence = ['presentation', 'overview', 'result']
        break
      default:
    }
    if(this._currentKnot == null)
      this._currentKnot = this._knotSequence[0]
    return this._knotSequence
  }

  async travelPoint (topic, message){
    // console.log(localStorage.getItem(this._storageKey))
    console.log('============ travelling to')
    console.log(message)
    console.log('============ local storage just before departure')
    console.log(localStorage.getItem(this._storageKey))
    document.location.href = message
  }

  async closeCurrentEntity (){
    // await this.storeVariables()
    const currentTime = new Date()
    const storedData = await this.verifyLocalStorage()
    if(storedData.lane == 'case')
      await this.closeCurrentKnot()
    const currentEntity = storedData.trail[0]['topic']
    return {
      topic: `${storedData.lane}/end/${MessageBus.extractLevelsSegment(currentEntity, 3)}`,
      userId: sessionStorage.getItem('harena-user-id'),
      lane: storedData.lane,
      timeStamp: currentTime.toJSON()
    }
  }

  async getCaseId (){
    const currentLvl = await MessageBus.progn.waitMessage('case/get/currentLvl')
    // console.log('==========================================================================================================')
    // console.log(currentLvl.message)
    switch (new URL(document.location).pathname) {
      case '/prognosis/learn/player/':
        this._caseId = `progn/${localStorage.getItem('prognosis-current-lvl')}`
        break
      case '/prognosis/learn/player/result/':
        this._caseId = `progn/${localStorage.getItem('prognosis-current-lvl')}`
        break
      case '/prognosis/challenge/1/':
        this._caseId = `ch1/${localStorage.getItem('prognosis-challenge1-current-lvl')}`
        break
      case '/prognosis/challenge/2/':
        this._caseId = `ch2/${localStorage.getItem('prognosis-challenge2-current-lvl')}`
        break
      default:
    }
    return (this._caseId)
  }

  async logoutUser (){
    await PrognosisBusDriver.i.storeLocalStorage(await PrognosisBusDriver.i.closeCurrentEntity())
    await PrognosisBusDriver.i.dispatchLuggage()
    console.log('============ luggage sent to manager')
    console.log('============ user ready for logout')
    MessageBus.progn.publish('system/logout/ready')
  }
}

(function () {
  PrognosisBusDriver.i = new PrognosisBusDriver()
})()

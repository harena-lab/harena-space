class PrognosisBus {
  constructor() {
    this._state = {}
    this.section = this.section.bind(this)
    this.case = this.case.bind(this)
    this.knot = this.knot.bind(this)
    this.vars = this.vars.bind(this)
    this.start = this.start.bind(this)
    this.user = this.user.bind(this)
    MessageBus.progn = new MessageBus(false)

    MessageBus.i.subscribe('control/html/ready', this.start)

    MessageBus.progn.subscribe('knot/#', this.knot)
    MessageBus.progn.subscribe('section/#', this.section)
    MessageBus.progn.subscribe('case/#', this.case)
    MessageBus.progn.subscribe('var/#', this.vars)
    MessageBus.progn.subscribe('compute/#', this.vars)
    MessageBus.progn.subscribe('trigger/#', this.vars)
    MessageBus.progn.subscribe('user/#', this.user)

    this.overwatch()
  }
  navigation (topic, message) {
    // console.log('============ navigate')
  }
  async start(){
    const currentTime = new Date()
    // console.log('============ time')
    // console.log(currentTime.toJSON())
    MessageBus.progn.publish((`${await PrognosisBusDriver.i.busLaneCheck()}/start${document.location.pathname}`), currentTime)

  }

  async user (topic, message){
    switch (MessageBus.extractLevel(topic, 2)) {
      case 'logout':
        // console.log('============ user logging out')
        await PrognosisBusDriver.i.logoutUser()
        break
      default:

    }
  }

  async section(topic, message){

    const action = MessageBus.extractLevel(topic,2)
    const id = MessageBus.extractLevelsSegment(topic, 3)
    // console.log('============ action')
    // console.log(action)
    // console.log('============ id')
    // console.log(id)
    const currentTime = new Date()
    let ms

    switch (action) {
      case 'start':
        ms = {
          topic: topic,
          userId: sessionStorage.getItem('harena-user-id'),
          lane: 'section',
          timeStamp: currentTime.toJSON()
        }
        PrognosisBusDriver.i.storeLocalStorage(ms)
        break
      case 'end':
        ms = {
          topic: topic,
          userId: sessionStorage.getItem('harena-user-id'),
          lane: 'section',
          timeStamp: currentTime.toJSON()
        }
        PrognosisBusDriver.i.storeLocalStorage(ms)
        break
      case 'navigate':
        console.log('============ closing current lane')
        console.log(await PrognosisBusDriver.i.storeLocalStorage(await PrognosisBusDriver.i.closeCurrentEntity()))
        ms = {
          navigate: 'section',
          topic: topic,
          userId: sessionStorage.getItem('harena-user-id'),
          lane: await PrognosisBusDriver.i.busLaneCheck(),
          timeStamp: currentTime.toJSON()
        }
        await PrognosisBusDriver.i.storeLocalStorage(ms)
        // console.log('============ local storage state')
        // console.log(localStorage.getItem(PrognosisBusDriver.i._storageKey))
        MessageBus.progn.publish('navigate/ready', `/${id}`)
        break
      default:

    }
  }

  async case(topic, message){
    const action = MessageBus.extractLevel(topic,2)
    const id = MessageBus.extractLevelsSegment(topic, 3)
    const currentTime = new Date()
    let ms
    switch (action) {
      case 'start':
      // console.log('============ starting case')
        ms = {
          topic: `${MessageBus.extractLevelsSegment(topic, 1,2)}/${await PrognosisBusDriver.i.currentCase()}`,
          userId: sessionStorage.getItem('harena-user-id'),
          lane: 'case',
          timeStamp: currentTime.toJSON()
        }
        await PrognosisBusDriver.i.storeLocalStorage(ms)
        console.log('============ knot start')
        await PrognosisBusDriver.i.setKnotSequence()
        ms = {
          topic: `knot/start/${PrognosisBusDriver.i._currentKnot}`,
          userId: sessionStorage.getItem('harena-user-id'),
          lane: 'case',
          timeStamp: currentTime.toJSON()
        }
        await PrognosisBusDriver.i.startKnot(ms)
        break
      case 'navigate':
        console.log('============ closing current entity to navigate')
        await PrognosisBusDriver.i.storeLocalStorage(await PrognosisBusDriver.i.closeCurrentEntity())
        if(await PrognosisBusDriver.i.busLaneCheck() == 'case'){
          console.log('============ dispatching luggage to logger')
          await PrognosisBusDriver.i.dispatchLuggage()
        }

        // console.log('============ navigating case')
        ms = {
          navigate: 'case',
          topic: topic,
          userId: sessionStorage.getItem('harena-user-id'),
          lane: await PrognosisBusDriver.i.busLaneCheck(),
          timeStamp: currentTime.toJSON()
        }
        await PrognosisBusDriver.i.storeLocalStorage(ms)
        // console.log('============ local storage state')
        // console.log(localStorage.getItem(PrognosisBusDriver.i._storageKey))
        MessageBus.progn.publish('navigate/ready', `${message}`)
        break
      case 'end':
        ms = {
          topic: topic,
          userId: sessionStorage.getItem('harena-user-id'),
          lane: 'case',
          timeStamp: currentTime.toJSON()
        }
        PrognosisBusDriver.i.storeLocalStorage(ms)
        break
      default:

    }
  }

  async knot(topic, message){
    const action = MessageBus.extractLevel(topic,2)
    const id = MessageBus.extractLevelsSegment(topic, 3)
    const currentTime = new Date()
    let ms
    switch (action) {
      case 'start':
      // console.log('============ starting knot')
      let knot
        ms = {
          topic: `${MessageBus.extractLevelsSegment(topic, 1,2)}/`,
          userId: sessionStorage.getItem('harena-user-id'),
          lane: 'case',
          timeStamp: currentTime.toJSON()
        }
        PrognosisBusDriver.i.startKnot(ms)
        break
      case 'end':
        // ms = {
        //   topic: topic,
        //   userId: sessionStorage.getItem('harena-user-id'),
        //   lane: 'case',
        //   timeStamp: currentTime.toJSON()
        // }
        // PrognosisBusDriver.i.storeLocalStorage(ms)
        break
      case 'navigate':
        // console.log('============ closing current knot')
        // console.log(await PrognosisBusDriver.i.storeLocalStorage(await PrognosisBusDriver.i.closeCurrentEntity()))
        // console.log('============ navigating knot')
        let direction = null
        if(message)
          ms = {
          navigate: 'case',
          url: message.url,
          topic: topic,
          userId: sessionStorage.getItem('harena-user-id'),
          lane: await PrognosisBusDriver.i.busLaneCheck(),
          timeStamp: currentTime.toJSON()
        }
        else
          ms = {
        navigate: 'case',
        topic: topic,
        userId: sessionStorage.getItem('harena-user-id'),
        lane: await PrognosisBusDriver.i.busLaneCheck(),
        timeStamp: currentTime.toJSON()
      }
        if(MessageBus.extractLevel(topic,3) == '>')
          direction = 'next'
        else if (MessageBus.extractLevel(topic,3) == '<')
          direction = 'back'
        if(direction != null)
          await PrognosisBusDriver.i.navigateKnot(ms, direction)
        else
          await PrognosisBusDriver.i.navigateKnot(ms)


        // MessageBus.progn.publish('navigate/ready', `/${id}`)
        break
      default:

    }
  }

  async vars(topic, message){
    const timeStamp = new Date().toJSON()
    if (MessageBus.matchFilter(topic, 'var/set/#')) {
      await PrognosisBusDriver.i.storeInCodeVars({topic:topic, value:message, timeStamp:timeStamp})
      // console.log(MessageBus.extractLevel(topic, 3))
    }
    if (MessageBus.matchFilter(topic, 'trigger/run/#')) {
      await PrognosisBusDriver.i.storeContainsValue({topic:topic, timeStamp:timeStamp})
      // console.log(MessageBus.extractLevel(topic, 3))
    }
    if (MessageBus.matchFilter(topic, 'compute/#')) {
      await PrognosisBusDriver.i.storeContainsValue({topic:topic, value:message, timeStamp:timeStamp})
      // console.log(MessageBus.extractLevel(topic, 3))
    }
    if (MessageBus.matchFilter(topic, 'input/#')) {
      await PrognosisBusDriver.i.storeContainsValue({topic:topic, value:message, timeStamp:timeStamp})
      // console.log(MessageBus.extractLevel(topic, 3))
    }
  }

  async compute(topic, message){
    const timeStamp = new Date().toJSON()
    await PrognosisBusDriver.i.storeCompute({topic:topic, value:message, timeStamp:timeStamp})
  }

  overwatch(){
    // console.log('============ overwatching')
    // Select the node that will be observed for mutations
    const targetNode = document

    // Options for the observer (which mutations to observe)
    const config = { childList: true, subtree: true, attributes: true}

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
      const fnClickEntity = function(){
        // console.log('============ clicked entity')
        // console.log(this.dataset.busEntity+this.dataset.busId)
        MessageBus.progn.publish(`${this.dataset.busEntity}${this.dataset.busId}`
          , this.dataset.action)
      }

      const fnVariablesEntity = function(){
        // console.log('============ changed variable')
        // console.log(this.dataset.busEntity+this.dataset.busId)
        // console.log(this.value)
        MessageBus.progn.publish(`${this.dataset.busEntity}${this.dataset.busId}`
          , this.value)
      }
      // Use traditional 'for loops' for IE 11
      for(const mutation of mutationsList) {

        if (mutation.target.dataset && mutation.target.dataset.busEntity && !mutation.target.dataset.mutationListener) {
          // console.log('An entity uuuuu scary')
          // console.log(mutation.target.dataset.busEntity+mutation.target.dataset.busId)
          if(mutation.target.dataset.busEntity != 'var/set'){
            mutation.target.dataset.mutationListener = true
            mutation.target.addEventListener('click', fnClickEntity)
          }else if(mutation.target.dataset.busEntity == 'var/set'){
            mutation.target.dataset.mutationListener = true
            mutation.target.addEventListener('input', fnClickEntity)
          }


        }
      }
    }

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback)

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config)

  }

}

(function () {
  PrognosisBus.i = new PrognosisBus()
})()

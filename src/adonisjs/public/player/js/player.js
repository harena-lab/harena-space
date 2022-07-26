// const storePrefix = "casenote_";

class PlayerManager {
  constructor () {
    Basic.service.host = this

    this._server = new DCCPlayerServer()
    this._tracker = new Tracker()
    this._state = new PlayState()

    this.controlEvent = this.controlEvent.bind(this)
    MessageBus.i.subscribe('control/#', this.controlEvent)
    this.navigateEvent = this.navigateEvent.bind(this)
    MessageBus.i.subscribe('knot/navigate/#', this.navigateEvent)
    MessageBus.i.subscribe('flow/navigate/+', this.navigateEvent)
    MessageBus.i.subscribe('case/navigate/+', this.navigateEvent)
    MessageBus.i.subscribe('session/close', this.navigateEvent)

    this._notesStack = []

    // <TODO> temporary
    this.produceReport = this.produceReport.bind(this)
    MessageBus.i.subscribe('report/get', this.produceReport)

    this.caseCompleted = this.caseCompleted.bind(this)
    MessageBus.i.subscribe('case/completed/+', this.caseCompleted)

    this.sessionRound = this.sessionRound.bind(this)
    MessageBus.i.subscribe('session/round', this.sessionRound)

    // tracking
    this.trackTyping = this.trackTyping.bind(this)

    // <TODO> provisory
    // this._nextKnot = 1;

  }

  /*
    * Event handlers
    * **************
    */

  controlEvent (topic, message) {
    switch (topic) {
      case 'control/register': this.register(); break
      case 'control/signin': this.signIn(); break
    }
  }

  async navigateEvent (topic, message) {
    if (MessageBus.extractLevel(topic, 3) != '!') { // navigation blocked
      let target =
        MessageBus.extractLevelsSegment(topic,
          (MessageBus.extractLevel(topic, 3) == '=') ? 4 : 3).replace(/\//g, '.')
      this.trackTrigger(target)

      let mandatoryEmpty = null
      const mandatoryM = await MessageBus.i.request('input/mandatory/*')
      for (const m in mandatoryM.message) {
        if (mandatoryM.message[m].filled == false && mandatoryEmpty == null) {
          mandatoryEmpty = mandatoryM.message[m].message }
      }

      if (mandatoryEmpty != null) {
        MessageBus.i.publish(MessageBus.extractLevelsSegment(topic, 1, 2) + '/!',
                             'Input missing: ' + mandatoryEmpty, true)
        await DCCNoticeInput.displayNotice(
          'You must answer the question: ' + mandatoryEmpty,
          'message', 'Ok')
      } else {
        if (this._currentKnot != null) {
          MessageBus.i.publish('input/submit/*', null, true) // <TODO> provisory
          MessageBus.i.publish('knot/end/' + this._currentKnot.replace(/\./g, '/'),
                               null, true)
        }

        switch (topic) {
          case 'knot/navigate/<':
            if (this._notesStack.length > 0) {
              const panel = this._notesStack.pop()
              this._mainPanel.removeChild(panel)
            }
            if (this._state.historyHasPrevious()) {
              // removes the panel to rebuild it
              if (this._notesStack.length > 0) {
                const panel = this._notesStack.pop()
                this._mainPanel.removeChild(panel)
              }
              this.knotLoad(this._state.historyPrevious())
            }
            break
          case 'knot/navigate/<<': this.startCase()
            const flowStart = this._nextFlowKnot()
            const startKnot = (flowStart != null)
                                 ? flowStart.target
                                 : (DCCPlayerServer.localEnv)
                                   ? DCCPlayerServer.playerObj.start
                                   : this._compiledCase.start
            // console.log("=== start");
            // console.log(startKnot);
            this._state.historyRecord(startKnot)
            this.knotLoad(startKnot)
            break
          case 'knot/navigate/>':
            const nextKnot = this._state.nextKnot()
            this._state.historyRecord(nextKnot)
            this.knotLoad(nextKnot)
            break
          case 'flow/navigate/>':
            const flowNext = this._nextFlowKnot()
            if (flowNext != null) {
              this._state.historyRecord(flowNext.target)
              this.knotLoad(flowNext.target)
            }
            break
          case 'case/navigate/>':
            // <TODO> jumping other instructions - improve it
            // console.log('=== next case')
            let instruction
            do {
              instruction = this._state.metascriptNextInstruction()
            } while (instruction != null && instruction.type != 'divert-script' &&
                          instruction.target.substring(0, 5).toLowerCase() != 'case.')

            // console.log(instruction)
            if (instruction != null) {
              if (instruction.parameter) {
                // console.log("=== metaparameter");
                // console.log(instruction.parameter.parameter);
                this._state.metaexecParameterSet(instruction.parameter.parameter)
              }
              window.open('index.html?case=' +
                       instruction.target.substring(5) +
                       (this._previewCase ? '&preview' : ''), '_self')
            }
            break
          case 'session/close':
            this.sessionClose()
            break
          default: if (MessageBus.matchFilter(topic, 'knot/navigate/#')) {
            if (MessageBus.matchFilter(topic, 'knot/navigate/=/#')) {
              const result = await MessageBus.i.request(
                'var/get/' + target.replace(/\./g, '/'), null, null, true)
              target = Translator.instance.findContext(
                this._compiledCase.knots, this._currentKnot,
                result.message)
            }
            this._state.historyRecord(target)
            // this._updateFlowKnot(target)
            if (message && message.value) {
              this._state.parameter = message.value
              this.knotLoad(target, message.value)
            } else {
              this._state.parameter = null
              this.knotLoad(target)
            }
          } else if (MessageBus.matchFilter(topic, 'case/navigate/+')) {
            if (message) {
              this._state.metaexecParameterSet(message.parameter)
            }
            window.open('index.html?case=' + target +
                             (this._previewCase ? '&preview' : ''), '_self')
          }
          break
        }
      }
    }
  }

  _nextFlowKnot () {
    if (this._branchRoot != null) {
      this._currentKnot = this._branchRoot
      this._branchRoot = null
    }
    let next = null
    if (this._state.flow) {
      if (!this._currentKnot)
        next = this._state.flow[0]
      else {
        let curr = -1
        for (const c in this._state.flow)
          if (this._state.flow[c].target == this._currentKnot) {
            curr = c
            break
          }
        if (curr > -1 && curr < this._state.flow.length-1)
          next = this._state.flow[parseInt(curr)+1]
      }
      // next = this._state.flow.shift()
      // if (this._state.flow.length == 0) { delete this._state.flow }
    }
    return next
  }

  /*
  _updateFlowKnot (knot) {
    // console.log('=== knot & flow')
    // console.log(knot)
    // console.log(this._state.flow.slice())
    if (this._state.flow) {
      let next
      do {
        next = this._state.flow.shift()
      } while (this._state.flow.length > 0 && next.target != knot)
      if (this._state.flow.length == 0) { delete this._state.flow }
    }
    // console.log(this._state.flow.slice())
  }
  */

  async tryHalt () {
    try {
      const pPlay = this._state.pendingPlayCheck()
      if (!this._previewCase && pPlay != null && pPlay.running)
        this._tracker.caseTryHalt(pPlay.userid, pPlay.caseid, pPlay.running.runningId)
    } catch (e) {
      console.log('=== error on halt')
      console.log(e)
    }
    return ''
  }

  async startPlayer (caseid) {
    this.tryHalt = this.tryHalt.bind(this)
    window.onbeforeunload = this.tryHalt
    /*
    window.onbeforeunload = function() {
      return "";
    }
    */
    const resumeActive = true  // activates and deactivates case resume
    this._mainPanel = document.querySelector('#player-panel')

    const parameters = window.location.search.substr(1)
    let precase = null
    let precaseid = null
    this._previewCase = false
    if (parameters != null && parameters.length > 0) {
      precase = parameters.match(/case=([\w-]+)/i)
      if (precase != null) { precase = precase[1] } else {
        precaseid = parameters.match(/id=([\w-]+)/i)
        precaseid = (precaseid != null) ? precaseid[1] : null
      }
      const metaparameter = this._state.metaexecParameterGet()
      if (metaparameter != null) { this._state.metaparameter = metaparameter }
      const previewRE = /preview/i
      this._previewCase = previewRE.test(parameters)
      if (this._previewCase) { document.querySelector('#preview-panel').style.display = 'initial' }
    } else { precase = null }

    let resume = false
    const pPlay = this._state.pendingPlayCheck()
    if (!this._previewCase && pPlay != null && pPlay.running && resumeActive) {
      this._tracker.caseHalt(pPlay.userid, pPlay.caseid, pPlay.running.runningId)

      // <TODO> adjust for name: (precase == null || this._state.pendingPlayId() == precase)) {
      const decision = await DCCNoticeInput.displayNotice(
        'You have an unfinished case. Do you want to continue?',
        'message', 'Yes', 'No')
      if (decision == 'Yes') {
        resume = true
        const currKnot = this._state.pendingPlayRestore()
        this._tracker.pendingTrackRestore()
        DCCCommonServer.instance.token = this._state.token

        // <TODO> provisory deactivation
        // await this._caseLoad(this._state.currentCase);
        // const current = this._state.historyCurrent();
        this.resumeCase()
        /*
            if (this._state.parameter == null)
               this.knotLoad(current);
            else
               this.knotLoad(current, this._state.parameter);
            */

        // <TODO> provisory
        this._state.currentCase = this._state.currentCase
        await this._caseLoad(this._state.currentCase)

        // this._caseFlow()
        MessageBus.i.publish('knot/navigate/' + currKnot, null, true)
      } // else { this._state.sessionCompleted() }
    }

    if (!resume) {
      if (DCCCommonServer.instance.local) { await this._caseLoad() } else {
        /*
           await Basic.service.signin(this._state,
                 (precase != null || precaseid != null));
           */

        if (DCCPlayerServer.localEnv) { Basic.service.currentCaseId = DCCPlayerServer.playerObj.id } else {
          if (precaseid) { caseid = precaseid } else {
            let pi = -1
            let cases = null
            if (!precase) {
              const casesM = await MessageBus.i.request('data/case/*/list',
                {
                  filterBy: 'user',
                  filter: this._state.userid
                }, null, true)
              cases = casesM.message
              if (cases != null && cases.length == 1) { pi = 0 }
            }

            if (pi == -1) {
              const casesM = await MessageBus.i.request('data/case/*/list', null, null, true)
              cases = casesM.message

              if (precase != null) {
                for (const c in cases) {
                  if (cases[c].title == precase) { pi = c }
                }
              }
            }

            if (!caseid && pi == -1) {
              caseid = await DCCNoticeInput.displayNotice(
                'Select a case to load.',
                'list', 'Select', 'Cancel', cases)
            } else { caseid = cases[pi].id }
          }
          // console.log("=== case: " + caseid);
          this._state.currentCase = caseid
          await this._caseLoad(caseid)

          this._caseFlow()
        }
      }
      MessageBus.i.publish('knot/navigate/<<', null, true)
      // this.knotLoad("entry");
    }
  }

  async _caseLoad (caseid) {
    Basic.service.currentCaseId =
      new URL(document.location).searchParams.get('id')
    /*
    const caseObj = await MessageBus.i.request(
      'service/request/get', {caseId: Basic.service.currentCaseId}, null, true)
    */
    const caseObj = await MessageBus.i.request('case/get/' + Basic.service.currentCaseId, null, null, true)

    this._currentCaseTitle = caseObj.message.title

    this._compiledCase =
         await Translator.instance.compileMarkdown(Basic.service.currentCaseId,
           caseObj.message.source)
    console.log('***** COMPILED CASE *****')
    console.log(this._compiledCase)
    this._knots = this._compiledCase.knots
    // Basic.service.currentThemeFamily = this._compiledCase.theme
    Basic.service.composedThemeFamily(this._compiledCase.theme)
    MessageBus.i.publish('case/ready/' + Basic.service.currentCaseId, null, true)
  }

  _caseFlow () {
    if (this._compiledCase.flow) {
      const content = this._compiledCase.flow
      let flow = null
      let c = 0
      while (c < content.length && flow == null) {
        if (content[c].type == 'field' &&
                (!this._state.metaparameter ||
                 this._state.metaparameter == content[c].field)) {
          flow = []
          for (const f in content[c].value) {
            if (f == '_sequential_') {
              let lastLevel = 0
              let lastK = null
              for (const k in this._knots) {
                if (!this._knots[k].categories || !this._knots[k].categories.includes('note')) {
                  if (this._knots[k].level > lastLevel) { lastK = k } else {
                    flow.push({ target: lastK })
                    lastK = k
                  }
                  lastLevel = this._knots[k].level
                }
              }
              if (lastK != null) { flow.push({ target: lastK }) }
            } else {
              const t = { target: f.replace(/ /g, '_') }
              if (f.value) { t.parameter = f.value }
              flow.push(t)
            }
          }
        }
        c++
      }
      if (flow != null && flow.length > 0)
        this._state.flow = flow
      console.log('=== flow')
      console.log(flow)
    }
  }

  async knotLoad (knotName, parameter) {
    // MessageBus.i.showListeners()

    if (this._knots[knotName].categories &&
        this._knots[knotName].categories.includes('branch'))
      this._branchRoot = this._currentKnot
    this._currentKnot = knotName

    // <TODO> Local Environment - Future
    /*
      this._knotScript = document.createElement("script");
      this._knotScript.src = "knots/" + knotName + ".js";
      document.head.appendChild(this._knotScript);
      */
    if (!DCCPlayerServer.localEnv) {
      if (parameter) {
        MessageBus.i.publish(
          'var/set/' + knotName.replace(/\./g, '/') + '/parameter', parameter, true)
      }
      if (this._compiledCase.role && this._compiledCase.role == 'metacase' &&
             this._knots[knotName].categories &&
             this._knots[knotName].categories.includes('script')) { MetaPlayer.player.play(this._knots[knotName], this._state) } else {
        let knot = await Translator.instance.generateHTML(
          this._knots[knotName])
        knot = '<scope-dcc id="player" externalize>' + knot + '</scope-dcc>'
        let note = false
        if (this._knots[knotName].categories && Translator.instance.themeSettings &&
            Translator.instance.themeSettings.note) {
          note = this._knots[knotName].categories.find(
            cat => Translator.instance.themeSettings.note.includes(cat))
        }
        if (note) { this.presentNote(knot) } else { this.presentKnot(knot) }
      }
    }
    MessageBus.i.publish('knot/start/' + knotName.replace(/\./g, '/'),
                         null, true)

    if (this._knots[knotName].categories &&
        this._knots[knotName].categories.includes('end'))
      MessageBus.i.publish('case/completed/' + this._state.runningCase.runningId,
                           {userId: this._state.userid,
                            caseId: Basic.service.currentCaseId,
                            knotid: knotName}, true)
  }

  caseCompleted (topic, message) {
    this._state.sessionCompleted()
  }

  async sessionClose (topic, message) {
    this._state.sessionCompleted()
    window.open('../home/category/cases/?id=podcast&clearance=1', '_self')
  }

  async sessionRound (topic, message) {
    MessageBus.i.publish('session/round/' + this._state.runningCase.runningId,
                         {userId: this._state.userid,
                          caseId: Basic.service.currentCaseId,
                          knotid: this._currentKnot}, true)
  }

  presentKnot (knot) {
    // MessageBus.page = new MessageBus(false)

    this._mainPanel.innerHTML = knot
    document.querySelector('#main-panel').scrollTo(0, 0)

    // <TODO> Local Environment - Future
    /*
      if (DCCPlayerServer.localEnv)
         document.head.removeChild(this._knotScript);
      */

    // <TODO> Improve the strategy
    if (this._currentKnot == 'entry') { this.startGame() }
  }

  presentNote (knot) {
    // <TODO> provisory
    // if (!MessageBus.page) { MessageBus.page = new MessageBus(false) }

    const dimensions = Basic.service.screenDimensions()

    const div = document.createElement('div')

    div.style.position = 'absolute'
    div.style.margin = 'auto'
    div.style.top = 0
    div.style.right = 0
    div.style.bottom = 0
    div.style.left = 0
    div.style.width = (dimensions.width * (0.7 - this._notesStack.length * 0.1)) + 'px'
    div.style.height = (dimensions.height * (0.7 - this._notesStack.length * 0.1)) + 'px'

    div.innerHTML = knot

    this._mainPanel.appendChild(div)
    this._notesStack.push(div)
  }

  /*
    * Registry related operations
    * ***************************
    */

  /*
   startGame() {
      this._history = [];

      this._server.resetRunningCase();
      let currentUser = this._server.getCurrentUser();
      if (currentUser == null)
         document.querySelector("#signin-register").style.display = "flex";
      else {
         let userId = document.querySelector("#user-id");
         userId.innerHTML = userId.innerHTML + currentUser;
         let profile = this._server.getProfile(currentUser);
         let userName = document.querySelector("#user-name");
         userName.innerHTML = userName.innerHTML + profile.name;
         document.querySelector("#signed-user").style.display = "initial";
      }
    }

   register() {
      let userId = document.querySelector("#idInput").value;
      let userName = document.querySelector("#nameInput").value;
      let userAge = document.querySelector("#ageInput").value;
      let invalidId = document.querySelector("#invalid-id");
      let answerAll = document.querySelector("#answer-all");

      if (userId.trim().length >0 && userName.trim().length > 0 && parseInt(userAge) > 0) {
         let users = this._server.getUsers();
         if (users.ids.indexOf(userId) > -1) {
             invalidId.style.display = "initial";
             answerAll.style.display = "none";
         } else {
             let profile = {id: userId,
                            name: userName,
                            age: userAge,
                            cases: []};
             this._server.setProfile(profile);
             invalidId.style.display = "none";
             answerAll.style.display = "none";
             document.querySelector("#signed-user").style.display = "initial";
             document.querySelector("#registration-form").style.display = "none";
             this._server.setCurrentUser(userId);
         }
      } else {
          invalidId.style.display = "none";
          answerAll.style.display = "initial";
      }
   }

   signIn() {
      var userId = document.querySelector("#idInput").value;

      if (this._server.getUsers().ids.indexOf(userId) > -1) {
          var profile = this._server.getProfile(userId);
          var userName = document.querySelector("#user-name");
          userName.innerHTML = userName.innerHTML + profile.name;
          document.querySelector("#request-id").style.display = "none";
          document.querySelector("#invalid-id").style.display = "none";
          document.querySelector("#signed-user").style.display = "initial";
          this._server.setCurrentUser(userId);
      } else
          document.querySelector("#invalid-id").style.display = "initial";
   }
   */

  /*
    * Start the tracking record of a case
    */
  startCase () {
    this._branchRoot = null
    if (!PlayerManager.isCapsule) {
      // <TODO> this._runningCase is provisory
      const runningCase =
            this._server.generateRunningCase(this._state.userid,
              Basic.service.currentCaseId)

      this._state.runningCase = runningCase
      MessageBus.i.defineRunningCase(runningCase)
      MessageBus.i.publish('case/start/' + runningCase.runningId,
                           {userId: this._state.userid,
                            caseId: Basic.service.currentCaseId}, true)
    }
  }

  resumeCase () {
    if (!PlayerManager.isCapsule) {
      // <TODO> this._runningCase is provisory
      MessageBus.i.publish('case/resume/' + this._state.runningCase,
                           {userId: this._state.userid,
                            caseId: this._state.currentCase}, true)

      MessageBus.i.defineRunningCase(this._state.runningCase)
    }
  }

  /*
    * Tracking player
    * ***************
    */

  trackTrigger (trigger) {
    this._server.trackRoute('#nav:' + trigger)
  }

  startTrackTyping (variable) {
    MessageBus.i.subscribe('/' + variable + '/typed', this.trackTyping)
  }

  trackTyping (topic, message) {
    console.log('track typing: ' + message.value)
  }

  // <TODO> provisory

  produceReport (topic, message) {
    const server = this._server

    const output = {
      currentUser: server.getCurrentUser(),
      runningCase: server.getRunningCasekey(),
      users: {}
    }

    const users = server.getUsers()
    for (const u in users.ids) {
      const profile = server.getProfile(users.ids[u])
      if (profile != null) {
        profile.caseTracks = {}
        for (const c in profile.cases) { profile.caseTracks[profile.cases[c]] = server.getCaseInstance(profile.cases[c]) }
      }
      output.users[users.ids[u]] = profile
    }

    MessageBus.i.publish('report', {
      caseobj: server.getPlayerObj(),
      result: output
    })
  }
}

(function () {
  PlayerManager.player = new PlayerManager()
})()

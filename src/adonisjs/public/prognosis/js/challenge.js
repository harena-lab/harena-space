class Challenge {
  constructor() {
    this._ready = false
    this._totalReady = 0
    this.preStart = this.preStart.bind(this)
    this.challengePacient = this.challengePacient.bind(this)
    this.getSapsCalc = this.getSapsCalc.bind(this)
    this._prognTarget = false
    MessageBus.int.subscribe('var/sapsCalc/set', this.getSapsCalc)
    MessageBus.int.subscribe('prognosis/current/pacient', this.challengePacient)

    MessageBus.int.subscribe('control/dhtml/ready', this.preStart)
    MessageBus.int.subscribe('control/html/ready', this.preStart)
    MessageBus.int.publish('control/dhtml/status/request')
  }
  async preStart () {
    const dhtmlList = document.querySelectorAll('dcc-dhtml')
    for (let i = 0; i < dhtmlList.length; i++) {
      if(dhtmlList[i]._ready == true){
        this._totalReady++
      }
      if(this._totalReady == dhtmlList.length){
        MessageBus.int.unsubscribe('control/dhtml/ready', this.preStart)
        MessageBus.int.unsubscribe('control/html/ready', this.preStart)
        this.start()
      }
    }
    if(dhtmlList.length == 0){
      MessageBus.int.unsubscribe('control/dhtml/ready', this.preStart)
      MessageBus.int.unsubscribe('control/html/ready', this.preStart)
      this.start()
    }
  }

 async start() {
   // $('#pacient-overview-modal').modal('show')
   if (new URL(document.location).pathname.includes('/prognosis/challenge')) {
     const btnRetryLvl = document.querySelector('#btn-retry')
     const fnRetrylvl = function(){
       document.querySelector('#player-survival-rate').value = 0
       document.querySelector('#player-survival-rate-txt').textContent = '0%'
       $('#lvl-result-modal').modal('hide')
     }
     btnRetryLvl.addEventListener('click', fnRetrylvl)
   }

   if (new URL(document.location).pathname.includes('/prognosis/challenge/1')) {
     const nextStep = document.querySelector('#btn-next-step')
     const fnNextStep = function (){
       if(this.form.checkValidity()){
         $('#pacient-overview-modal').modal('hide')
         $('#lvl-result-modal').modal('show')
         const playerGuess = document.querySelector('#player-survival-rate').value
         const prognSapsCalc = document.querySelector('#prognosis-survival-pacient')
         const prognAcc = document.querySelector('#prognosis-result-accuracy')
         const prognPlayerGuess = document.querySelector('#player-prognosis-guess')

         prognSapsCalc.textContent = `${Challenge.i._sapsCalc}%`
         prognAcc.textContent = Prognosis.i.calcPrognAcc(playerGuess, Challenge.i._sapsCalc, 10)
         prognPlayerGuess.textContent = `${playerGuess}%`
       }
     }
     nextStep.addEventListener('click', fnNextStep)

     const createPacientBtn =  document.querySelector('#btn-create-challenge-one')
     const fnCreatePacientBtn = function (){
       if(this.form.checkValidity())
       Saps.i.calcSaps3Score(this.form)
     }
     createPacientBtn.addEventListener('click', fnCreatePacientBtn)

     const nextLvl = document.querySelector('#btn-ch1-next-lvl')
     const fnNextLvl = function (){
       let challenge
       new URL(document.location).pathname.includes('/prognosis/challenge/1')?challenge = 'challenge1':challenge = 'challenge2'
       const currentLvl = localStorage.getItem(`${challenge}-current-lvl`)
       const heighestLvl = localStorage.getItem(`${challenge}-highest-lvl`)
       console.log(currentLvl)
       console.log(heighestLvl)
     }
     nextLvl.addEventListener('click', fnNextLvl)

   }

   if(new URL(document.location).pathname.includes('/prognosis/challenge/2')){
     const nextStep = document.querySelector('#btn-next-step')
     const fnNextStep = function (){
       if(this.form.checkValidity()){
         $('#pacient-overview-modal').modal('hide')
         $('#lvl-result-modal').modal('show')
         const prognResultAcc = document.querySelector('#prognosis-result-accuracy')
         const prognSurvivalPacient = document.querySelector('#prognosis-survival-pacient')
         const prognSurvivalRange = document.querySelector('#prognosis-range')
         const prognRange = Challenge.i._prognTarget.split('-')
         prognResultAcc.textContent = Prognosis.i.calcPrognRange(prognRange[0],prognRange[1],Challenge.i._sapsCalc)
         prognSurvivalPacient.textContent = `${Challenge.i._sapsCalc}%`
         prognSurvivalRange.textContent = `${Challenge.i._prognTarget}%`
       }
     }
     nextStep.addEventListener('click', fnNextStep)

     const nextLvl = document.querySelector('#btn-ch2-next-lvl')
     const fnNextLvl = function (){
       let challenge
       new URL(document.location).pathname.includes('/prognosis/challenge/1')?challenge = 'challenge1':challenge = 'challenge2'
       const currentLvl = localStorage.getItem(`${challenge}-current-lvl`)
       const heighestLvl = localStorage.getItem(`${challenge}-highest-lvl`)
       console.log(currentLvl)
       console.log(heighestLvl)
     }
     nextLvl.addEventListener('click', fnNextLvl)
   }
 }

 async getSapsCalc (topic, message) {
   Challenge.i._sapsCalc = message
 }

 async challengePacient(topic, message) {

   if (new URL(document.location).pathname.includes('challenge/2')) {
     Challenge.i._prognTarget = message['prognTarget']

     const survivalRateOutputTxt = document.querySelector('#player-survival-rate-txt')
     survivalRateOutputTxt.innerHTML = `${message['prognTarget']}%`
   }
 }

}
(function() {
 Challenge.i = new Challenge()
})()

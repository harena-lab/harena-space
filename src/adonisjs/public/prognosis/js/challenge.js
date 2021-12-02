class Challenge {
  constructor() {
    this._ready = false
    this._totalReady = 0
    this.preStart = this.preStart.bind(this)
    this.challengePacient = this.challengePacient.bind(this)
    this.getSapsCalc = this.getSapsCalc.bind(this)
    this._prognTarget = false
    MessageBus.i.subscribe('var/set/sapsCalc', this.getSapsCalc)
    MessageBus.i.subscribe('prognosis/current/pacient', this.challengePacient)

    MessageBus.i.subscribe('control/dhtml/ready', this.preStart)
    MessageBus.i.subscribe('control/html/ready', this.preStart)
    MessageBus.i.publish('control/dhtml/status/request')
  }
  async preStart () {
    const dhtmlList = document.querySelectorAll('dcc-dhtml')
    for (let i = 0; i < dhtmlList.length; i++) {
      if(dhtmlList[i]._ready == true){
        this._totalReady++
      }
      if(this._totalReady == dhtmlList.length){
        MessageBus.i.unsubscribe('control/dhtml/ready', this.preStart)
        MessageBus.i.unsubscribe('control/html/ready', this.preStart)
        this.start()
      }
    }
    if(dhtmlList.length == 0){
      MessageBus.i.unsubscribe('control/dhtml/ready', this.preStart)
      MessageBus.i.unsubscribe('control/html/ready', this.preStart)
      this.start()
    }
  }

 async start() {
   // $('#pacient-overview-modal').modal('show')
   if (new URL(document.location).pathname.includes('/prognosis/challenge')) {
     const btnRetryLvl = document.querySelector('#btn-retry')
     const fnRetrylvl = function(){
       if(document.querySelector('#player-survival-rate')){
         document.querySelector('#player-survival-rate').value = 0
         document.querySelector('#player-survival-rate-txt').textContent = '0%'
       }
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
         MessageBus.progn.publish('knot/navigate/>')
         const playerGuess = document.querySelector('#player-survival-rate').value
         const prognSapsCalc = document.querySelector('#prognosis-survival-pacient')
         const prognAcc = document.querySelector('#prognosis-result-accuracy')
         const prognPlayerGuess = document.querySelector('#player-prognosis-guess')

         prognSapsCalc.textContent = `${Challenge.i._sapsCalc}%`
         prognAcc.textContent = Prognosis.i.calcPrognAcc(playerGuess, Challenge.i._sapsCalc, 10)
         prognPlayerGuess.textContent = `${playerGuess}%`

         prognSapsCalc.dataset.value = Challenge.i._sapsCalc
         prognPlayerGuess.dataset.value = playerGuess

         let currentLvl = localStorage.getItem(`prognosis-challenge1-current-lvl`)
         let heighestLvl = localStorage.getItem(`prognosis-challenge1-highest-lvl`)
         localStorage.setItem(`prognosis-challenge1-highest-lvl`, parseInt(currentLvl)+1)
         document.querySelector('dcc-submit[bind="submit-prognosis-lvl-guess"][connect="submit:harena-user-property:service/request/post"]')._computeTrigger()
         document.querySelector('dcc-submit[bind="submit-prognosis-highest-lvl"][connect="submit:harena-user-property:service/request/put"]')._computeTrigger()
       }
     }
     nextStep.addEventListener('click', fnNextStep)

     // const createPacientBtn =  document.querySelector('#btn-create-challenge-one')
     // const fnCreatePacientBtn = function (){
     //   if(this.form.checkValidity())
     //   Saps.i.calcSaps3Score(this.form)
     // }
     // createPacientBtn.addEventListener('click', fnCreatePacientBtn)

     let btnNextLvl = document.querySelector('#btn-ch1-next-lvl')
     let challenge
     new URL(document.location).pathname.includes('/prognosis/challenge/1')?challenge = 'challenge1':challenge = 'challenge2'
     let currentLvl = localStorage.getItem(`prognosis-${challenge}-current-lvl`)
     let heighestLvl = localStorage.getItem(`prognosis-${challenge}-highest-lvl`)
     let nextLvl = parseInt(localStorage.getItem(`prognosis-${challenge}-current-lvl`))+1
     if(nextLvl>10)
     nextLvl = 10
     if(nextLvl<10){
     btnNextLvl.dataset.busEntity = 'case/navigate'
     btnNextLvl.dataset.busId = '/>'
     btnNextLvl.dataset.action = `/prognosis/challenge/${challenge.substring(9)}/?diffic=${nextLvl}`
   }else{
     btnNextLvl.dataset.busEntity = 'section/navigate'
     btnNextLvl.dataset.busId = '/prognosis/learn/progress/'
     btnNextLvl.dataset.action = '/prognosis/learn/progress/#ch1'
   }
     // const fnNextLvl = function (){
     //   let challenge
     //   new URL(document.location).pathname.includes('/prognosis/challenge/1')?challenge = 'challenge1':challenge = 'challenge2'
     //   const currentLvl = localStorage.getItem(`prognosis-${challenge}-current-lvl`)
     //   const heighestLvl = localStorage.getItem(`prognosis-${challenge}-highest-lvl`)
     //   let nextLvl = parseInt(localStorage.getItem(`prognosis-${challenge}-current-lvl`))+1
     //   if(nextLvl>10)
     //   nextLvl = 10
     //   if(nextLvl<10){
     //   this.dataset.busEntity = 'case/navigate'
     //   this.dataset.busId = '/>'
     //   this.dataset.action = `/prognosis/challenge/${challenge.substring(9)}/?diffic=${nextLvl}`
     // }else{
     //   this.dataset.busEntity = 'section/navigate'
     //   this.dataset.busId = '/prognosis/learn/progress/'
     //   this.dataset.action = '/prognosis/learn/progress/#ch1'
     //
     // }
     // let btn = this
     // setTimeout(function(){
     //   btn.click()
     // }, 100)
     // }
     // nextLvl.addEventListener('click', fnNextLvl)

     if(document.querySelector('#welcome-lvl-modal') && (localStorage.getItem('prognosis-challenge1-current-lvl') == 1
     || localStorage.getItem('prognosis-challenge1-current-lvl')==null) && (!localStorage.getItem('hide-intro-ch1-1'))){
       let welcomeModal = document.querySelector('#welcome-lvl-modal')
       welcomeModal.querySelector('.modal-title').textContent = 'Desafio 1'
       welcomeModal.querySelector('.modal-body > p').innerHTML = `Decidimos deixar as coisas mais interessantes e mudar sua
       rotina, nesse desafio você observará pacientes e precisará acertar a chance de sobrevivência. Bem fácil né?`

       $('#welcome-lvl-modal').modal('show')
       localStorage.setItem('hide-intro-ch1-1', true)
     }

   }

   if(new URL(document.location).pathname.includes('/prognosis/challenge/2')){
     const nextStep = document.querySelector('#btn-next-step')
     const fnNextStep = function (){
       if(this.form.checkValidity()){
         $('#pacient-overview-modal').modal('hide')
         $('#lvl-result-modal').modal('show')
         MessageBus.progn.publish('knot/navigate/>')
         const prognResultAcc = document.querySelector('#prognosis-result-accuracy')
         const prognSurvivalPacient = document.querySelector('#prognosis-survival-pacient')
         const prognSurvivalRange = document.querySelector('#prognosis-range')
         const prognRange = Challenge.i._prognTarget.split('-')
         prognResultAcc.textContent = Prognosis.i.calcPrognRange(prognRange[0],prognRange[1],Challenge.i._sapsCalc)
         prognSurvivalPacient.textContent = `${Challenge.i._sapsCalc}%`
         prognSurvivalPacient.dataset.value = Challenge.i._sapsCalc
         prognSurvivalRange.textContent = `${Challenge.i._prognTarget}%`
         prognSurvivalRange.dataset.value = Challenge.i._prognTarget

         let currentLvl = localStorage.getItem(`prognosis-challenge2-current-lvl`)
         let heighestLvl = localStorage.getItem(`prognosis-challenge2-highest-lvl`)
         localStorage.setItem(`prognosis-challenge2-highest-lvl`, parseInt(currentLvl)+1)
         document.querySelector('dcc-submit[bind="submit-prognosis-lvl-range"][connect="submit:harena-user-property:service/request/post"]')._computeTrigger()
         document.querySelector('dcc-submit[bind="submit-prognosis-lvl-progn"][connect="submit:harena-user-property:service/request/post"]')._computeTrigger()
         document.querySelector('dcc-submit[bind="submit-prognosis-highest-lvl"][connect="submit:harena-user-property:service/request/put"]')._computeTrigger()
       }
     }
     nextStep.addEventListener('click', fnNextStep)

     let btnNextLvl = document.querySelector('#btn-ch2-next-lvl')
     let challenge
     new URL(document.location).pathname.includes('/prognosis/challenge/1')?challenge = 'challenge1':challenge = 'challenge2'
     let currentLvl = localStorage.getItem(`prognosis-${challenge}-current-lvl`)
     let heighestLvl = localStorage.getItem(`prognosis-${challenge}-highest-lvl`)
     let nextLvl = parseInt(localStorage.getItem(`prognosis-${challenge}-current-lvl`))+1
     if(nextLvl>10)
      nextLvl = 10
     if(nextLvl<10){
       btnNextLvl.dataset.busEntity = 'case/navigate'
       btnNextLvl.dataset.busId = '/>'
       btnNextLvl.dataset.action = `/prognosis/challenge/${challenge.substring(9)}/?diffic=${nextLvl}`
     }else{
       btnNextLvl.dataset.busEntity = 'section/navigate'
       btnNextLvl.dataset.busId = '/prognosis/learn/progress/'
       btnNextLvl.dataset.action = '/prognosis/learn/progress/#ch2'
    }
     // const fnNextLvl = function (){
     //   console.log('============ check click btn')
     //   let challenge
     //   new URL(document.location).pathname.includes('/prognosis/challenge/1')?challenge = 'challenge1':challenge = 'challenge2'
     //   const currentLvl = localStorage.getItem(`prognosis-${challenge}-current-lvl`)
     //   const heighestLvl = localStorage.getItem(`prognosis-${challenge}-highest-lvl`)
     //   let nextLvl = parseInt(localStorage.getItem(`prognosis-${challenge}-current-lvl`))+1
     //   if(nextLvl>10)
     //   nextLvl = 10
     //   if(nextLvl<10){
     //     this.dataset.busEntity = 'case/navigate'
     //     this.dataset.busId = '/>'
     //     this.dataset.action = `/prognosis/challenge/${challenge.substring(9)}/?diffic=${nextLvl}`
     //   }else{
     //     this.dataset.busEntity = 'section/navigate'
     //     this.dataset.busId = '/prognosis/learn/progress/'
     //     this.dataset.action = '/prognosis/learn/progress/#ch2'
     //  }
     //  let btn = this
     //  setTimeout(function(){
     //    btn.click()
     //  }, 100)
     //
     // }
     // nextLvl.addEventListener('click', fnNextLvl)

     if(document.querySelector('#welcome-lvl-modal') && (localStorage.getItem('prognosis-challenge2-current-lvl') == 1
     || localStorage.getItem('prognosis-challenge2-current-lvl')==null) && (!localStorage.getItem('hide-intro-ch2-1'))){
       let welcomeModal = document.querySelector('#welcome-lvl-modal')
       welcomeModal.querySelector('.modal-title').textContent = 'Desafio 2'
       welcomeModal.querySelector('.modal-body > p').innerHTML = `Será que você consegue criar um paciente dentro do
       intervalo de sobrevivência desejado? Cada dificuldade diferente dirá o intervalo logo no começo da página e também no resumo do paciente.
       Por enquanto você terá toda liberdade de criação, mas não vá se acostumando.`

       $('#welcome-lvl-modal').modal('show')
       localStorage.setItem('hide-intro-ch2-1', true)
     }
   }
 }

 async getSapsCalc (topic, message) {
   Challenge.i._sapsCalc = message
 }

 async challengePacient(topic, message) {

   if (new URL(document.location).pathname.includes('challenge/2')) {
     Challenge.i._prognTarget = message['prognTarget']
     document.querySelector('#progn-target-range').value = message['prognTarget']
     const survivalRateOutputTxt = document.querySelector('#player-survival-rate-txt')
     const survivalRateObj = document.querySelector('#txt-objective')
     survivalRateOutputTxt.innerHTML = `${message['prognTarget']}%`
     survivalRateObj.textContent = `Intervalo de sobrevivência desejado: ${message['prognTarget']}%`
   }
 }

}
(function() {
 Challenge.i = new Challenge()
})()

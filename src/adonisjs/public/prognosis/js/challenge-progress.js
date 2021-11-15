class ChallengeProgress {

  constructor() {
    this._ready = false
    this._totalReady = 0
    this.preStart = this.preStart.bind(this)
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
      MessageBus.i.unsubscribe('control/html/ready', this.preStart)
      this.start()
    }
  }

  async start() {
    if(document.querySelector('#btn-challenge-1')){        var btnChallengeOne = document.querySelector('#btn-challenge-1')
    var btnChallengeTwo = document.querySelector('#btn-challenge-2')
    var txtTooltip = document.querySelector('#txt-tooltip')
    ChallengeProgress.i.tooltipChallenge(btnChallengeOne, btnChallengeTwo)

    const fnBtnChallenge = function (){
      if(this.id.includes('1')){
        txtTooltip.textContent = 'Para habilitar o Desafio 1 você precisa completar a dificuldade X de "Aprendendo Prognóstico".'
      }else{
        txtTooltip.textContent = 'Para habilitar o Desafio 2 você precisa completar a dificuldade Y de "Aprendendo Prognóstico".'
      }
      $('#modal-tooltip-general').modal('show')

    }
    if(btnChallengeOne.classList.contains('disabled')){
      btnChallengeOne.addEventListener('click', fnBtnChallenge)
      ChallengeProgress.i.tooltipChallenge(btnChallengeOne, 'Liberado após terminar dificuldade X em "Aprendendo Prognóstico"')
    }
    if(btnChallengeTwo.classList.contains('disabled')){
      btnChallengeTwo.addEventListener('click', fnBtnChallenge)
      ChallengeProgress.i.tooltipChallenge(btnChallengeTwo, 'Liberado após terminar dificuldade Y em "Aprendendo Prognóstico"')
    }
  }
  }

  tooltipChallenge(btn, txt){
      btn.setAttribute('data-toggle', 'tooltip')
      btn.setAttribute('data-placement', 'top')
      btn.setAttribute('title', txt)
  }
}
(function(){
  ChallengeProgress.i = new ChallengeProgress()
})()

class ChallengeProgress {

  constructor() {
    this._ready = false
    this._totalReady = 0
    this.preStart = this.preStart.bind(this)
    this.checkChallenge = this.checkChallenge.bind(this)
    this.enableChallengeBtn = this.enableChallengeBtn.bind(this)
    MessageBus.i.subscribe('control/dhtml/ready', this.preStart)
    MessageBus.i.subscribe('control/html/ready', this.preStart)
    MessageBus.i.subscribe('control/html/ready', this.enableChallengeBtn)
    MessageBus.i.subscribe('data/progn.info/ready', this.checkChallenge)
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
    if(document.querySelector('#btn-challenge-1')){
      let btnChallengeOne = document.querySelector('#btn-challenge-1')
      let btnChallengeTwo = document.querySelector('#btn-challenge-2')
      let txtTooltip = document.querySelector('#txt-tooltip')
      ChallengeProgress.i.tooltipChallenge(btnChallengeOne, btnChallengeTwo)

      const fnBtnChallenge = function (){
        if(this.classList.contains('disabled')){
          if(this.id.includes('1')){
            txtTooltip.textContent = 'Para habilitar o Desafio 1 você precisa completar a dificuldade X de "Aprendendo Prognóstico".'
          }else{
            txtTooltip.textContent = 'Para habilitar o Desafio 2 você precisa completar a dificuldade Y de "Aprendendo Prognóstico".'
          }
          $('#modal-tooltip-general').modal('show')
        }

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

  async checkChallenge() {
    MessageBus.i.unsubscribe('data/progn.info/ready', this.checkChallenge)
    const challengeOneUnlocked = parseInt(PrognosisProgress.i.user['prognosis-highest-lvl']) >= 4
    const challengeTwoUnlocked = await PrognosisProgress.i.getStars(PrognosisProgress.i.user) >= 21

    if(challengeOneUnlocked){
      sessionStorage.setItem('ch-one-unlocked', true)
    }else {
      sessionStorage.setItem('ch-one-unlocked', false)
    }
    if (challengeTwoUnlocked) {
      sessionStorage.setItem('ch-two-unlocked', true)
    }else {
      sessionStorage.setItem('ch-two-unlocked', false)
    }
    let latestChallenge
    let busEntity = 'case/navigate'
    let busId
    let busAction
    let alertDiv = document.createElement('div')

    if(challengeOneUnlocked) {
       latestChallenge = 'Desafio 1'
       busId = '/ch1/first'
       busAction = '/prognosis/challenge/1/?diffic=1'
    }
    if (challengeTwoUnlocked) {
      latestChallenge = 'Desafio 2'
      busId = '/ch2/first'
      busAction = '/prognosis/challenge/2/?diffic=1'
    }

    if (sessionStorage.getItem('ch-one-unlocked') == 'true' && !sessionStorage.getItem('ch-one-alert')) {
      alertDiv.classList.add('alert', 'alert-success', 'alert-dismissible', 'fade', 'show')
      alertDiv.setAttribute('role','alert')
      alertDiv.style.zIndex = '2000'
      alertDiv.innerHTML = `
      Você acabou de liberar o Desafio 1, <a href="#" class="alert-link">clique aqui</a> para navegar até lá.
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
      </button>`
      document.querySelector('#main-wrapper').insertBefore(alertDiv, document.querySelector('#main-wrapper').firstElementChild)
      let linkA = alertDiv.querySelector('a')
      linkA.dataset.busEntity = 'case/navigate'
      linkA.dataset.busId = '/ch1/first'
      linkA.dataset.action = '/prognosis/challenge/1/?diffic=1'
      sessionStorage.setItem('ch-one-alert', true)
    }
    if (sessionStorage.getItem('ch-two-unlocked') == 'true' && !sessionStorage.getItem('ch-two-alert')) {
      alertDiv.classList.add('alert', 'alert-success', 'alert-dismissible', 'fade', 'show')
      alertDiv.setAttribute('role','alert')
      alertDiv.style.zIndex = '2000'
      alertDiv.innerHTML = `
      Você acabou de liberar o Desafio 2, <a href="#" class="alert-link">clique aqui</a> para navegar até lá.
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
      </button>`
      document.querySelector('#main-wrapper').insertBefore(alertDiv, document.querySelector('#main-wrapper').firstElementChild)
      let linkA = alertDiv.querySelector('a')
      linkA.dataset.busEntity = 'case/navigate'
      linkA.dataset.busId = '/ch2/first'
      linkA.dataset.action = '/prognosis/challenge/2/?diffic=1'
      sessionStorage.setItem('ch-two-alert', true)
    }

  }
  async prognosisDropdown (childEl){
    const dropdownMenu = document.querySelector('#progn-dropdown-menu')
    let ch1 = document.createElement('a')
    let ch2 = document.createElement('a')

    ch1.classList.add('dropdown-item')
    ch1.href = '#'
    ch1.textContent = `Desafio 1`
    dropdownMenu.insertBefore(ch1, childEl.nextElementSibling)
    if (sessionStorage.getItem('ch-one-unlocked') != 'true') {
      let lock = `<i class="fas fa-lock"></i>`
      ch1.classList.add('disabled')
      ch1.innerHTML = `${ch1.textContent} ${lock}`
    }else{
      ch1.innerHTML = `${ch1.textContent} <i class="text-success">(Novo!)</i>`
      ch1.dataset.busEntity = 'case/navigate'
      ch1.dataset.busId = '/ch1/current'
      ch1.dataset.action = '/prognosis/challenge/1/'
    }
    ch2.classList.add('dropdown-item')
    ch2.textContent = `Desafio 2`
    dropdownMenu.insertBefore(ch2, ch1.nextElementSibling)
    if (sessionStorage.getItem('ch-two-unlocked') != 'true') {

      let lock = `<i class="fas fa-lock"></i>`
      ch2.classList.add('disabled')
      ch2.href = '#'
      ch2.innerHTML = `${ch2.textContent} ${lock}`
    }else{
      ch2.innerHTML = `${ch2.textContent} <i class="text-success">(Novo!)</i>`
      ch2.dataset.busEntity = 'case/navigate'
      ch2.dataset.busId = '/ch2/current'
      ch2.dataset.action = '/prognosis/challenge/2/'
    }

    if(new URL(document.location).pathname.includes('/prognosis/creation')){
        let child = dropdownMenu.querySelectorAll('a')
        for (let el of child) {
          el.href = el.dataset.action
        }
    }
  }

  async enableChallengeBtn() {
    MessageBus.i.unsubscribe('control/html/ready', this.enableChallengeBtn)
    const challengeOneUnlocked = sessionStorage.getItem('ch-one-unlocked')
    const challengeTwoUnlocked = sessionStorage.getItem('ch-two-unlocked')
    if(challengeOneUnlocked == 'true'){
      if(document.querySelector('#btn-challenge-1')){
        let btn = document.querySelector('#btn-challenge-1')
        let txt = btn.querySelector('i')

        btn.classList.remove('disabled')
        btn.setAttribute('data-toggle','')
        btn.setAttribute('title','')
        btn.addEventListener('click', function(){
          document.location.href = '/prognosis/challenge/1'
        })

        txt.classList.remove('fas','fa-lock')
        txt.classList.add('text-success')
        txt.textContent = '(Liberado!)'
      }
    }
    if (challengeTwoUnlocked == 'true') {
      if(document.querySelector('#btn-challenge-2')){
        let btn = document.querySelector('#btn-challenge-2')
        let txt = btn.querySelector('i')

        btn.classList.remove('disabled')
        btn.setAttribute('data-toggle','')
        btn.setAttribute('title','')
        btn.addEventListener('click', function(){
          document.location.href = '/prognosis/challenge/2'
        })

        txt.classList.remove('fas','fa-lock')
        txt.classList.add('text-success')
        txt.textContent = '(Liberado!)'
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
  ChallengeProgress.unlockCh = {
    'challengeOne':{
      'unlock': {
        'prognosis-highest-lvl': '5'
      }
    },
    'challengeTwo':{
      'unlock': {
        'starQuant': '21'
      }
    },
  }
})()

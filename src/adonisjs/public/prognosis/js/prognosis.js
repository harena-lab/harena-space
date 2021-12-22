class Prognosis {
  constructor() {
    this._ready = false
    this._totalReady = 0
    this.preStart = this.preStart.bind(this)
    MessageBus.i.subscribe('control/dhtml/ready', this.preStart)
    MessageBus.i.subscribe('control/html/ready', this.preStart)
    MessageBus.i.publish('control/dhtml/status/request')

    // this.addPacientVariableOption = this.addPacientVariableOption.bind(this)
    // this.deletePacientVariableOption = this.deletePacientVariableOption.bind(this)
    // MessageBus.i.subscribe('button/add-option/clicked', this.addPacientVariableOption)
    // MessageBus.i.subscribe('button/delete-option/clicked', this.deletePacientVariableOption)
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

  async start (){
    if(document.querySelectorAll('.progn-multi-wrapper') != null){
      Prognosis.i.expandMultiChoice()
    }
    if (new URL(document.location).pathname == '/prognosis/learn/player/') {
      Prognosis.i.getPacientOptions()
      // console.log('============')
      // console.log(document.querySelector('dcc-submit[connect="submit:harena-user-property:service/request/put"][bind="submit-prognosis-lvl"]'))
      document.querySelector('dcc-submit[connect="submit:harena-user-property:service/request/put"][bind="submit-prognosis-lvl"]')._computeTrigger()

      const nextStep =  document.querySelector('#btn-next-step')
      const fnNextStep = function (){
        if(this.form.checkValidity()){
          MessageBus.progn.publish('knot/navigate/>', {url: `/prognosis/learn/player/result?calc=${this.form.querySelector('#saps-survival').value}&playerCalc=${this.form.querySelector('#player-survival-rate').value}`})
          // window.location.href = `/prognosis/learn/player/result?calc=${this.form.querySelector('#saps-survival').value}&playerCalc=${this.form.querySelector('#player-survival-rate').value}`
        }
        // console.log(this.form.querySelector('#saps-survival').value)
        // console.log(this.form.querySelector('#player-survival-rate').value)
      }
      nextStep.addEventListener('click', fnNextStep)

      const createPacientBtn =  document.querySelector('#btn-create-pacient')
      const fnCreatePacientBtn = function (){
        if(this.form.checkValidity()){
          Saps.i.calcSaps3Score(this.form)
          if(MessageBus.progn)
            MessageBus.progn.publish('input/changed/overview/playerPrognGuess', document.querySelector('#player-survival-rate').value)
        }
      }
      createPacientBtn.addEventListener('click', fnCreatePacientBtn)

      const playerSurvivalRate = document.querySelector('#player-survival-rate')
      const survivalRateOutputTxt = document.querySelector('#player-survival-rate-txt')
      playerSurvivalRate.value = 0
      survivalRateOutputTxt.innerHTML = playerSurvivalRate.value+'%'
      playerSurvivalRate.addEventListener('input', function(){
        survivalRateOutputTxt.innerHTML = playerSurvivalRate.value+'%'
      })

    }
    if (new URL(document.location).pathname.includes('/prognosis/challenge')) {
      document.querySelector('dcc-submit[connect="submit:harena-user-property:service/request/put"][bind="submit-prognosis-lvl"]')._computeTrigger()
      if (new URL(document.location).pathname.includes('/prognosis/challenge/1/')){
        Prognosis.i.getPacientOptions('challengeOne')

        const nextStep =  document.querySelector('#btn-next-step')
        const fnNextStep = function (){
          if(this.form.checkValidity()){
            //Action button end level
          }
        }
        nextStep.addEventListener('click', fnNextStep)

        const createPacientBtn =  document.querySelector('#btn-create-challenge-one')
        const fnCreatePacientBtn = function (){
          if(this.form.checkValidity())
            Saps.i.calcSaps3Score(this.form)
        }
        createPacientBtn.addEventListener('click', fnCreatePacientBtn)

        const playerSurvivalRate = document.querySelector('#player-survival-rate')
        const survivalRateOutputTxt = document.querySelector('#player-survival-rate-txt')
        playerSurvivalRate.value = 0
        survivalRateOutputTxt.innerHTML = playerSurvivalRate.value+'%'
        playerSurvivalRate.addEventListener('input', function(){
          survivalRateOutputTxt.innerHTML = playerSurvivalRate.value+'%'
        })
      }else{
        Prognosis.i.getPacientOptions('challengeTwo')

        const nextStep =  document.querySelector('#btn-next-step')
        const fnNextStep = function (){
          if(this.form.checkValidity()){
            //Action button end level
          }
        }
        nextStep.addEventListener('click', fnNextStep)

        const createPacientBtn =  document.querySelector('#btn-create-challenge-two')
        const fnCreatePacientBtn = function (){
          if(this.form.checkValidity())
          Saps.i.calcSaps3Score(this.form)
        }
        createPacientBtn.addEventListener('click', fnCreatePacientBtn)
      }
    }
    if (new URL(document.location).pathname.includes('/prognosis/calculator')){
      Prognosis.i.getPacientOptions('calculator')
    }
    // if (new URL(document.location).pathname.includes('/prognosis/creation')){
    //   var btnAddOption = document.querySelectorAll('.btn-add-option')
    //   for (var btn of btnAddOption) {
    //     console.log('============')
    //     console.log(btn)
    //     btn.addEventListener('click', Prognosis.i.addPacientVariableOption)
    //   }
    //   document.querySelector('#btn-update-idade-option').addEventListener('click', Prognosis.i.updatePacientVariableOption)
    //   Prognosis.i.getPacientOptions(true)
    // }
    if (new URL(document.location).pathname.includes('/learn/player/result')){
      const retryLvl = document.querySelectorAll('.btn-retry')
      for (let btn of retryLvl) {
        btn.dataset.action = `/prognosis/learn/player/?diffic=${localStorage.getItem('prognosis-current-lvl')}`
      }

      // retryLvl.addEventListener('click', function(){
      //   window.location.href = `/prognosis/learn/player/?diffic=${localStorage.getItem('prognosis-current-lvl')}`
      // })
      for (var elem of document.querySelectorAll('input')) {
        elem.checked = false
      }
      Prognosis.i.playerResult()
    }
    if (new URL(document.location).pathname == '/prognosis/learn/') {

      const currentLvl = document.querySelector('#current-lvl')
      const btnProgress = document.querySelector('#btn-progress')
      const btnContinue = document.querySelector('#btn-continue')
      if(currentLvl.value != '' || (localStorage.getItem('prognosis-current-lvl')
      && localStorage.getItem('prognosis-current-lvl') > 0)){
        btnProgress.classList.remove('d-none')
        // btnContinue.setAttribute('onclick', 'location.href="/prognosis/learn/player"')
        btnContinue.dataset.busEntity = 'case/navigate'
        btnContinue.dataset.busId = '/continue'
        btnContinue.dataset.action = '/prognosis/learn/player/'
        btnContinue.textContent = 'Continuar'
      }
    }
    if(document.querySelector('#db-highest')){
      this.syncProgression()
    }
  }

  async syncProgression(){
    let dbHighest = document.querySelector('#db-highest')
    let dbCurrent = document.querySelector('#db-current')
    if (dbHighest.value != ''){
      localStorage.setItem('prognosis-highest-lvl', dbHighest.value)
      document.querySelector('dcc-submit[connect="submit:harena-user-property:service/request/post"]')._computeTrigger()
    }else {
      localStorage.removeItem('prognosis-highest-lvl')
      sessionStorage.removeItem('hide-intro-1')
      sessionStorage.removeItem('hide-intro-2')
      sessionStorage.removeItem('hide-intro-3')
      sessionStorage.removeItem('hide-intro-4')
      sessionStorage.removeItem('hide-intro-5')
      sessionStorage.removeItem('hide-intro-6')
      sessionStorage.removeItem('hide-intro-9')
      sessionStorage.removeItem('hide-intro-10')

    }
    if(dbCurrent && dbCurrent.value != ''){
      if (parseInt(localStorage.getItem('prognosis-current-lvl')) != parseInt(dbCurrent.value)) {
        localStorage.setItem('prognosis-current-lvl', dbCurrent.value)
      }
    }else {
      localStorage.removeItem('prognosis-current-lvl')
    }
  }

  async expandMultiChoice (){
    var multiValues = document.querySelectorAll('.progn-multi-wrapper')
    for (var e = 0; e < multiValues.length; e++) {
      if(multiValues[e].hasAttribute('class') && multiValues[e].classList.contains('progn-multi-wrapper')){
        var el = document.querySelector('#' + multiValues[e].id.substring(0,(multiValues[e].id.length - 8)))
        if(el == null){
          el = document.querySelectorAll('input[name="'+ multiValues[e].id.substring(0,(multiValues[e].id.length - 8)) +'"'+']')
        }

        const listenerFnMultiChoice = function () {
          var multiWrapper
          var _id
          if(this.getAttribute('type') == 'radio'){
            _id = this.name
          }else {
            _id = this.id
          }
          multiWrapper = document.querySelector('#' + _id + '-wrapper')
          if(this.checked && multiWrapper.classList.contains('d-none')) {
              if((this.getAttribute('type') == 'radio' && this.id.includes('sim')) || (this.getAttribute('type') != 'radio' || (this.getAttribute('type') == 'radio' && this.id.includes('nao') == false))){
                multiWrapper.classList.remove('d-none')
              }
          } else if(multiWrapper.classList.contains('d-none') == false){
            if ((this.checked && this.getAttribute('type') == 'radio' && this.id.includes('nao')) ||
            (!this.checked && (this.getAttribute('type') != 'radio' || (this.getAttribute('type') == 'radio'
            && this.id.includes('nao') == false)))) {
              multiWrapper.classList.add('d-none')
              var inputList = multiWrapper.querySelectorAll('div > input')
              var childListWrappers = multiWrapper.querySelectorAll(' .progn-multi-wrapper')

              for (var i = 0; i < inputList.length; i++) {
                inputList[i].checked = false
                inputList[i].required = false
                // var testWrapper = document.querySelector('#' + inputList[i].name + '-wrapper')
                // var test = testWrapper.querySelectorAll('div > input')
                // testWrapper.classList.add('d-none')
                // for (var k = 0; k < test.length; k++) {
                  // console.log(test[k].checked = false)
                // }
              }
              for (var e = 0; e < childListWrappers.length; e++) {
                childListWrappers[e].classList.add('d-none')
              }
            }

          }
            // console.log('============')
            // console.log(this)
        }

        function checkMultiChoice (){

          var multiWrapper
          var radioSiblingChecked = false

          if(el.length){
            for (var p = 0; p < el.length; p++) {

              multiWrapper = document.querySelector('#' + el[p].name + '-wrapper')
              if((el[p].checked && multiWrapper.classList.contains('d-none'))
              || (radioSiblingChecked && multiWrapper.classList.contains('d-none') == false)){
                radioSiblingChecked = true
                multiWrapper.classList.remove('d-none')
              } else {
                multiWrapper.classList.add('d-none')
                var inputList = multiWrapper.querySelectorAll('div > input')
                var childListWrappers = multiWrapper.querySelectorAll(' .progn-multi-wrapper')

                for (var i = 0; i < inputList.length; i++) {
                  inputList[i].checked = false
                }
                for (var e = 0; e < childListWrappers.length; e++) {
                  childListWrappers[e].classList.add('d-none')
                }
              }

            }
          }
          else {
            multiWrapper = document.querySelector('#' + el.id + '-wrapper')

            if(el.checked && multiWrapper.classList.contains('d-none')){
              multiWrapper.classList.remove('d-none')
            } else if(!el.checked && multiWrapper.classList.contains('d-none') == false){
              multiWrapper.classList.add('d-none')
              var inputList = multiWrapper.querySelectorAll('div > input')
              var childListWrappers = multiWrapper.querySelectorAll(' .progn-multi-wrapper')

              for (var i = 0; i < inputList.length; i++) {
                inputList[i].checked = false
              }
              for (var e = 0; e < childListWrappers.length; e++) {
                childListWrappers[e].classList.add('d-none')
              }
            }
          }
        }
        checkMultiChoice()

        if(el.length){
          for (var i = 0; i < el.length; i++) {
            el[i].removeEventListener('change', listenerFnMultiChoice)
            el[i].addEventListener('change', listenerFnMultiChoice)
          }
        }else{
          el.removeEventListener('change', listenerFnMultiChoice)
          el.addEventListener('change', listenerFnMultiChoice)
        }


      }
    }
  }

  async addPacientVariableOption (topic, message){
    console.log(topic)
    console.log(message)
    const optionWrapper = document.querySelector('#'+ this.id.substring(4) +'-wrapper')
    const inputValue = this.offsetParent.querySelector('input')
    this.message = this.getAttribute('message')
    if(!optionWrapper.querySelector('#'+this.message+'-'+inputValue.value)){
      var template = document.createElement('template')
      const html = `
      <div class="border rounded px-2 mb-2 bg-secondary d-inline-flex align-middle" id="[id]-[value]">
      <input class="form-control-plaintext" type="text" value="[value]" readonly style="width: [valueLength]ch !important;">
      <button id="btn-del-[id]-[value]" type="button" class="btn px-1 m-0"><i class="fas fa-minus-circle"></i></button>
      </div>
      `
      template.innerHTML = html
      .replace(/\[value\]/ig, inputValue.value)
      .replace(/\[id\]/ig, this.message)
      .replace(/\[valueLength\]/ig, inputValue.value.length)
      optionWrapper.appendChild(template.content.cloneNode(true))
      const delOptionBtn = document.querySelector('#btn-del-'+ this.message+'-'+inputValue.value)
      delOptionBtn.addEventListener('click', Prognosis.i.deletePacientVariableOption)
    }

  }

  async deletePacientVariableOption (topic, message){
    this.parentElement.remove()
  }

  async updatePacientVariableOption (topic, message){

    const modalOptions = this.form.querySelector("div[id$='wrapper']")
    const valueWrapper = document.querySelector('.pancient-info-values.'+this.value)
    valueWrapper.innerHTML = modalOptions.innerHTML
    const delButtons = valueWrapper.querySelectorAll('button')
    for (var btn of delButtons) {
      btn.remove()
    }
  }

  async pacientFormValidation(form){

    //Check if input has attribute 'required', also removes 'required' if input is hidden
    let dependantInput = document.querySelectorAll(`div.d-none.progn-multi-wrapper[id*="wrapper"] > div.form-check > input`)
    for (var elem of dependantInput) {
      elem.required = false
    }
    dependantInput = document.querySelectorAll(`div.progn-multi-wrapper:not(.d-none)[id*="wrapper"] > div.form-check > input`)
    for (var elem of dependantInput) {
      if(!elem.required)
        elem.required = true
    }

    /*
    const fnChildInputs = function (){
      var dependantInput = document.querySelectorAll(`div.d-none.progn-multi-wrapper[id*="wrapper"] > div.form-check > input`)

      for (var elem of dependantInput) {
        // console.log('============ i do not like it')
        // console.log(elem)
        elem.required = false
      }
      dependantInput = document.querySelectorAll(`div.progn-multi-wrapper:not(.d-none)[id*="wrapper"] > div.form-check > input`)
      for (var elem of dependantInput) {
        // console.log('============ i do not like itaaaa')
        // console.log(elem)
        if(!elem.required)
          elem.required = true
      }
    }
    for (var elem of document.querySelectorAll(`div.progn-multi-wrapper[id*="wrapper"] > div.form-check > input`)) {
      elem.removeEventListener('change', fnChildInputs)
      elem.addEventListener('change', fnChildInputs)
    }
    */
    const fnCheckboxRequired = function (){

      var checkboxGroup = this.parentElement.parentElement.querySelectorAll('div.form-check > input[type=checkbox]')
      var checkboxChecked = false
      for (var elem of checkboxGroup) {
        if (elem.checked == true)
           checkboxChecked = true
      }
      if(checkboxChecked){
        for (var elem of checkboxGroup) {
          if(!elem.checked && elem.required == true){
            elem.required = false
          }else if(elem.checked && elem.required == false){
            elem.required = true
          }
        }
      }
      if(!checkboxChecked){
        for (var elem of checkboxGroup) {
          if(!elem.checked && elem.required == false){
            elem.required = true
          }
        }
      }
    }
    var checkboxes = document.querySelectorAll(`div[id*="wrapper"] > div.form-check > input[type=checkbox]`)
    for (var elem of checkboxes) {
      elem.removeEventListener('change', fnCheckboxRequired)
      elem.addEventListener('change', fnCheckboxRequired)
    }

  }

  removeAccent (src){
    src = src.toLowerCase()
    src = src.replace(new RegExp('[ÁÀÂÃ]','ig'), 'a')
    src = src.replace(new RegExp('[ÉÈÊ]','ig'), 'e')
    src = src.replace(new RegExp('[ÍÌÎ]','ig'), 'i')
    src = src.replace(new RegExp('[ÓÒÔÕ]','ig'), 'o')
    src = src.replace(new RegExp('[ÚÙÛ]','ig'), 'u')
    src = src.replace(new RegExp('[Ç]','ig'), 'c')
    src = src.replace(new RegExp('[>]','ig'), 'maior')
    src = src.replace(new RegExp('[<]','ig'), 'menor')
    src = src.replace(new RegExp('[=]','ig'), 'igual')
    src = src.replace(new RegExp('[/\\|+_?;:.,*!@#$%&()¹²³°ªº]','ig'), '')
    src = src.replace(new RegExp('[ \t]','ig'), '-')
    return src
  }

  async getPacientOptions (mode){
    let pacientInfo
    let strLocalStorageCurrentLvl
    let strLocalStorageHighestLvl
    let strLocalStorageHideIntro
    switch (mode) {
      case 'calculator':
        pacientInfo = Prognosis.pacientGeneral
        break;
      case 'challengeOne':
        pacientInfo = Prognosis.challengeOneLvls
        strLocalStorageCurrentLvl = 'prognosis-challenge1-current-lvl'
        strLocalStorageHighestLvl = 'prognosis-challenge1-highest-lvl'
        break;
      case 'challengeTwo':
        pacientInfo = Prognosis.challengeTwoLvls
        strLocalStorageCurrentLvl = 'prognosis-challenge2-current-lvl'
        strLocalStorageHighestLvl = 'prognosis-challenge2-highest-lvl'
        break;
      default:
      pacientInfo = Prognosis.learningPrognosisLvls
      strLocalStorageCurrentLvl = 'prognosis-current-lvl'
      strLocalStorageHighestLvl = 'prognosis-highest-lvl'
    }

    let selectedPacient
    const urlDiffic = new URL(document.location).searchParams.get('diffic')
    const currentLvl = document.querySelector('#current-lvl')
    const highestLvl = document.querySelector('#highest-lvl')
    const localCurrentLvl = localStorage.getItem(strLocalStorageCurrentLvl)

    if(mode != 'calculator' && ((localCurrentLvl && localCurrentLvl != null && localCurrentLvl != '') || currentLvl.value)){
      if(currentLvl && currentLvl.value != ''){
        localStorage.setItem(strLocalStorageCurrentLvl, currentLvl.value)
        if(highestLvl && highestLvl.value != ''){
          localStorage.setItem(strLocalStorageHighestLvl, highestLvl.value)
        }
        if((urlDiffic) && (localStorage.getItem(strLocalStorageCurrentLvl) != urlDiffic)){
          if(highestLvl.value != '' && parseInt(highestLvl.value) >= urlDiffic){
            localStorage.setItem(strLocalStorageCurrentLvl, urlDiffic)
          }else if (currentLvl.value == ''){
            localStorage.setItem(strLocalStorageCurrentLvl, 1)
          }else if(highestLvl.value != ''){
            localStorage.setItem(strLocalStorageHighestLvl, highestLvl.value)
            localStorage.setItem(strLocalStorageCurrentLvl, highestLvl.value)
          }else{
            localStorage.setItem(strLocalStorageHighestLvl, localStorage.getItem(strLocalStorageCurrentLvl))
          }
        }
        if(localStorage.getItem(strLocalStorageHighestLvl) == null || localStorage.getItem(strLocalStorageHighestLvl) == ''){
          localStorage.setItem(strLocalStorageHighestLvl, localStorage.getItem(strLocalStorageCurrentLvl))
        }
      }

      if((highestLvl && highestLvl.value == '') && localStorage.getItem(strLocalStorageCurrentLvl) != null){
        localStorage.setItem(strLocalStorageHighestLvl, localStorage.getItem(strLocalStorageCurrentLvl))
      }
      else if ((highestLvl && highestLvl.value == '') && localStorage.getItem(strLocalStorageCurrentLvl) == null){
        localStorage.setItem(strLocalStorageHighestLvl, 1)
        localStorage.setItem(strLocalStorageCurrentLvl, 1)
      }
      selectedPacient = pacientInfo.pacients[localStorage.getItem(strLocalStorageCurrentLvl)-1]
    }else{
        selectedPacient = pacientInfo.pacients[0]
        if(!new URL(document.location).pathname.includes('calculator')){
          localStorage.setItem(strLocalStorageCurrentLvl, pacientInfo.pacients[0].dificuldade)
          localStorage.setItem(strLocalStorageHighestLvl, pacientInfo.pacients[0].dificuldade)
        }
    }
    if(MessageBus.progn)
      MessageBus.progn.publish('case/get/currentLvl', localStorage.getItem(strLocalStorageCurrentLvl))
    if (new URL(document.location).pathname.includes('learn/player')) {

      if(document.querySelector('#welcome-lvl-modal') && (localStorage.getItem(strLocalStorageCurrentLvl) == 1
      || localStorage.getItem(strLocalStorageCurrentLvl)==null) && (!sessionStorage.getItem('hide-intro-1'))){
        let welcomeModal = document.querySelector('#welcome-lvl-modal')
        welcomeModal.querySelector('.modal-title').textContent = 'Seu primeiro paciente!'
        welcomeModal.querySelector('.modal-body > p').innerHTML = `Hoje é seu primeiro dia no estágio.
        As moiras não acham que você está preparado para ser mandado direto para os leitos, então elas querem te testar.
        Qual o perfil do paciente que Aisa raramente cortaria o fio da vida?
        <br><br>Escolha as variáveis que aumentam a chance de sobrevivência do paciente à chegada na UTI.`

        $('#welcome-lvl-modal').modal('show')
        sessionStorage.setItem('hide-intro-1', true)
      }else if(document.querySelector('#welcome-lvl-modal') && (localStorage.getItem(strLocalStorageCurrentLvl) == 2)
      && (!sessionStorage.getItem('hide-intro-2'))){
        let welcomeModal = document.querySelector('#welcome-lvl-modal')
        welcomeModal.querySelector('.modal-title').textContent = 'Nem mesmo os deuses...'
        welcomeModal.querySelector('.modal-body > p').innerHTML = `Nessa etapa do seu treinamento, as moiras vão te mostrar que os deuses não escolhem tudo...
        Quem dirá você! Nas próximas fases, alguns parâmetros já estarão pré-definidos,
        demarcados com esse símbolo: <i class="fas fa-lock"></i>.
        <br><br> Com os demais, continue escolhendo opções que aumentem
        a chance de sobrevivência do seu paciente.`

        $('#welcome-lvl-modal').modal('show')
        sessionStorage.setItem('hide-intro-2', true)
      }
      else if(document.querySelector('#welcome-lvl-modal') && (localStorage.getItem(strLocalStorageCurrentLvl) == 3)
      && (!sessionStorage.getItem('hide-intro-3'))){
        let welcomeModal = document.querySelector('#welcome-lvl-modal')
        welcomeModal.querySelector('.modal-title').textContent = 'Pelo menos, saiba de onde é melhor ele vir...'
        welcomeModal.querySelector('.modal-body > p').innerHTML = `E aí, tá se ligando?
        Você já consegue identificar qual origem favorece seu paciente?
        <br><br>Mostre que você sabe de onde você quer que ele venha...
        Porque, na vida real, isolar variável não é tão fácil!`

        $('#welcome-lvl-modal').modal('show')
        sessionStorage.setItem('hide-intro-3', true)
      }
      else if(document.querySelector('#welcome-lvl-modal') && (localStorage.getItem(strLocalStorageCurrentLvl) == 4)
      && (!sessionStorage.getItem('hide-intro-4'))){
        let welcomeModal = document.querySelector('#welcome-lvl-modal')
        welcomeModal.querySelector('.modal-title').textContent = 'E precisava estar na UTI?'
        welcomeModal.querySelector('.modal-body > p').innerHTML = `Elas estão gostando do seu trabalho, viu?
        E perceberam que você estudou para o estágio! Agora que você caiu na graça das deusas, não perca o ritmo!
        <br><br>Se de onde vem conta, o que tinha antes também! Dentre as comorbidades, você se ligou qual tem menor impacto?
        Pacientes podem ter a mesma doença de base e serem admitidos em contextos clínicos diferentes...`

        $('#welcome-lvl-modal').modal('show')
        sessionStorage.setItem('hide-intro-4', true)
      }
      else if(document.querySelector('#welcome-lvl-modal') && (localStorage.getItem(strLocalStorageCurrentLvl) == 5)
      && (!sessionStorage.getItem('hide-intro-5'))){
        let welcomeModal = document.querySelector('#welcome-lvl-modal')
        welcomeModal.querySelector('.modal-title').textContent = 'Intuição vs Evidência'
        welcomeModal.querySelector('.modal-body > p').innerHTML = `Será que você valoriza as alterações certas? Aisa sim.
        Talvez quem mais chame atenção de um desatento não seja o mais grave, não é mesmo?
        <br><br>Mostre para as moiras que você está disposto a aprender!
        Seu nome é atenção e você sabe o que procurar no seu paciente!`

        $('#welcome-lvl-modal').modal('show')
        sessionStorage.setItem('hide-intro-5', true)
      }
      else if(document.querySelector('#welcome-lvl-modal') && (localStorage.getItem(strLocalStorageCurrentLvl) == 6)
      && (!sessionStorage.getItem('hide-intro-6'))){
        let welcomeModal = document.querySelector('#welcome-lvl-modal')
        welcomeModal.querySelector('.modal-title').textContent = 'Agora tá parecendo de verdade...'
        welcomeModal.querySelector('.modal-body > p').innerHTML = `Elas estão encantadas com você!
        Como pode um novato tão entusiasmado?<br><br>Siga avaliando a admissão do seu paciente. O que é melhor para ele?
        Será que você sempre olhou o sinal clínico certo? O exame mais importante?
        <br><br>Siga aprendendo, estagiário! Assim você vai longe!`

        $('#welcome-lvl-modal').modal('show')
        sessionStorage.setItem('hide-intro-6', true)
      }
      else if(document.querySelector('#welcome-lvl-modal') && (localStorage.getItem(strLocalStorageCurrentLvl) == 9)
      && (!sessionStorage.getItem('hide-intro-9'))){
        let welcomeModal = document.querySelector('#welcome-lvl-modal')
        welcomeModal.querySelector('.modal-title').textContent = 'Estamos chegando na reta final...'
        welcomeModal.querySelector('.modal-body > p').innerHTML = `E aí? Como você está se sentindo?
        Nem tudo que reluz é ouro, não é mesmo?<br><br>Se você está se embolando, não se preocupe!
        As moiras estão te treinando porque confiam em você!<br><br>Respira fundo e lembre que, se algo não tá claro,
        sempre dá pra voltar na fase – opa, na referência! – e pensar: o que gerou mais impacto?`

        $('#welcome-lvl-modal').modal('show')
        sessionStorage.setItem('hide-intro-9', true)
      }
      else if(document.querySelector('#welcome-lvl-modal') && (localStorage.getItem(strLocalStorageCurrentLvl) == 10)
      && (!sessionStorage.getItem('hide-intro-10'))){
        let welcomeModal = document.querySelector('#welcome-lvl-modal')
        welcomeModal.querySelector('.modal-title').textContent = 'Parabéns por ter chegado aqui!'
        welcomeModal.querySelector('.modal-body > p').innerHTML = `Olha, você superou todas as expectativas!
        O erro é necessário ao aprendizado! Você soube usá-lo a seu favor e seguirá mais atento e confiante.
        Veja até onde chegou!<br><br>Feche com chave de ouro! Ninguém nasce pronto, mas você mostrou que veio com sede de saber! É disso que se precisa!`

        $('#welcome-lvl-modal').modal('show')
        sessionStorage.setItem('hide-intro-10', true)
      }
    }
    if(new URL(document.location).pathname.includes('calculator') || new URL(document.location).pathname.includes('creation'))
      selectedPacient = pacientInfo.pacients[0]
    if(document.querySelector('.pacient-title')){
      let title = document.querySelector('.pacient-title')
      title.innerHTML = title.innerHTML
      .replace('dificuldade 1',`dificuldade ${selectedPacient.dificuldade}`)
    }
    MessageBus.i.publish('prognosis/current/pacient', selectedPacient, false)

    ////////////////////////////////////////////////////////////////////////////////////////////
    function objectfyPlayerOptions(fnVariable, fnWrapper, fnPrependTxt){
      const mainWrapper = document.querySelector('#'+fnWrapper)
      // console.log('============')
      // console.log(fnVariable)
      // console.log(selectedPacient)
      if(selectedPacient[fnVariable].locked) {
        for (var i = 0; i < selectedPacient[fnVariable].locked.length; i++) {
          var keyText = Object.keys(selectedPacient[fnVariable].locked[i])[0]
          var keyId = Prognosis.i.removeAccent(keyText).replace(new RegExp('[ ]','ig'), '-')
          var template = document.createElement('template')
          var html = Prognosis.playerOptionLocked
          template.innerHTML = html
          .replace(/\[prependText\]/ig, fnPrependTxt)
          .replace(/\[id\]/ig, keyId)
          mainWrapper.appendChild(template.content.cloneNode(true))
          var textSelect = document.querySelector('#options-'+keyId+'-wrapper')
          if(selectedPacient[fnVariable].locked[i][keyText]['values'].length == 1 &&
          (selectedPacient[fnVariable].locked[i][keyText]['values'][0] == "Sim" ||
          selectedPacient[fnVariable].locked[i][keyText]['values'][0] == "Não")){
            var template = document.createElement('template')
            // template.innerHTML = Prognosis.playerOptionInputDisabled
            // .replace(/\[value\]/ig, keyText)
            // .replace(/\[id\]/ig, keyId)
            // textSelect.appendChild(template.content.cloneNode(true))
            var obj = document.querySelector('#options-'+ keyId+'-wrapper')
            obj.prependTxt = obj.parentElement.querySelector('.input-group-prepend')
            obj.prependTxt.copy = document.createElement('label')
            obj.prependTxt.copy.classList.add('input-group-text')
            obj.prependTxt.copy.textContent = keyText
            obj.prependTxt.appendChild(obj.prependTxt.copy)
            for (var z = 0; z < selectedPacient[fnVariable].locked[i][keyText]['values'].length; z++) {
              var value = selectedPacient[fnVariable].locked[i][keyText]['values'][z]
              var template = document.createElement('template')
              template.innerHTML = Prognosis.playerOptionRadio
              .replace(/\[name\]/ig, keyId)
              .replace(/\[id\]/ig, (keyId+'-'+Prognosis.i.removeAccent(value)))
              .replace(/\[value\]/ig, (value))
              .replace(/\[valueText\]/ig, value)
              textSelect.appendChild(template.content.cloneNode(true))
              textSelect.querySelector('#'+(keyId+'-'+Prognosis.i.removeAccent(value))).checked = true
            }

          }else if (selectedPacient[fnVariable].locked[i][keyText]['cascade']
          && selectedPacient[fnVariable].locked[i][keyText]['cascade'] == 'true'){
            var template = document.createElement('template')
            var cascadeDiv = document.createElement('div')

            if(selectedPacient[fnVariable].locked[i][keyText]['radioYN']){
              template = document.createElement('template')
              // template.innerHTML = Prognosis.playerOptionInputDisabled
              // .replace(/\[value\]/ig, keyText)
              // .replace(/\[id\]/ig, '')
              // textSelect.appendChild(template.content.cloneNode(true))
              var obj = document.querySelector('#options-'+ keyId+'-wrapper')
              obj.prependTxt = obj.parentElement.querySelector('.input-group-prepend')
              obj.prependTxt.copy = document.createElement('label')
              obj.prependTxt.copy.classList.add('input-group-text')
              obj.prependTxt.copy.textContent = keyText
              obj.prependTxt.appendChild(obj.prependTxt.copy)
              template = document.createElement('template')
              if(selectedPacient[fnVariable].locked[i][keyText]['values']
              && selectedPacient[fnVariable].locked[i][keyText]['values'].length > 0){
                template = document.createElement('template')
                template.innerHTML = Prognosis.playerOptionRadio
                .replace(/\[id\]/ig, keyId+'-sim')
                .replace(/\[name\]/ig, keyId)
                .replace(/\[value\]/ig, 'Sim')
                .replace(/\[valueText\]/ig, 'Sim')
                textSelect.appendChild(template.content.cloneNode(true))
                textSelect.querySelector('#'+(keyId+'-sim')).checked = true
              }else{
                template.innerHTML = Prognosis.playerOptionRadio
                .replace(/\[id\]/ig, keyId+'-nao')
                .replace(/\[name\]/ig, keyId)
                .replace(/\[value\]/ig, 'Não')
                .replace(/\[valueText\]/ig, 'Não')
                textSelect.appendChild(template.content.cloneNode(true))
                textSelect.querySelector('#'+(keyId+'-nao')).checked = true
              }
            }else{
              template = document.createElement('template')
              template.innerHTML = Prognosis.playerOptionCheckbox
              .replace(/\[id\]/ig, keyId)
              .replace(/\[value\]/ig, keyText)
              .replace(/\[valueText\]/ig, keyText)
              textSelect.appendChild(template.content.cloneNode(true))
              textSelect.querySelector('#'+ keyId).checked = true
            }

            cascadeDiv.id = keyId + '-wrapper'
            if(selectedPacient[fnVariable].locked[i][keyText]['values'].length > 0){
              cascadeDiv.classList.add('border', 'rounded')
              // cascadeDiv.setAttribute('disabled','')
              cascadeDiv.style.backgroundColor = "#b5b5b5"
            }
            textSelect.appendChild(cascadeDiv)
            for (var z = 0; z < selectedPacient[fnVariable].locked[i][keyText]['values'].length; z++) {
              var valueText = selectedPacient[fnVariable].locked[i][keyText]['values'][z]
              var valueId = Prognosis.i.removeAccent(valueText).replace(new RegExp('[ ]','ig'), '-')
              if((selectedPacient[fnVariable].locked[i][keyText]['values'].length == 2
              || selectedPacient[fnVariable].locked[i][keyText]['uniqueValues'] &&
              selectedPacient[fnVariable].locked[i][keyText]['uniqueValues'] == 'true')
              && (!selectedPacient[fnVariable].locked[i][keyText]['multipleValues'] ||
              selectedPacient[fnVariable].locked[i][keyText]['multipleValues'] != 'true')){
                template = document.createElement('template')
                template.innerHTML = Prognosis.playerOptionRadio
                .replace(/\[id\]/ig, valueId)
                .replace(/\[name\]/ig, keyId+'-value')
                .replace(/\[value\]/ig, (valueText))
                .replace(/\[valueText\]/ig, valueText)
                textSelect.querySelector('#'+cascadeDiv.id).appendChild(template.content.cloneNode(true))
                textSelect.querySelector('#'+valueId).checked = true
              }else if (selectedPacient[fnVariable].locked[i][keyText]['multipleValues'] ||
              selectedPacient[fnVariable].locked[i][keyText]['multipleValues'] == 'true'){
                template = document.createElement('template')
                template.innerHTML = Prognosis.playerOptionCheckbox
                .replace(/\[id\]/ig, valueId)
                .replace(/\[value\]/ig, valueText)
                .replace(/\[valueText\]/ig, valueText)
                textSelect.querySelector('#'+(keyId)+'-wrapper').appendChild(template.content.cloneNode(true))
                textSelect.querySelector('#'+valueId).checked = true
              }else{
                template = document.createElement('template')
                template.innerHTML = Prognosis.playerOptionCheckbox
                .replace(/\[id\]/ig, valueId)
                .replace(/\[value\]/ig, valueText)
                .replace(/\[valueText\]/ig, valueText)
                textSelect.querySelector('#'+(keyId)+'-wrapper').appendChild(template.content.cloneNode(true))
                textSelect.querySelector('#'+valueId).checked = true
              }

            }
            if(selectedPacient[fnVariable].locked[i][keyText]['child']){
              var cascadeDivChild = document.createElement('div')
              cascadeDivChild.id = keyId+'-value'+ '-wrapper'
              cascadeDivChild.classList.add('border', 'rounded')
              // cascadeDiv.setAttribute('disabled','')
              cascadeDivChild.style.backgroundColor = "#cebfbf"
              cascadeDiv.appendChild(cascadeDivChild)
              for (var z = 0; z < selectedPacient[fnVariable].locked[i][keyText]['child'].length; z++) {
                var childText = selectedPacient[fnVariable].locked[i][keyText]['child'][z]
                var childId = Prognosis.i.removeAccent(childText).replace(new RegExp('[ ]','ig'), '-')
                if(selectedPacient[fnVariable].locked[i][keyText]['child'].length == 2){
                  template = document.createElement('template')
                  template.innerHTML = Prognosis.playerOptionRadio
                  .replace(/\[id\]/ig, childId)
                  .replace(/\[name\]/ig, childId+'-value')
                  .replace(/\[valueText\]/ig, childText)
                  textSelect.querySelector('#'+cascadeDivChild.id).appendChild(template.content.cloneNode(true))
                  textSelect.querySelector('#'+childId).checked = true
                }else{
                  template = document.createElement('template')
                  template.innerHTML = Prognosis.playerOptionCheckbox
                  .replace(/\[id\]/ig, childId)
                  .replace(/\[value\]/ig, childText)
                  .replace(/\[valueText\]/ig, childText)
                  textSelect.querySelector('#'+cascadeDivChild.id).appendChild(template.content.cloneNode(true))
                  textSelect.querySelector('#'+childId).checked = true
                }
              }
            }
          }
          else if(selectedPacient[fnVariable].locked[i][keyText]['uniqueValues'] &&
          selectedPacient[fnVariable].locked[i][keyText]['uniqueValues'] == 'true'){
            var template = document.createElement('template')
            // template.innerHTML = Prognosis.playerOptionInputDisabled
            // .replace(/\[value\]/ig, keyText)
            // .replace(/\[id\]/ig, keyId)
            // textSelect.appendChild(template.content.cloneNode(true))
            var obj = document.querySelector('#options-'+ keyId+'-wrapper')
            obj.prependTxt = obj.parentElement.querySelector('.input-group-prepend')
            obj.prependTxt.copy = document.createElement('label')
            obj.prependTxt.copy.classList.add('input-group-text')
            obj.prependTxt.copy.textContent = keyText
            obj.prependTxt.appendChild(obj.prependTxt.copy)
            //Hide input and add the value to prepend text
            // document.querySelector('#'+keyId).setAttribute('hidden','')
            // document.querySelector('#'+keyId).removeAttribute('disabled')
            // obj.parentElement.querySelector('.input-group-prepend')

            for (var z = 0; z < selectedPacient[fnVariable].locked[i][keyText]['values'].length; z++) {
              var value = selectedPacient[fnVariable].locked[i][keyText]['values'][z]
              var template = document.createElement('template')
              template.innerHTML = Prognosis.playerOptionRadio
              .replace(/\[name\]/ig, keyId)
              .replace(/\[id\]/ig, (keyId+'-'+Prognosis.i.removeAccent(value).replace(new RegExp('[ ]','ig'), '-')))
              .replace(/\[value\]/ig, (value))
              .replace(/\[valueText\]/ig, value)
              textSelect.appendChild(template.content.cloneNode(true))
              textSelect.querySelector('#'+(keyId+'-'+Prognosis.i.removeAccent(value).replace(new RegExp('[ ]','ig'), '-'))).checked = true
            }
          }
          else if (selectedPacient[fnVariable].locked[i][keyText]['selectList'] &&
          selectedPacient[fnVariable].locked[i][keyText]['selectList'] == 'true') {
            var template = document.createElement('template')
            template.innerHTML = Prognosis.playerSelectList
            .replace(/\[id\]/ig, (keyId))
            textSelect.appendChild(template.content.cloneNode(true))
            document.querySelector(`#${keyId}`).classList.add('disabled-look')
            var obj = document.querySelector('#options-'+ keyId+'-wrapper')
            obj.prependTxt = obj.parentElement.querySelector('.input-group-prepend')
            obj.prependTxt.copy = document.createElement('label')
            obj.prependTxt.copy.classList.add('input-group-text')
            obj.prependTxt.copy.textContent = keyText
            obj.prependTxt.appendChild(obj.prependTxt.copy)

            for (var z = 0; z < selectedPacient[fnVariable].locked[i][keyText]['values'].length; z++) {

              //Check if select list must include id (because of complex values. e.g.(id'bilirrubina' value'3-4'), instead of just 'bilirrubina')
              if(selectedPacient[fnVariable].locked[i][keyText]['values'][z]
              [Object.keys(selectedPacient[fnVariable].locked[i][keyText]['values'][z])]){
                var baseKey = selectedPacient[fnVariable].locked[i][keyText]['values'][z]
                var valueText = Object.keys(baseKey)[0]
                var value = baseKey[Object.keys(baseKey)]['values'][0]

                const selectList = document.querySelector("#" + keyId)
                var option = document.createElement('option')
                option.textContent = valueText+': '+value
                option.value = value
                selectList.appendChild(option)
                if (selectList.querySelector(`option[value=""]`)) {
                  selectList.querySelector(`option[value=""]`).remove()
                }
              }else{
                var value = selectedPacient[fnVariable].locked[i][keyText]['values'][z]
                const selectList = document.querySelector("#" + keyId)
                var option = document.createElement('option')
                option.textContent = value
                option.value = (Prognosis.i.removeAccent(value).replace(new RegExp('[ ]','ig'), '-'))
                selectList.appendChild(option)
                if (selectList.querySelector(`option[value=""]`)) {
                  selectList.querySelector(`option[value=""]`).remove()
                }
              }

            }
          }
          else{
            // document.querySelector('#options-'+keyId+'-wrapper').appendChild(template.content.cloneNode(true))
            var obj = document.querySelector('#options-'+ keyId+'-wrapper')
            obj.prependTxt = obj.parentElement.querySelector('.input-group-prepend')
            obj.prependTxt.copy = document.createElement('label')
            obj.prependTxt.copy.classList.add('input-group-text')
            obj.prependTxt.copy.textContent = keyText
            obj.prependTxt.appendChild(obj.prependTxt.copy)
            for (var k = 0; k < selectedPacient[fnVariable].locked[i][keyText]['values'].length; k++) {
              var valueText = selectedPacient[fnVariable].locked[i][keyText]['values'][k]
              var valueId = Prognosis.i.removeAccent(valueText).replace(new RegExp('[ ]','ig'), '-')
              var template = document.createElement('template')
              var html = Prognosis.playerOptionCheckbox

              template.innerHTML = html
              .replace(/\[valueText\]/ig, valueText)
              .replace(/\[value\]/ig, valueText)
              .replace(/\[id\]/ig, valueId)
              var optionsWrapper = mainWrapper.querySelector('#options-'+keyId+'-wrapper')
              optionsWrapper.appendChild(template.content.cloneNode(true))
              optionsWrapper.querySelector('#'+valueId).checked = true
            }
            if(selectedPacient[fnVariable].locked[i][keyText]['child']){
              var template = document.createElement('template')
              var html = Prognosis.playerOption

              // template.innerHTML = html
              // .replace(/\[prependText\]/ig, 'Motivo')
              // .replace(/\[id\]/ig, valueId)
              // mainWrapper.appendChild(template.content.cloneNode(true))
              // for (var j = 0; j < selectedPacient[fnVariable].locked[i][keyText]['child'].length; j++) {
              //   console.log('============ child values')
              //   console.log(selectedPacient[fnVariable].locked[i][keyText]['child'][j])

              // }
            }


          }

        }
      }
      if(selectedPacient[fnVariable].open){
        for (var i = 0; i < selectedPacient[fnVariable].open.length; i++) {
          var keyText = Object.keys(selectedPacient[fnVariable].open[i])[0]
          var keyId = Prognosis.i.removeAccent(keyText).replace(new RegExp('[ ]','ig'), '-')
          var template = document.createElement('template')
          var html = Prognosis.playerOption
          template.innerHTML = html
          .replace(/\[prependText\]/ig, fnPrependTxt)
          .replace(/\[id\]/ig, keyId)
          mainWrapper.appendChild(template.content.cloneNode(true))
          var textSelect = document.querySelector('#options-'+keyId+'-wrapper')
          if(selectedPacient[fnVariable].open[i][keyText]['values'].length == 2 &&
          (selectedPacient[fnVariable].open[i][keyText]['values'][0] == "Sim" ||
          selectedPacient[fnVariable].open[i][keyText]['values'][1] == "Sim")){
            var template = document.createElement('template')
            // template.innerHTML = Prognosis.playerOptionInputDisabled
            // .replace(/\[value\]/ig, keyText)
            // .replace(/\[id\]/ig, keyId)
            // textSelect.appendChild(template.content.cloneNode(true))
            var obj = document.querySelector('#options-'+ keyId+'-wrapper')
            obj.prependTxt = obj.parentElement.querySelector('.input-group-prepend')
            obj.prependTxt.copy = document.createElement('label')
            obj.prependTxt.copy.classList.add('input-group-text')
            obj.prependTxt.copy.textContent = keyText
            obj.prependTxt.appendChild(obj.prependTxt.copy)
            for (var z = 0; z < selectedPacient[fnVariable].open[i][keyText]['values'].length; z++) {
              var value = selectedPacient[fnVariable].open[i][keyText]['values'][z]
              var template = document.createElement('template')
              template.innerHTML = Prognosis.playerOptionRadio
              .replace(/\[name\]/ig, keyId)
              .replace(/\[id\]/ig, (keyId+'-'+Prognosis.i.removeAccent(value)))
              .replace(/\[value\]/ig, (value))
              .replace(/\[valueText\]/ig, value)
              textSelect.appendChild(template.content.cloneNode(true))
            }

          }else if (selectedPacient[fnVariable].open[i][keyText]['cascade'] &&
          selectedPacient[fnVariable].open[i][keyText]['cascade'] == 'true'){
            var template = document.createElement('template')
            var cascadeDiv = document.createElement('div')

            if(selectedPacient[fnVariable].open[i][keyText]['radioYN']){
              template = document.createElement('template')
              // template.innerHTML = Prognosis.playerOptionInputDisabled
              // .replace(/\[value\]/ig, keyText)
              // .replace(/\[id\]/ig, '')
              // textSelect.appendChild(template.content.cloneNode(true))
              var obj = document.querySelector('#options-'+ keyId+'-wrapper')
              obj.prependTxt = obj.parentElement.querySelector('.input-group-prepend')
              obj.prependTxt.copy = document.createElement('label')
              obj.prependTxt.copy.classList.add('input-group-text')
              obj.prependTxt.copy.textContent = keyText
              obj.prependTxt.appendChild(obj.prependTxt.copy)
              template = document.createElement('template')
              template.innerHTML = Prognosis.playerOptionRadio
              .replace(/\[id\]/ig, keyId+'-nao')
              .replace(/\[name\]/ig, keyId)
              .replace(/\[value\]/ig, 'Não')
              .replace(/\[valueText\]/ig, 'Não')
              textSelect.appendChild(template.content.cloneNode(true))

              template = document.createElement('template')
              template.innerHTML = Prognosis.playerOptionRadio
              .replace(/\[id\]/ig, keyId+'-sim')
              .replace(/\[name\]/ig, keyId)
              .replace(/\[value\]/ig, 'Sim')
              .replace(/\[valueText\]/ig, 'Sim')
              textSelect.appendChild(template.content.cloneNode(true))
            }else{
              template = document.createElement('template')
              template.innerHTML = Prognosis.playerOptionCheckbox
              .replace(/\[id\]/ig, keyId)
              .replace(/\[value\]/ig, keyText)
              .replace(/\[valueText\]/ig, keyText)
              textSelect.appendChild(template.content.cloneNode(true))
            }

            cascadeDiv.id = keyId + '-wrapper'
            cascadeDiv.classList.add('progn-multi-wrapper','d-none', 'border', 'rounded')
            // cascadeDiv.setAttribute('disabled','')
            cascadeDiv.style.backgroundColor = "#b5b5b5"
            textSelect.appendChild(cascadeDiv)
            for (var z = 0; z < selectedPacient[fnVariable].open[i][keyText]['values'].length; z++) {
              var valueText = selectedPacient[fnVariable].open[i][keyText]['values'][z]
              var valueId = Prognosis.i.removeAccent(valueText).replace(new RegExp('[ ]','ig'), '-')
              if((selectedPacient[fnVariable].open[i][keyText]['values'].length == 2
              || selectedPacient[fnVariable].open[i][keyText]['uniqueValues'] &&
              selectedPacient[fnVariable].open[i][keyText]['uniqueValues'] == 'true')
              && (!selectedPacient[fnVariable].open[i][keyText]['multipleValues'] ||
              selectedPacient[fnVariable].open[i][keyText]['multipleValues'] != 'true')){
                template = document.createElement('template')
                template.innerHTML = Prognosis.playerOptionRadio
                .replace(/\[id\]/ig, valueId)
                .replace(/\[name\]/ig, keyId+'-value')
                .replace(/\[value\]/ig, (valueText))
                .replace(/\[valueText\]/ig, valueText)
                document.querySelector('#'+cascadeDiv.id).appendChild(template.content.cloneNode(true))

              }else if (selectedPacient[fnVariable].open[i][keyText]['multipleValues'] ||
              selectedPacient[fnVariable].open[i][keyText]['multipleValues'] == 'true'){
                template = document.createElement('template')
                template.innerHTML = Prognosis.playerOptionCheckbox
                .replace(/\[id\]/ig, valueId)
                .replace(/\[value\]/ig, valueText)
                .replace(/\[valueText\]/ig, valueText)
                document.querySelector('#'+(keyId)+'-wrapper').appendChild(template.content.cloneNode(true))
              }else{
                template = document.createElement('template')
                template.innerHTML = Prognosis.playerOptionCheckbox
                .replace(/\[id\]/ig, valueId)
                .replace(/\[value\]/ig, valueText)
                .replace(/\[valueText\]/ig, valueText)
                document.querySelector('#'+(keyId)+'-wrapper').appendChild(template.content.cloneNode(true))
              }

            }
            if(selectedPacient[fnVariable].open[i][keyText]['child']){
              var cascadeDivChild = document.createElement('div')
              cascadeDivChild.id = keyId+'-value'+ '-wrapper'
              cascadeDivChild.classList.add('progn-multi-wrapper','d-none', 'border', 'rounded')
              // cascadeDiv.setAttribute('disabled','')
              cascadeDivChild.style.backgroundColor = "#cebfbf"
              cascadeDiv.appendChild(cascadeDivChild)
              for (var z = 0; z < selectedPacient[fnVariable].open[i][keyText]['child'].length; z++) {
                var childText = selectedPacient[fnVariable].open[i][keyText]['child'][z]
                var childId = Prognosis.i.removeAccent(childText).replace(new RegExp('[ ]','ig'), '-')
                if(selectedPacient[fnVariable].open[i][keyText]['child'].length == 2){
                  template = document.createElement('template')
                  template.innerHTML = Prognosis.playerOptionRadio
                  .replace(/\[id\]/ig, childId)
                  .replace(/\[name\]/ig, childId+'-value')
                  .replace(/\[valueText\]/ig, childText)
                  document.querySelector('#'+cascadeDivChild.id).appendChild(template.content.cloneNode(true))

                }else{
                  template = document.createElement('template')
                  template.innerHTML = Prognosis.playerOptionCheckbox
                  .replace(/\[id\]/ig, childId)
                  .replace(/\[value\]/ig, childText)
                  .replace(/\[valueText\]/ig, childText)
                  document.querySelector('#'+cascadeDivChild.id).appendChild(template.content.cloneNode(true))
                }
              }
            }
          }
          else if(selectedPacient[fnVariable].open[i][keyText]['uniqueValues'] &&
          selectedPacient[fnVariable].open[i][keyText]['uniqueValues'] == 'true'){
            var template = document.createElement('template')
            // template.innerHTML = Prognosis.playerOptionInputDisabled
            // .replace(/\[value\]/ig, keyText)
            // .replace(/\[id\]/ig, keyId)
            // textSelect.appendChild(template.content.cloneNode(true))
            var obj = document.querySelector('#options-'+ keyId+'-wrapper')
            obj.prependTxt = obj.parentElement.querySelector('.input-group-prepend')
            obj.prependTxt.copy = document.createElement('label')
            obj.prependTxt.copy.classList.add('input-group-text')
            obj.prependTxt.copy.textContent = keyText
            obj.prependTxt.appendChild(obj.prependTxt.copy)
            //Hide input and add the value to prepend text
            // document.querySelector('#'+keyId).setAttribute('hidden','')
            // document.querySelector('#'+keyId).removeAttribute('disabled')
            // obj.parentElement.querySelector('.input-group-prepend')

            for (var z = 0; z < selectedPacient[fnVariable].open[i][keyText]['values'].length; z++) {
              var value = selectedPacient[fnVariable].open[i][keyText]['values'][z]
              var template = document.createElement('template')
              template.innerHTML = Prognosis.playerOptionRadio
              .replace(/\[name\]/ig, keyId)
              .replace(/\[id\]/ig, (keyId+'-'+Prognosis.i.removeAccent(value).replace(new RegExp('[ ]','ig'), '-')))
              .replace(/\[value\]/ig, (value))
              .replace(/\[valueText\]/ig, value)
              textSelect.appendChild(template.content.cloneNode(true))
            }
          }
          else if (selectedPacient[fnVariable].open[i][keyText]['selectList'] &&
          selectedPacient[fnVariable].open[i][keyText]['selectList'] == 'true') {
            var template = document.createElement('template')
            template.innerHTML = Prognosis.playerSelectList
            .replace(/\[id\]/ig, (keyId))
            textSelect.appendChild(template.content.cloneNode(true))

            var obj = document.querySelector('#options-'+ keyId+'-wrapper')
            obj.prependTxt = obj.parentElement.querySelector('.input-group-prepend')
            obj.prependTxt.copy = document.createElement('label')
            obj.prependTxt.copy.classList.add('input-group-text')
            obj.prependTxt.copy.textContent = keyText
            obj.prependTxt.appendChild(obj.prependTxt.copy)

            for (var z = 0; z < selectedPacient[fnVariable].open[i][keyText]['values'].length; z++) {

              //Check if select list must include id (because of complex values. e.g.(id'bilirrubina' value'3-4'), instead of just 'bilirrubina')
              if(selectedPacient[fnVariable].open[i][keyText]['values'][z]
              [Object.keys(selectedPacient[fnVariable].open[i][keyText]['values'][z])]){
                var baseKey = selectedPacient[fnVariable].open[i][keyText]['values'][z]
                var valueText = Object.keys(baseKey)[0]
                var value = baseKey[Object.keys(baseKey)]['values'][0]

                const selectList = document.querySelector("#" + keyId)
                var option = document.createElement('option')
                option.textContent = valueText+': '+value
                option.value = value
                selectList.appendChild(option)
              }else{
                var value = selectedPacient[fnVariable].open[i][keyText]['values'][z]
                const selectList = document.querySelector("#" + keyId)
                var option = document.createElement('option')
                option.textContent = value
                option.value = (Prognosis.i.removeAccent(value).replace(new RegExp('[ ]','ig'), '-'))
                selectList.appendChild(option)
              }
            }
          }
          else if (selectedPacient[fnVariable].open[i][keyText]['groupedChoices'] &&
          selectedPacient[fnVariable].open[i][keyText]['groupedChoices'] == 'true') {
            var template = document.createElement('template')
            template.innerHTML = Prognosis.playerGroupedOption
            .replace(/\[id\]/ig, (keyId))
            .replace(/\[prependText\]/ig, (keyText))
            .replace(/\[name\]/ig, (keyId.substring(0,8)+'-activator'))
            textSelect.appendChild(template.content.cloneNode(true))

            var fnGroupActivator = function (){
              var groupValues = document.querySelectorAll(`[id^="options-"] > .input-group >
              [id^="grouped-"] > div > input`)
              for (var elem of groupValues) {
                var parentActivator = elem.parentElement.parentElement.id
                elem.checked = document.querySelector(`#${parentActivator.substring(8,(parentActivator.length - 8))}`).checked
              }
            }
            document.querySelector('#'+keyId).addEventListener('change', fnGroupActivator)

            for (var k = 0; k < selectedPacient[fnVariable].open[i][keyText]['values'].length; k++) {
              var baseKey = selectedPacient[fnVariable].open[i][keyText]['values'][k]
              var valueText = Object.keys(baseKey)[0]
              var valueId = Prognosis.i.removeAccent(valueText).replace(new RegExp('[ ]','ig'), '-')
              var value = baseKey[valueText]['values'][0]

              var template = document.createElement('template')
              template.innerHTML = Prognosis.playerOptionRadio
              .replace(/\[valueText\]/ig, valueText+`: ${value}`)
              .replace(/\[value\]/ig, value)
              .replace(/\[id\]/ig, valueId)
              .replace(/\[name\]/ig, valueId)

              var optionsWrapper = mainWrapper.querySelector('#grouped-'+keyId+'-wrapper')
              optionsWrapper.appendChild(template.content.cloneNode(true))
              document.querySelector('#'+valueId).removeAttribute('required')
            }

          }
          else{
              // document.querySelector('#options-'+keyId+'-wrapper').appendChild(template.content.cloneNode(true))
              var obj = document.querySelector('#options-'+ keyId+'-wrapper')
              obj.prependTxt = obj.parentElement.querySelector('.input-group-prepend')
              obj.prependTxt.copy = document.createElement('label')
              obj.prependTxt.copy.classList.add('input-group-text')
              obj.prependTxt.copy.textContent = keyText
              obj.prependTxt.appendChild(obj.prependTxt.copy)
              for (var k = 0; k < selectedPacient[fnVariable].open[i][keyText]['values'].length; k++) {
                var valueText = selectedPacient[fnVariable].open[i][keyText]['values'][k]
                var valueId = Prognosis.i.removeAccent(valueText).replace(new RegExp('[ ]','ig'), '-')
                var template = document.createElement('template')
                var html = Prognosis.playerOptionCheckbox

                template.innerHTML = html
                .replace(/\[valueText\]/ig, valueText)
                .replace(/\[value\]/ig, valueText)
                .replace(/\[id\]/ig, valueId)
                var optionsWrapper = mainWrapper.querySelector('#options-'+keyId+'-wrapper')
                optionsWrapper.appendChild(template.content.cloneNode(true))
              }
              if(selectedPacient[fnVariable].open[i][keyText]['child']){
                var template = document.createElement('template')
                var html = Prognosis.playerOption

                // template.innerHTML = html
                // .replace(/\[prependText\]/ig, 'Motivo')
                // .replace(/\[id\]/ig, valueId)
                // mainWrapper.appendChild(template.content.cloneNode(true))
                // for (var j = 0; j < selectedPacient[fnVariable].open[i][keyText]['child'].length; j++) {
                //   console.log('============ child values')
                //   console.log(selectedPacient[fnVariable].open[i][keyText]['child'][j])

                // }
              }


          }

        }
      }
    }
    ////////////////////////////////// IDADE ///////////////////////////////////////////////////
    objectfyPlayerOptions('Idade','idade-wrapper','Idade')
    ////////////////////////////////// ORIGEM ///////////////////////////////////////////////////
    objectfyPlayerOptions('Origem','origem-wrapper','Origem')
    ////////////////////////////////// COMORBIDADE ///////////////////////////////////////////////////
    objectfyPlayerOptions('Comorbidade','comorbidade-wrapper','Comorbidade')
    ////////////////////////////////// MOTIVO DA ADMMISSAO ///////////////////////////////////////////////////
    objectfyPlayerOptions('Contexto da admissão','motivo-admissao-wrapper','Motivo')
    ////////////////////////////////// STATUS CLINICO ///////////////////////////////////////////////////
    objectfyPlayerOptions('Status clínico','status-clinico-wrapper','Status')
    ////////////////////////////////// ALTERACOES LABORATORIAIS ///////////////////////////////////////////////////
    objectfyPlayerOptions('Alterações laboratoriais','alt-lab-wrapper','Alteração')

    Prognosis.i.expandMultiChoice()
    Prognosis.i.pacientFormValidation()
    if (!new URL(document.location).pathname.includes('calculator')) {
      Prognosis.i.extractPossibleOptions(selectedPacient)
    }
  }

  async extractPossibleOptions (selectedPacient){
    let scoreValues = Prognosis.sapsScoreValues,
        pacientOptions = {},
        lockedFindings = {},
        openFindings = {}
        Object.defineProperty(pacientOptions,'locked',{
          writable: true,
          enumerable: true,
          configurable: true
        })
        Object.defineProperty(pacientOptions,'open',{
          writable: true,
          enumerable: true,
          configurable: true
        })

    // console.log('============ extracting...')
    // console.log(selectedPacient)
    let mainKeys = Object.keys(selectedPacient)
    // console.log('============ keys')
    // console.log(mainKeys)

    const findValue = function (object){
      let findings = {}
      let findingsValues = []
      // console.log('============ find value object')
      // console.log(object)
      // console.log(Object.entries(object))
      for (let i = 0; i < Object.keys(object).length; i++) {
        // console.log('============ find for keys')
        // console.log(Object.keys(object)[i])
        // console.log(object[Object.keys(object)[i]])

      }
      for (let i = 0; i < Object.values(object).length; i++) {
        // console.log('============ find for values')
        // console.log(Object.values(object)[i])
        // console.log(Object.entries(object)[i])
        if(Object.values(object)[i]['values']){
          let valueKeys = Object.values(object)[i]['values']
          // console.log('============ looking for "values" keys')
          for (let p = 0; p < valueKeys.length; p++) {
            // console.log('============ value is:')
            // console.log(Object.entries(object)[i][0])
            // console.log(valueKeys[p])
            if(typeof valueKeys[p] == 'string')
              findingsValues.push(valueKeys[p])
            else {
              findingsValues.push(findValue(valueKeys[p]))
            }
          }
        }
        if(Object.values(object)[i]['child']){
          let childKeys = Object.values(object)[i]['child']
          // console.log('============ looking for "child" keys')
          for (let p = 0; p < childKeys.length; p++) {
            // console.log('============ value is:')
            // console.log(Object.entries(object)[i][0])
            // console.log(childKeys[p])
            findingsValues.push(childKeys[p])

          }
        }
        // console.log('================================ returning findings...')
        // console.log(findings)
        Object.defineProperty(findings,Object.entries(object)[i][0],{
          value: findingsValues,
          writable: true,
          enumerable: true,
          configurable: true,
        })
        // console.log('============ findings returned')
        // console.log(findings)
        return findings

      }
      /* for (let t = 0; t < Object.keys(object).length; t++) {
        let keyText = Object.keys(selectedPacient[fnVariable].locked[t])[0]
        console.log('============ locked option')

        if(typeof Object.values(selectedPacient[fnVariable].locked)[t] == 'object'){
          console.log('============ object typeof key')
          console.log(Object.keys(selectedPacient[fnVariable].locked)[t])
          console.log('============ object typeof value')
          console.log(Object.values(selectedPacient[fnVariable].locked)[t])

        }else{
          console.log(fnVariable)
          console.log(Object.values(selectedPacient[fnVariable].locked)[t])
        }
      }
      */
    }
    for (var i = 0; i < mainKeys.length; i++) {

      let fnVariable = Object.keys(selectedPacient)[i]
      // console.log('========================================================')
      // console.log(fnVariable)
      // console.log(selectedPacient[fnVariable])
      if(selectedPacient[fnVariable].locked) {
        if(Object.keys(selectedPacient[fnVariable].locked).length > 0){
          lockedFindings[fnVariable] = {}
        }
        for (let t = 0; t < selectedPacient[fnVariable].locked.length; t++) {
          let keyText = Object.keys(selectedPacient[fnVariable].locked[t])[0]
          // console.log('============ locked option')

          if(typeof Object.values(selectedPacient[fnVariable].locked)[t] == 'object'){
            let currentObj = selectedPacient[fnVariable].locked
            let keyObj = Object.keys(currentObj)[t]
            let valueObj = Object.values(currentObj)[t]
            // console.log('============ object typeof key')
            // console.log(keyObj)
            // console.log('============ object typeof value')
            // console.log(valueObj)
            // console.log(valueObj[Object.keys(valueObj)[0]]['values'].length)
            if(valueObj[Object.keys(valueObj)[0]]['radioYN']
            && (valueObj[Object.keys(valueObj)[0]]['values'] && valueObj[Object.keys(valueObj)[0]]['values'].length==0) ) {
              valueObj[Object.keys(valueObj)[0]]['values'].push('Não')
            }
            let finding = findValue(Object.values(selectedPacient[fnVariable].locked)[t])
            // console.log('============ object typeof findings')
            // console.log(finding)
            // console.log(finding[Object.keys(finding)])
            // console.log(lockedFindings)
            lockedFindings[fnVariable][Object.keys(finding)] = finding[Object.keys(finding)]

          }else{
            // console.log(fnVariable)
            // console.log(Object.values(selectedPacient[fnVariable].locked)[t])
            // console.log('============ Saps3 value')
            // console.log(scoreValues['pacient'][fnVariable]['values']
            // [Object.values(selectedPacient[fnVariable].locked)[t]])
            lockedFindings[fnVariable] = Object.values(selectedPacient[fnVariable].locked)[t]
          }
        }
        pacientOptions.locked = lockedFindings
      }
      if(selectedPacient[fnVariable].open){
        if(Object.keys(selectedPacient[fnVariable].open).length > 0){
          openFindings[fnVariable] = {}
        }
        for (let t = 0; t < selectedPacient[fnVariable].open.length; t++) {
          let keyText = Object.keys(selectedPacient[fnVariable].open[t])[0]
          // console.log('============ open option')

          if(typeof Object.values(selectedPacient[fnVariable].open)[t] == 'object'){
            let currentObj = selectedPacient[fnVariable].open
            let keyObj = Object.keys(currentObj)[t]
            let valueObj = Object.values(currentObj)[t]
            // console.log('============ object typeof key')
            // console.log(keyObj)
            // console.log('============ object typeof value')
            // console.log(valueObj)
            if(valueObj[Object.keys(valueObj)[0]]['radioYN']
            && (valueObj[Object.keys(valueObj)[0]]['values'] && !valueObj[Object.keys(valueObj)[0]]['values'].includes('Não')) ) {
              valueObj[Object.keys(valueObj)[0]]['values'].push('Não')
            }
            let finding = findValue(valueObj)
            if(valueObj[Object.keys(valueObj)[0]]['groupedChoices']){
              finding[Object.keys(finding)]['groupedChoices'] = true
            }
            // console.log('============recieved from findValue')
            // console.log(finding)
            // console.log('============ object typeof findings')
            // console.log(finding[Object.keys(finding)])
            // console.log(finding[Object.values(finding)])
            // console.log(finding[Object.entries(finding)])
            openFindings[fnVariable][Object.keys(finding)] = finding[Object.keys(finding)]
          }else{
            // console.log(fnVariable)
            // console.log(Object.values(selectedPacient[fnVariable].open)[t])
            // console.log('============ pacientInfo value')
            // console.log(scoreValues['pacient'][Object.values(selectedPacient[fnVariable].open)[t]])
            openFindings[fnVariable] = Object.values(selectedPacient[fnVariable].open)
          }
        }
        pacientOptions.open = openFindings
      }
    }

    if((pacientOptions.locked && Object.keys(pacientOptions.locked).length > 0)
    || (pacientOptions.open && Object.keys(pacientOptions.open).length > 0)){
      // console.log('===========================================================')
      // console.log('============ calculating best options...')
      // console.log(pacientOptions)
      // console.log('============ Locked Options')
      // console.log(Object.entries(pacientOptions.locked))
      // console.log('============ Open Options')
      // console.log(Object.entries(pacientOptions.open))
      let pacientScore = {}
      pacientScore['locked'] = {}
      pacientScore['open'] = {}
      for (let i = 0; i < Object.keys(pacientOptions.locked).length; i++) {
        let mainKey = Object.keys(pacientOptions.locked)[i]

        // console.log('============ key')
        // console.log(mainKey)
        let childKey = pacientOptions.locked[mainKey]
        // console.log(childKey)
        if(typeof childKey == 'object'){
          for (let x = 0; x < Object.keys(childKey).length; x++) {
            // console.log('============ child key')
            // console.log(Object.keys(childKey)[x])
            let childValues = pacientOptions.locked[mainKey][Object.keys(childKey)[x]]
            // console.log(childValues)
            // console.log('============ child values')
            for (var z = 0; z < childValues.length; z++) {
              // console.log(childValues[z])
              // console.log(scoreValues['pacient'][Object.keys(childKey)[x]]['values'][childValues[z]]['saps'])
              let lockedOptionSaps = scoreValues['pacient'][Object.keys(childKey)[x]]['values'][childValues[z]]['saps']
              if(pacientScore['locked'][Object.keys(childKey)[x]]>0)
                pacientScore['locked'][Object.keys(childKey)[x]] = pacientScore['locked'][Object.keys(childKey)[x]] + lockedOptionSaps
              else
                pacientScore['locked'][Object.keys(childKey)[x]] = lockedOptionSaps

            }

          }

        }else{
          // console.log('============ single value')
          // console.log(pacientOptions['locked'][mainKey])
          pacientScore['locked'][mainKey] = scoreValues['pacient'][childKey]
        }
        // console.log('============ pacient Score')
        // console.log(pacientScore)
        //
        // pacientScore["locked"]
        // pacientOptions.locked[Object.keys(pacientOptions.locked)[i]]
        // pacientInfo
      }
      // console.log('=========================== starting open')
      // console.log(pacientOptions.open)
      for (let i = 0; i < Object.keys(pacientOptions.open).length; i++) {
        let mainKey = Object.keys(pacientOptions.open)[i]
        // console.log('============ key')
        // console.log(mainKey)
        pacientScore['open'][mainKey] = {}

        let childKey = pacientOptions.open[mainKey]
        // console.log(childKey)
        if(typeof childKey == 'object'){
          for (let x = 0; x < Object.keys(childKey).length; x++) {

            // console.log('============ child key')
            // console.log(Object.keys(childKey)[x])
            let sapsKey = Object.keys(childKey)[x]
            let childValues = pacientOptions.open[mainKey][sapsKey]
            if(Array.isArray(childKey)){
              childValues = pacientOptions.open[mainKey]
              // console.log('============ child values')
              for (var z = 0; z < childValues.length; z++) {
                // console.log(childValues[z])
                // console.log(scoreValues['pacient'][childValues[z]])
                // console.log(pacientOptions.open[mainKey])
                pacientScore['open'][mainKey][childValues[z]] = scoreValues['pacient'][childValues[z]]
              }
            }else{
              pacientScore['open'][sapsKey] = {}
              pacientScore['open'][mainKey][sapsKey] = {}
              // console.log('============ child values not array')
              for (var z = 0; z < childValues.length; z++) {
                // console.log(childValues[z])
                if(scoreValues['pacient'][sapsKey]){
                  // console.log('============ new SAPS architecture')
                  // console.log(scoreValues['pacient'][sapsKey]['values'][childValues[z]]['saps'])
                  // console.log('============')
                  // console.log(typeof(scoreValues['pacient'][sapsKey][childValues[z]]))
                  pacientScore['open'][sapsKey][childValues[z]] = scoreValues['pacient'][sapsKey]['values'][childValues[z]]['saps']
                  // console.log(pacientScore)
                }else{

                  // console.log(scoreValues['pacient'][childValues[z]])
                  // console.log(typeof(scoreValues['pacient'][childValues[z]]))
                  if((typeof(scoreValues['pacient'][childValues[z]]) == 'object') && typeof childValues[z] == 'string'){
                    // console.log('============ evolving...')
                    // console.log(scoreValues['pacient'][childValues[z]]['values']['Sim']['saps'])
                    pacientScore['open'][sapsKey][childValues[z]] = scoreValues['pacient'][childValues[z]]['values']['Sim']['saps']
                    // console.log(pacientScore)
                  }else if((typeof childValues[z] == 'object')){
                    // console.log('============ everything is object yey')
                    let objKey = Object.keys(childValues[z])[0]
                    let objValue = childValues[z][objKey]['values'][0]
                    // console.log(objKey)
                    // console.log(objValue)
                    // console.log(scoreValues['pacient'][objKey][objValue])
                    if(scoreValues['pacient'][childValues[z]] == null){
                      // console.log('============ cmon legtsdo')
                      // console.log(pacientScore['open'][mainKey])
                      // console.log(Object.keys(childValues[z])[0])
                      // console.log(Object.values(childValues[z])[0][0])
                      // console.log(scoreValues['pacient'][objKey]['values'][Object.values(childValues[z])[0][0]]['saps'])
                      if(childValues['groupedChoices']){
                        pacientScore['open'][mainKey][sapsKey][objKey] = scoreValues['pacient'][objKey]['values'][Object.values(childValues[z])[0][0]]['saps']
                      }else{
                        pacientScore['open'][mainKey][objKey] = scoreValues['pacient'][objKey]['values'][Object.values(childValues[z])[0][0]]['saps']
                      }
                    }else {
                      pacientScore['open'][mainKey][sapsKey][objKey] = scoreValues['pacient'][objKey]['values'][objValue]['saps']
                    }
                    // console.log(pacientScore)
                  }else if (Object.keys(scoreValues['pacient']['Idade']['values']).includes(childValues[z])) {
                    // console.log('============ Its a hidden age')
                    // console.log(scoreValues['pacient']['Idade']['values'][childValues[z]]['saps'])
                    pacientScore['open'][sapsKey][childValues[z]] = scoreValues['pacient']['Idade']['values'][childValues[z]]['saps']
                  }else if(Object.keys(scoreValues['pacient']['Origem']['values']).includes(childValues[z])){
                    // console.log('============ Its a hidden Origem value')
                    // console.log(scoreValues['pacient']['Origem']['values'][childValues[z]]['saps'])
                    pacientScore['open'][sapsKey][childValues[z]] = scoreValues['pacient']['Origem']['values'][childValues[z]]['saps']
                  }else{
                    // console.log(scoreValues['pacient'][childValues[z]])

                    // pacientScore['open'][sapsKey][childValues[z]] = scoreValues['pacient'][childValues[z]]
                  }
                }
              }
            }
            if (pacientScore['open'][sapsKey]
            && (pacientScore['open'][sapsKey].length == undefined && Object.entries(pacientScore['open'][sapsKey]).length == 0)) {
              delete pacientScore['open'][sapsKey]
            }else if (pacientScore['open'][mainKey][sapsKey]
            && pacientScore['open'][mainKey][sapsKey].length == undefined) {
              delete pacientScore['open'][mainKey][sapsKey]
            }
            if(pacientScore['open'][mainKey][sapsKey] && Object.entries(pacientScore['open'][mainKey][sapsKey]).length == 0){
              delete pacientScore['open'][mainKey][sapsKey]
            }
          }
        }else{
          // console.log('============ single value')
          // console.log(pacientOptions['open'][mainKey])
          pacientScore['open'][mainKey] = scoreValues['pacient'][mainKey]['values'][childKey]
        }
        if(Object.entries(pacientScore['open'][mainKey]) == ''){
          delete pacientScore['open'][mainKey]
        }
      }
      this.bestPacientScore(pacientScore)
    }

  }

  bestPacientScore(pacient){
    // console.log('============ recieving pacient for best score check')
    // console.log(pacient)
    const checkOptions = function(object) {
      let possible = []
      for (let key of Object.values(object)) {
        if(typeof key == 'object'){
          let group = Object.values(key)
          let groupValue = 0
          for (let value of group) {
            if(typeof value == 'object' && value!=null){
              possible.push(checkOptions(groupValue))
            }else if(value!=null){
              // console.log('============ this is a group')
              // console.log(value)
              groupValue+=value
            }
          }
          possible.push(groupValue)
        }else if (key!=null){
          possible.push(key)
        }
      }

      if(possible.length>0){
        let bestOption
        for (let variable of possible) {
          if(variable < bestOption || bestOption == null){
            bestOption = variable
          }
        }
        // console.log('============ best option')
        // console.log(bestOption)
        return bestOption
      }
    }
    let lockedOptions = 0
    let openOptions = 0
    if (pacient.locked && Object.keys(pacient.locked).length > 0) {
      for (let i = 0; i < Object.keys(pacient.locked).length; i++) {
        lockedOptions += Object.values(pacient.locked)[i]
        // console.log(lockedOptions)
      }

    }
    if(pacient.open && Object.keys(pacient.open).length > 0){
      for (let i = 0; i < Object.keys(pacient.open).length; i++) {
        // console.log('============ before')
        // console.log(Object.values(pacient.open)[i])
        let object = Object.values(pacient.open)[i]
        // console.log('============open begins')
        openOptions += checkOptions(object)
        // console.log(openOptions)
      }
    }
    function round(value, precision) {
      let multiplier = Math.pow(10, precision || 0);
      return Math.round(value * multiplier) / multiplier;
    }
    // console.log('============')
    // console.log(openOptions)
    // console.log(lockedOptions)
    // console.log('============')
    // console.log(openOptions + lockedOptions + 16)
    let dynamicScore = openOptions + lockedOptions + 16
    let logitDynamic = -32.6659+Math.log(dynamicScore+20.5958)*7.3068
    let mortalityDynamic = Math.exp(logitDynamic)/ (1+ Math.exp(logitDynamic))
    let mortalityPercentage = (Math.round(mortalityDynamic*1000)/1000)*100

    document.querySelector('#pacient-perfect').value = round((100 - mortalityPercentage),1)

    // console.log('============ dynamic score '+dynamicScore)
    // console.log('============ mortalityPercentage '+mortalityPercentage)
    // console.log('============ '+round((100 - mortalityPercentage),1))



  }

  calcPrognAcc (playerCalc, sapsCalc, prognRange){
    const diffCalc = parseFloat(playerCalc)-parseFloat(sapsCalc)
    /////ON PROGRESS
    if(diffCalc > prognRange){
      // console.log('============ super estimado')
      return('Super estimado')

    }else if (diffCalc < -prognRange) {
      // console.log('============ sub estimado')
      return('Sub estimado')

    }else if (diffCalc <= prognRange && diffCalc >= -prognRange) {
      // console.log('============ na mosca')
      return('Na mosca! :)')

    }
  }

  calcPrognRange (min, max, sapsCalc) {

    if(sapsCalc > max){
      return('Super estimado')

    }else if (sapsCalc < min) {
      return('Sub estimado')

    }else if (sapsCalc <= max && sapsCalc >= min) {
      return('Na mosca! :)')

    }

  }

  calcPrognPerf (sapsCalc, perfectValue){
    if(parseInt(perfectValue) == parseInt(sapsCalc)){
      // console.log('============ paciente perfeito')

      return('Sim!')
    }else{
      // console.log('============ paciente imperfeito :(')
      // console.log(perfectValue)
      return('Não...')
    }
  }

  async playerResult(){
    const playerGuess = new URL(document.location).searchParams.get('playerCalc')
    const sapsCalc = new URL(document.location).searchParams.get('calc')
    const createRoulette = function (sectN){
      const diameter = 100
      const svgSize = diameter + 10
      const stroke = "black"
      const strokeWidth = "1"
      const svgRoot = document.querySelector('#svg-wrapper')
      const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svgEl.classList.add('spin','w-100','w-md-50','w-xl-40')
      svgEl.setAttribute('viewBox', '-55 -55 110 110')
      // svgEl.setAttribute('width','100%')
      // svgEl.setAttribute('height','100%')
      svgRoot.appendChild(svgEl)
      var gEl = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      gEl.id = 'roulette-group'
      svgEl.appendChild(gEl)
      var gPointEl = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      gPointEl.id = 'point-group'
      gEl.appendChild(gPointEl)
      var svgAnimate = `<animateTransform
           xlink:href="#roulette-group"
           attributeName="transform"
           attributeType="XML"
           type="rotate"
           from="0"
           to="200"
           begin=""
           dur="8s"
           fill="freeze"
           calcMode="spline"
           repeatCount="1"
           keyTimes="0;1"
           keySplines="0,.4,0,1"
           id="roulette-anim"
           />`
      var svgTriangle = `
      <polygon points="53 -2, 48 0, 53 2" fill="transparent" stroke="grey" strokeWidth="1" />`
      svgEl.insertAdjacentHTML('afterbegin',svgAnimate)
      svgEl.insertAdjacentHTML('beforeend',svgTriangle)
      var outerCircle = `
      <circle cx="0" cy="0" r="${diameter/2}" stroke="black" stroke-width="6" fill="transparent"></circle>`
      svgEl.insertAdjacentHTML('afterbegin',outerCircle)
      const getSectorPath = (x, y, outerDiameter, sectN) => {
        for (var i = 0; i < sectN; i++) {
          var anchorN = document.createElementNS('http://www.w3.org/2000/svg','a')
          anchorN.id = 'n-'+(i+1)
          anchorN.classList.add('roulette-number')
          anchorN.setAttribute('href','#')
          svgEl.querySelector('#roulette-group').insertBefore(anchorN, gPointEl)

          var a1 = (360/sectN)*i
          var a2 = 360/sectN + a1

          var degtorad = Math.PI / 180
          var cr = outerDiameter / 2
          var cx1 = Math.cos(degtorad * a2) * cr + x
          var cy1 = -Math.sin(degtorad * a2) * cr + y
          var cx2 = Math.cos(degtorad * a1) * cr + x
          var cy2 = -Math.sin(degtorad * a1) * cr + y
          var d = `M${x} ${y} ${cx1} ${cy1} A${cr} ${cr} 0 0 1 ${cx2} ${cy2}Z`
          var pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')
          pathEl.setAttribute('d',d)
          pathEl.setAttribute('stroke', stroke)
          pathEl.setAttribute('stroke-width',strokeWidth)
          pathEl.setAttribute('fill','white')
          anchorN.appendChild(pathEl)
          var txtX = (Math.cos(degtorad * (a1 + (360/sectN)/2)) * cr/2) + x
          var txtY = (-Math.sin(degtorad * (a1 + (360/sectN)/2)) * cr/2) + y
          var txtRoulette = document.createElementNS('http://www.w3.org/2000/svg', 'text')
          txtRoulette.setAttribute('x', txtX)
          txtRoulette.setAttribute('y', txtY)
          txtRoulette.innerHTML = i+1
          anchorN.appendChild(txtRoulette)

          /////Points in outer diameter/////

          var pointEl = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
          pointEl.setAttribute('cx',cx2)
          pointEl.setAttribute('cy',cy2)
          pointEl.setAttribute('r','1.5')
          pointEl.setAttribute('fill','green')
          gPointEl.appendChild(pointEl)
        }
      }
      getSectorPath(0, 0, diameter, sectN)
    }
    createRoulette(10)

    var numbers = document.querySelectorAll('.roulette-number')
    const availableN = Math.round(sapsCalc/10)
    //Selected numbers roulette array
    var selectedN = []
    if (numbers) {
      var fnSelectNum = function (){
        var pathChild = this.querySelector('path')
        if((pathChild.getAttribute('fill') == 'white') && (availableN > selectedN.length)){
          selectedN.push(parseInt(pathChild.nextElementSibling.innerHTML))
          pathChild.setAttribute('fill','#56c162')
          // this.style.backgroundColor = '#56c162'
        }
        else if(pathChild.getAttribute('fill') == '#56c162'){
          selectedN.pop(parseInt(pathChild.nextElementSibling.innerHTML))
          // pathChild.checked = false
          pathChild.setAttribute('fill','white')
          // this.style.backgroundColor = 'white'
        }
        if(availableN == selectedN.length){
          document.querySelector('#roulette-invalid').classList.add('d-none')
        }
      }
      for (var elem of numbers) {
        elem.addEventListener('click', fnSelectNum)
      }
    }
      var playerTxt = document.querySelector('#player-guess')
      var sapsText = document.querySelector('#saps-calc')
      playerTxt.innerHTML = Prognosis.playerGuessTxt
      .replace(/\[playerGuess\]/ig, playerGuess+'%')
      sapsText.innerHTML = Prognosis.sapsCalcTxt
      .replace(/\[sapsSurvival\]/ig, sapsCalc+'%')
      .replace(/\[rouletteN\]/ig, Math.round(sapsCalc/10))
      .replace(/\[plural\]/ig, ((Math.round(sapsCalc/10) > 1)?'s':''))
      const btnSpin = document.querySelectorAll('.btn-spin-roulette')
      const fnBtnSpin = function (){
        let _btnSpin = document.querySelectorAll('.btn-spin-roulette')
        const sapsCalc = new URL(document.location).searchParams.get('calc')
        if(availableN == selectedN.length){
          MessageBus.progn.publish('trigger/run/roulette/spinRoulette')
          if(this.id == 'btn-spin-roulette')
            this.disabled = true
          Prognosis.i.spinRoulette(selectedN)
          document.querySelector('#roulette-invalid').classList.add('d-none')
          for (let btn of _btnSpin) {
            if(!btn.innerHTML.includes('novamente'))
              btn.innerHTML += ' novamente'
          }
        }else{
          document.querySelector('#roulette-invalid').classList.remove('d-none')
        }
      }
      const rouletteAnim = document.querySelector('#roulette-anim')

      const fnModalEnd = function (){
        rouletteAnim.removeEventListener('endEvent', fnModalEnd)
        setTimeout(function(){
          $('#lvl-result-modal').modal('show')
        }, 750)
      }
      for (let btn of btnSpin) {
        btn.addEventListener('click', fnBtnSpin)
      }

      rouletteAnim.addEventListener('endEvent', fnModalEnd)

      const prognResultAcc = document.querySelector('#prognosis-result-accuracy')
      const prognPerfect = document.querySelector('#prognosis-perfect-cenario')
      if (prognResultAcc){
        const playerGuess = new URL(document.location).searchParams.get('playerCalc')
        const sapsCalc = new URL(document.location).searchParams.get('calc')
        prognResultAcc.textContent = this.calcPrognAcc(playerGuess, sapsCalc, 10)
      }
      if(prognPerfect){
        const perfectValue = document.querySelector('#prognosis-lvl-perfect')
        prognPerfect.textContent = this.calcPrognPerf(sapsCalc, perfectValue.value)
      }
  }

  async spinRoulette(selectedN){
    const rouletteSVG = document.querySelector('#roulette-group')
    const rouletteAnim = document.querySelector('#roulette-anim')
    const btnSpin = document.querySelectorAll('.btn-spin-roulette')
    var angleToNum
    var rouletteAngle
    rouletteSVG.parentElement.classList.add('no-pointer')

    function getRandomInt(min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      MessageBus.progn.publish('compute/random/roulette/angle', (Math.floor(Math.random() * (max - min)) + min))
      return Math.floor(Math.random() * (max - min)) + min
    }
    const fnEndSpin = function(){
      const btnNextLvl = document.querySelectorAll('.btn-next-lvl')
      const btnRetry = document.querySelectorAll('.btn-retry')

      for (let btn of btnRetry) {
        btn.classList.remove('d-none')
      }
      for (let btn of btnNextLvl) {
        btn.classList.remove('d-none')
        if(parseInt(localStorage.getItem('prognosis-current-lvl')) == 10){
          btn.innerHTML = 'Voltar para lista'
        }
        let nextLvl = parseInt(localStorage.getItem('prognosis-current-lvl'))+1
        // if(nextLvl>10)
        //   nextLvl = 10
        if(nextLvl<=10){
          btn.dataset.busEntity = 'case/navigate'
          btn.dataset.busId = '/>'
          btn.dataset.action = `/prognosis/learn/player/?diffic=${nextLvl}`
        }else{
          btn.dataset.busEntity = 'section/navigate'
          btn.dataset.busId = '/prognosis/learn/progress/'
          btn.dataset.action = '/prognosis/learn/progress/'
        }
        // const fnBtnNextLvl = function (){
        //
        // }
        // btn.addEventListener('click', fnBtnNextLvl)
      }

      for (let btn of btnSpin) {
        btn.disabled = false
      }


      rouletteAngle = rouletteSVG.transform.animVal[0].angle
      var newFrom = rouletteAnim.getAttribute('to').split(' ')[0]
      var newTo = (parseInt(rouletteAnim.getAttribute('to').split(' ')[0])+90)

      rouletteAnim.setAttribute('from', newFrom)

      if ((rouletteAngle!= null) && (rouletteAngle/36 < 10)) {
        angleToNum = Math.ceil(rouletteAngle/36)
      }else{
        if(rouletteAngle-360 > 360){
          angleToNum = rouletteAngle - (360 * Math.floor(rouletteAngle/360))
          angleToNum = Math.ceil(angleToNum/36)
        }else{
          angleToNum = Math.ceil(angleToNum/36)
        }
      }

      // console.log((selectedN.includes(angleToNum)?'Paciente sobreviveu':'Paciente não sobreviveu'))
      // console.log(angleToNum)
      // console.log(selectedN)
      if(!document.querySelector('#roulette-result')){
        var resultTxt = document.createElement('h5')
        resultTxt.classList.add('text-dark')
        resultTxt.id = 'roulette-result'
      }else {
        var resultTxt = document.querySelector('#roulette-result')
      }
      var wrapper = document.querySelector('#main-panel').firstElementChild
      if(selectedN.includes(angleToNum)){
        resultTxt.innerHTML = 'Paciente sobreviveu :)'
        //#015b13
        var selectedEl = document.querySelector('#n-'+angleToNum)
        selectedEl.querySelector('path').setAttribute('fill','#015b13')
        if(!document.querySelector('#roulette-result'))
          wrapper.insertBefore(resultTxt, document.querySelector('#svg-wrapper').nextSibling)
      }
      else{
        resultTxt.innerHTML = 'Paciente não sobreviveu :('
        //#f05858
        //#9f0202
        var selectedEl = document.querySelector('#n-'+angleToNum)
        selectedEl.querySelector('path').setAttribute('fill','#9f0202')
        if(!document.querySelector('#roulette-result'))
          wrapper.insertBefore(resultTxt, document.querySelector('#svg-wrapper').nextSibling)
        MessageBus.progn.publish('compute/random/roulette/spinNumber', angleToNum)
        MessageBus.progn.publish('var/set/roulette/spinNumber', angleToNum)
        MessageBus.progn.publish('input/changed/roulette/rouletteNSelected', selectedN)
        MessageBus.progn.publish('var/set/roulette/rouletteNSelected', selectedN)
      }
    }
    for (let btn of btnSpin) {
      if(!btn.dataset.roulette == false){
        rouletteAnim.addEventListener('endEvent', fnEndSpin)
        btn.dataset.roulette = true
      }
    }
    var randomRotate = getRandomInt(2000, 2880)
    // console.log(randomRotate)
    rouletteAnim.setAttribute('to', parseInt(rouletteAnim.getAttribute('from'))+randomRotate)
    rouletteAnim.beginElement()

  }

}
(function () {
  Prognosis.i = new Prognosis()

  Prognosis.pacientGeneral = {
    "pacients":[
      {

        "Idade":{
          "locked": [

          ],
          "open": [
            {
              "Idade":{
                "selectList":"true",
                "values":[
                  "<40 anos",//0
                  "40-59 anos",//5
                  "60-69 anos",//9
                  "70-74 anos",//13
                  "75-79 anos",//15
                  ">=80 anos",//18
                ]
              }
            }
          ]
        },
        "Origem":{
          "locked": [],
          "open": [
            {
              "Origem":{
                "selectList":"true",
                "values":[
                  "Pronto Socorro",//5
                  "Outra UTI",//7
                  "Outro local do hospital",//8
                ]
              }
            }
          ],
        },
        "Comorbidade":{
          "locked": [

          ],
          "open": [
            {
              "IC NYHA IV": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },//6
            },
            {
              "Câncer metastático": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },//11
            },
            {
              "Terapia oncológica": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },//3
            },
            {
              "Câncer hematológico": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },//6 IF HAS SIDA + CANCER  it gets double points
            },
            {
              "Cirrose": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },//8
            },
            {
              "SIDA": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },//8   IF HEMATOLOGICA + SIDA = 16+12
            },
            {
              "Internado antes da admissão": {
                "cascade": "true",
                "radioYN": "true",
                "uniqueValues":"true",
                "values": [
                  "<14 dias",//0
                  "14-27 dias",//6
                  ">=28 dias",//7
                ],
              },
            },
            {
              "Infectado antes da admissão": {
                "cascade": "true",
                "radioYN": "true",
                "multipleValues": "true",
                "values": [
                  "Nosocomial",//4
                  "Respiratória",//5
                ],
              },
            },
          ],
        },
        "Contexto da admissão": {
          "locked": [],
          "open": [
            {
              "Admissão planejada": {
                "values":[
                  "Não",//3
                  "Sim",//0
                ]
              },
            },
            {
              "Submetido à cirurgia": {// no surgery = 5 //surgery = 16
                "cascade": "true",
                "radioYN": "true",
                "values": [
                  "Cirurgia eletiva",//0
                  "Cirurgia urgência",//6
                ],
                "child": [
                  "Neurocirurgia por acidente vascular cerebral",//5
                  "Revascularização miocárdica",//-6
                  "Trauma",//-8
                  "Transplante",//-11
                  "Outro",//0
                ],
              },
            },
            {
              "Motivo de admissão na UTI": {//16
                "values": [
                  "Arritmia",//-5 Out of arritmia and convulsão, choose the worst value if both apply
                  "Choque hipovolêmico",//3
                  "Outro choque",//5
                  "Convulsão",//-4
                  "Abdome agudo",//3
                  "Pancreatite grave",//9
                  "Déficit focal",//7
                  "Efeito de massa intracraniana",//10
                  "Insuficiência hepática", //6
                  "Alteração do nível de consciência",//4
                  "Nenhum dos anteriores",//0
                ],
              },
            },
          ]
        },
        "Status clínico": {
          "locked": [],
          "open": [
            {
              "Escala de Coma de Glasgow": {
                "uniqueValues":"true",
                "values": [
                  "3-4",//15
                  "5",//10
                  "6",//7
                  "7-12",//2
                  ">=13",//0
                ],
              },
            },
            {
              "Temperatura": {
                "uniqueValues":"true",
                "values": [
                  "<35 °C",//7
                  ">=35 °C",//0
                ],
              },
            },
            {
              "Frequência cardíaca": {
                "uniqueValues":"true",
                "values": [
                  "<120 bpm",//0
                  "120-159 bpm",//5
                  ">=160 bpm",//7
                ],
              },
            },
            {
              "Pressão sistólica": {
                "uniqueValues":"true",
                "values": [
                  "<40 mmHg",//11
                  "40-69 mmHg",//8
                  "70-119 mmHg",//3
                  ">=120 mmHg",//0
                ],
              },
            },
            {
              "Droga vasoativa": {
                "uniqueValues":"true",
                "values": [
                  "Não",
                  "Sim",//3
                ]
              },
            },
          ],
        },
        "Alterações laboratoriais": {
          "locked": [],
          "open": [
            {
              "Bilirrubina": {
                "uniqueValues":"true",
                "values": [
                  "<2 mg/dl",//0
                  "2-6 mg/dl",//4
                  ">=6 mg/dl",//5
                ],
              },
            },
            {
              "Creatinina": {
                "uniqueValues":"true",
                "values": [
                  "<1.2 mg/dl",//0
                  "1.2-1.9 mg/dl",//2
                  "2-3.4 mg/dl",//7
                  ">=3.5 mg/dl",//8
                ],
              },
            },
            {
              "pH": {
                "uniqueValues":"true",
                "values": [
                  "<=7.25",//3
                  ">7.25"//0
                ],
              },
            },
            {
              "Leucócitos": {
                "uniqueValues":"true",
                "values": [
                  "<15mil /mm³",//0
                  ">=15mil /mm³",//2
                ],
              },
            },
            {
              "Plaquetas": {
                "uniqueValues":"true",
                "values": [
                  "<20mil /mm³",//13
                  "20-49mil /mm³",//8
                  "50-99mil /mm³",//5
                  ">=100mil /mm³",//0
                ],
              },
            },
            {
              "Oxigenação": {
                "uniqueValues":"true",
                "values": [
                  "paO2 >=60 sem VM",//0
                  "paO2 <60 sem VM",//5
                  "paO2/FiO2 >=100 em VM",//7
                  "paO2/FiO2 <100 em VM",//11
                ],
              },
            },
          ],
        },
      }
    ]
}

  Prognosis.learningPrognosisLvls = {
    "pacients":[
      {
        "dificuldade": "1",
        "Idade":{
          "locked": [

          ],
          "open": [
            {
              "Idade":{
                "selectList":"true",
                "values":[
                  "<40 anos",
                  "40-59 anos",
                  "60-69 anos",
                  "70-74 anos",
                  "75-79 anos",
                  ">=80 anos",
                ]
              }
            }

          ]
        },
        "Origem":{
          "locked": [],
          "open": [
            {
              "Origem":{
                "selectList":"true",
                "values":[
                  "Pronto Socorro",
                  "Outra UTI",
                  "Outro local do hospital",
                ]
              },
            }
          ],
        },
        "Comorbidade":{
          "locked": [

          ],
          "open": [
            {
              "IC NYHA IV": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },
            },
            {
              "Câncer metastático": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },
            },
            {
              "Terapia oncológica": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },
            },
            {
              "Câncer hematológico": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },
            },
            {
              "Cirrose": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },
            },
            {
              "SIDA": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },
            },
            {
              "Internado antes da admissão": {
                "cascade": "true",
                "radioYN": "true",
                "uniqueValues":"true",
                "values": [
                  "<14 dias",
                  "14-27 dias",
                  ">=28 dias",
                ],
              },
            },
            {
              "Infectado antes da admissão": {
                "cascade": "true",
                "radioYN": "true",
                "multipleValues": "true",
                "values": [
                  "Nosocomial",
                  "Respiratória",
                ],
              },
            },
          ],
        },
        "Contexto da admissão": {
          "locked": [],
          "open": [
            {
              "Admissão planejada": {
                "values":[
                  "Não",
                  "Sim",
                ]
              },
            },
            {
              "Submetido à cirurgia": {
                "cascade": "true",
                "radioYN": "true",
                "uniqueValues": "true",
                "values": [
                  "Cirurgia eletiva",
                  "Cirurgia urgência",
                ],
                "child": [
                  "Neurocirurgia por acidente vascular cerebral",
                  "Revascularização miocárdica",
                  "Trauma",
                  "Transplante",
                  "Outro",
                ],
              },
            },
            {
              "Motivo de admissão na UTI": {
                "values": [
                  "Arritmia",
                  "Choque hipovolêmico",
                  "Outro choque",
                  "Convulsão",
                  "Abdome agudo",
                  "Pancreatite grave",
                  "Déficit focal",
                  "Efeito de massa intracraniana",
                  "Insuficiência hepática",
                  "Alteração do nível de consciência",
                  "Nenhum dos anteriores",
                ],
              },
            },
          ]
        },
        "Status clínico": {
          "locked": [],
          "open": [
            {
              "Escala de Coma de Glasgow": {
                "uniqueValues":"true",
                "values": [
                  "3-4",
                  "5",
                  "6",
                  "7-12",
                  ">=13",
                ],
              },
            },
            {
              "Temperatura": {
                "uniqueValues":"true",
                "values": [
                  "<35 °C",
                  ">=35 °C",
                ],
              },
            },
            {
              "Frequência cardíaca": {
                "uniqueValues":"true",
                "values": [
                  "<120 bpm",
                  "120-159 bpm",
                  ">=160 bpm",
                ],
              },
            },
            {
              "Pressão sistólica": {
                "uniqueValues":"true",
                "values": [
                  "<40 mmHg",
                  "40-69 mmHg",
                  "70-119 mmHg",
                  ">=120 mmHg",
                ],
              },
            },
            {
              "Droga vasoativa": {
                "uniqueValues":"true",
                "values": [
                  "Não",
                  "Sim",
                ]
              },
            },
          ],
        },
        "Alterações laboratoriais": {
          "locked": [],
          "open": [
            {
              "Bilirrubina": {
                "uniqueValues":"true",
                "values": [
                  "<2 mg/dl",
                  "2-6 mg/dl",
                  ">=6 mg/dl",
                ],
              },
            },
            {
              "Creatinina": {
                "uniqueValues":"true",
                "values": [
                  "<1.2 mg/dl",
                  "1.2-1.9 mg/dl",
                  "2-3.4 mg/dl",
                  ">=3.5 mg/dl",
                ],
              },
            },
            {
              "pH": {
                "uniqueValues":"true",
                "values": [
                  "<=7.25",
                  ">7.25"
                ],
              },
            },
            {
              "Leucócitos": {
                "uniqueValues":"true",
                "values": [
                  "<15mil /mm³",
                  ">=15mil /mm³",
                ],
              },
            },
            {
              "Plaquetas": {
                "uniqueValues":"true",
                "values": [
                  "<20mil /mm³",
                  "20-49mil /mm³",
                  "50-99mil /mm³",
                  ">=100mil /mm³",
                ],
              },
            },
            {
              "Oxigenação": {
                "uniqueValues":"true",
                "values": [
                  "paO2 >=60 sem VM",
                  "paO2 <60 sem VM",
                  "paO2/FiO2 <100 em VM",
                  "paO2/FiO2 >=100 em VM",
                ],
              },
            },
          ],
        },
      },
      {
        "dificuldade": "2",
        "Idade":{
          "locked": [
            {
              "Idade":{
                "selectList":"true",
                "values":[
                  "<40 anos"
                ]
              }
            }
          ],
          "open": []
        },
        "Origem":{
          "locked": [],
          "open": [
            {
              "Origem":{
                "selectList": "true",
                "values":[
                  "Pronto Socorro",
                  "Outra UTI",
                  "Outro local do hospital",
                ]
              }
            }
          ],
        },
        "Comorbidade":{
          "locked": [

          ],
          "open": [
            {
              "IC NYHA IV": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },
            },
            {
              "Câncer metastático": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },
            },
            {
              "Terapia oncológica": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },
            },
            {
              "Câncer hematológico": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },
            },
            {
              "Cirrose": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },
            },
            {
              "SIDA": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },
            },
            {
              "Internado antes da admissão": {
                "cascade": "true",
                "radioYN": "true",
                "uniqueValues":"true",
                "values": [
                  "<14 dias",
                  "14-27 dias",
                  ">=28 dias",
                ],
              },
            },
            {
              "Infectado antes da admissão": {
                "cascade": "true",
                "radioYN": "true",
                "multipleValues": "true",
                "values": [
                  "Nosocomial",
                  "Respiratória",
                ],
              },
            },
          ],
        },
        "Contexto da admissão": {
          "locked": [
            {
              "Admissão planejada": {
                "values":[
                  "Sim",
                ]
              },
            },
            {
              "Submetido à cirurgia": {
                "cascade": "true",
                "radioYN": "true",
                "values": [
                  "Cirurgia eletiva",
                ],
                "child": [
                  "Transplante",
                ],
              },
            },
            {
              "Motivo de admissão na UTI": {
                "values": [
                  "Nenhum dos anteriores",
                ],
              },
            },
          ],
          "open": [

          ]
        },
        "Status clínico": {
          "locked": [],
          "open": [
            {
              "Escala de Coma de Glasgow": {
                "uniqueValues":"true",
                "values": [
                  "3-4",
                  "5",
                  "6",
                  "7-12",
                  ">=13",
                ],
              },
            },
            {
              "Temperatura": {
                "uniqueValues":"true",
                "values": [
                  "<35 °C",
                  ">=35 °C",
                ],
              },
            },
            {
              "Frequência cardíaca": {
                "uniqueValues":"true",
                "values": [
                  "<120 bpm",
                  "120-159 bpm",
                  ">=160 bpm",
                ],
              },
            },
            {
              "Pressão sistólica": {
                "uniqueValues":"true",
                "values": [
                  "<40 mmHg",
                  "40-69 mmHg",
                  "70-119 mmHg",
                  ">=120 mmHg",
                ],
              },
            },
            {
              "Droga vasoativa": {
                "uniqueValues":"true",
                "values": [
                  "Não",
                  "Sim",
                ]
              },
            },
          ],
        },
        "Alterações laboratoriais": {
          "locked": [],
          "open": [
            {
              "Bilirrubina": {
                "uniqueValues":"true",
                "values": [
                  "<2 mg/dl",
                  "2-6 mg/dl",
                  ">=6 mg/dl",
                ],
              },
            },
            {
              "Creatinina": {
                "uniqueValues":"true",
                "values": [
                  "<1.2 mg/dl",
                  "1.2-1.9 mg/dl",
                  "2-3.4 mg/dl",
                  ">=3.5 mg/dl",
                ],
              },
            },
            {
              "pH": {
                "uniqueValues":"true",
                "values": [
                  "<=7.25",
                  ">7.25"
                ],
              },
            },
            {
              "Leucócitos": {
                "uniqueValues":"true",
                "values": [
                  "<15mil /mm³",
                  ">=15mil /mm³",
                ],
              },
            },
            {
              "Plaquetas": {
                "uniqueValues":"true",
                "values": [
                  "<20mil /mm³",
                  "20-49mil /mm³",
                  "50-99mil /mm³",
                  ">=100mil /mm³",
                ],
              },
            },
            {
              "Oxigenação": {
                "uniqueValues":"true",
                "values": [
                  "paO2 >=60 sem VM",
                  "paO2 <60 sem VM",
                  "paO2/FiO2 <100 em VM",
                  "paO2/FiO2 >=100 em VM",
                ],
              },
            },
          ],
        },
      },
      {
        "dificuldade": "3",
        "Idade": {
          "open": [],
          "locked": [
            {
              "Idade": {
                "selectList": "true",
                "values": [
                  "<40 anos"
                ]
              }
            }
          ]
        },
        "Origem": {
          "open": [
            {
              "Origem": {
                "selectList": "true",
                "values": [
                  "Pronto Socorro",
                  "Outra UTI",
                  "Outro local do hospital"
                ]
              }
            }
          ],
          "locked": []
        },
        "Comorbidade": {
          "open": [
            {
              "Portador de": {
                "selectList": "true",
                "values": [
                  "IC NYHA IV",
                  "Câncer metastático",
                  "Terapia oncológica",
                  "Câncer hematológico",
                  "Cirrose",
                  "SIDA"
                ]
              }
            }
          ],
          "locked": [
            {
              "Internado antes da admissão": {
                "uniqueValues": "true",
                "values": [
                  "Não"
                ]
              }
            },
            {
              "Infectado antes da admissão": {
                "uniqueValues": "true",
                "values": [
                  "Não"
                ]
              }
            }
          ]
        },
        "Contexto da admissão": {
          "open": [],
          "locked": [
            {
              "Admissão planejada": {
                "uniqueValues": "true",
                "values": [
                  "Não"
                ]
              }
            },
            {
              "Submetido à cirurgia": {
                "uniqueValues": "true",
                "values": [
                  "Não"
                ]
              }
            },
            {
              "Motivo de admissão na UTI": {
                "multipleValues": "true",
                "values": [
                  "Abdome agudo"
                ]
              }
            }
          ]
        },
        "Status clínico": {
          "open": [
            {
              "Status clínico 1": {
                "groupedChoices": "true",
                "values": [
                  {
                    "Temperatura": {
                      "values": [
                        "<35 °C"
                      ]
                    }
                  },
                  {
                    "Escala de Coma de Glasgow": {
                      "values": [
                        ">=13"
                      ]
                    }
                  }
                ]
              }
            },
            {
              "Status clínico 2": {
                "groupedChoices": "true",
                "values": [
                  {
                    "Frequência cardíaca": {
                      "values": [
                        "<120 bpm"
                      ]
                    }
                  },
                  {
                    "Pressão sistólica": {
                      "values": [
                        "70-119 mmHg"
                      ]
                    }
                  },
                  {
                    "Droga vasoativa": {
                      "values": [
                        "Sim"
                      ]
                    }
                  }
                ]
              }
            }
          ],
          "locked": []
        },
        "Alterações laboratoriais": {
          "open": [
            {
              "Bilirrubina": {
                "uniqueValues": "true",
                "values": [
                  "<2 mg/dl",
                  "2-6 mg/dl",
                  ">=6 mg/dl"
                ]
              }
            },
            {
              "Creatinina": {
                "uniqueValues": "true",
                "values": [
                  "<1.2 mg/dl",
                  "1.2-1.9 mg/dl",
                  "2-3.4 mg/dl",
                  ">=3.5 mg/dl"
                ]
              }
            },
            {
              "pH": {
                "uniqueValues": "true",
                "values": [
                  "<=7.25",
                  ">7.25"
                ]
              }
            },
            {
              "Leucócitos": {
                "uniqueValues": "true",
                "values": [
                  "<15mil /mm³",
                  ">=15mil /mm³"
                ]
              }
            },
            {
              "Plaquetas": {
                "uniqueValues": "true",
                "values": [
                  "<20mil /mm³",
                  "20-49mil /mm³",
                  "50-99mil /mm³",
                  ">=100mil /mm³"
                ]
              }
            },
            {
              "Oxigenação": {
                "uniqueValues": "true",
                "values": [
                  "paO2 >=60 sem VM",
                  "paO2 <60 sem VM",
                  "paO2/FiO2 <100 em VM",
                  "paO2/FiO2 >=100 em VM"
                ]
              }
            }
          ],
          "locked": []
        }
      },
      {
        "dificuldade": "4",
        "Idade": {
          "open": [],
          "locked": [
            {
              "Idade": {
                "selectList": "true",
                "values": [
                  "<40 anos"
                ]
              }
            }
          ]
        },
        "Origem": {
          "open": [
            {
              "Origem": {
                "selectList": "true",
                "values": [
                  "Pronto Socorro",
                  "Outra UTI",
                  "Outro local do hospital"
                ]
              }
            }
          ],
          "locked": []
        },
        "Comorbidade": {
          "open": [
            {
              "Portador de": {
                "selectList": "true",
                "values": [
                  "IC NYHA IV",
                  "Câncer metastático",
                  "Terapia oncológica",
                  "Câncer hematológico",
                  "Cirrose",
                  "SIDA"
                ]
              }
            }
          ],
          "locked": [
            {
              "Internado antes da admissão": {
                "uniqueValues": "true",
                "values": [
                  "<14 dias"
                ]
              }
            },
            {
              "Infectado antes da admissão": {
                "uniqueValues": "true",
                "values": [
                  "Não"
                ]
              }
            }
          ]
        },
        "Contexto da admissão": {
          "open": [],
          "locked": [
            {
              "Admissão planejada": {
                "uniqueValues": "true",
                "values": [
                  "Não"
                ]
              }
            },
            {
              "Submetido à cirurgia": {
                "multipleValues": "true",
                "values": [
                  "Cirurgia urgência",
                  "Neurocirurgia por acidente vascular cerebral"
                ]
              }
            },
            {
              "Motivo de admissão na UTI": {
                "multipleValues": "true",
                "values": [
                  "Efeito de massa intracraniana"
                ]
              }
            }
          ]
        },
        "Status clínico": {
          "open": [
            {
              "Status clínico 1": {
                "groupedChoices": "true",
                "values": [
                  {
                    "Escala de Coma de Glasgow": {
                      "values": [
                        "7-12"
                      ]
                    }
                  },
                  {
                    "Temperatura": {
                      "values": [
                        "<35 °C"
                      ]
                    }
                  },
                  {
                    "Pressão sistólica": {
                      "values": [
                        "70-119 mmHg"
                      ]
                    }
                  }
                ]
              }
            },
            {
              "Status clínico 2": {
                "groupedChoices": "true",
                "values": [
                  {
                    "Escala de Coma de Glasgow": {
                      "values": [
                        "6"
                      ]
                    }
                  },
                  {
                    "Frequência cardíaca": {
                      "values": [
                        "120-159 bpm"
                      ]
                    }
                  },
                  {
                    "Droga vasoativa": {
                      "values": [
                        "Sim"
                      ]
                    }
                  }
                ]
              }
            }
          ],
          "locked": []
        },
        "Alterações laboratoriais": {
          "open": [
            {
              "Bilirrubina": {
                "uniqueValues": "true",
                "values": [
                  "<2 mg/dl",
                  "2-6 mg/dl",
                  ">=6 mg/dl"
                ]
              }
            },
            {
              "Creatinina": {
                "uniqueValues": "true",
                "values": [
                  "<1.2 mg/dl",
                  "1.2-1.9 mg/dl",
                  "2-3.4 mg/dl",
                  ">=3.5 mg/dl"
                ]
              }
            },
            {
              "pH": {
                "uniqueValues": "true",
                "values": [
                  "<=7.25",
                  ">7.25"
                ]
              }
            },
            {
              "Leucócitos": {
                "uniqueValues": "true",
                "values": [
                  "<15mil /mm³",
                  ">=15mil /mm³"
                ]
              }
            },
            {
              "Plaquetas": {
                "uniqueValues": "true",
                "values": [
                  "<20mil /mm³",
                  "20-49mil /mm³",
                  "50-99mil /mm³",
                  ">=100mil /mm³"
                ]
              }
            },
            {
              "Oxigenação": {
                "uniqueValues": "true",
                "values": [
                  "paO2 >=60 sem VM",
                  "paO2 <60 sem VM",
                  "paO2/FiO2 <100 em VM",
                  "paO2/FiO2 >=100 em VM"
                ]
              }
            }
          ],
          "locked": []
        }
      },
      {
        "dificuldade": "5",
        "Idade": {
          "open": [],
          "locked": [
            {
              "Idade": {
                "selectList": "true",
                "values": [
                  "<40 anos"
                ]
              }
            }
          ]
        },
        "Origem": {
          "open": [
            {
              "Origem": {
                "selectList": "true",
                "values": [
                  "Pronto Socorro",
                  "Outra UTI",
                  "Outro local do hospital"
                ]
              }
            }
          ],
          "locked": []
        },
        "Comorbidade": {
          "open": [
            {
              "Portador de": {
                "selectList": "true",
                "values": [
                  "IC NYHA IV",
                  "Câncer metastático",
                  "Terapia oncológica",
                  "Câncer hematológico",
                  "Cirrose",
                  "SIDA"
                ]
              }
            }
          ],
          "locked": [
            {
              "Internado antes da admissão": {
                "uniqueValues": "true",
                "values": [
                  "Não"
                ]
              }
            },
            {
              "Infectado antes da admissão": {
                "uniqueValues": "true",
                "values": [
                  "Não"
                ]
              }
            }
          ]
        },
        "Contexto da admissão": {
          "open": [],
          "locked": [
            {
              "Admissão planejada": {
                "uniqueValues": "true",
                "values": [
                  "Sim"
                ]
              }
            },
            {
              "Submetido à cirurgia": {
                "multipleValues": "true",
                "values": [
                  "Cirurgia eletiva",
                  "Transplante"
                ]
              }
            },
            {
              "Motivo de admissão na UTI": {
                "multipleValues": "true",
                "values": [
                  "Insuficiência hepática",
                  "Alteração do nível de consciência"
                ]
              }
            }
          ]
        },
        "Status clínico": {
          "open": [
            {
              "Status clínico 1": {
                "groupedChoices": "true",
                "values": [
                  {
                    "Escala de Coma de Glasgow": {
                      "values": [
                        "5"
                      ]
                    }
                  },
                  {
                    "Frequência cardíaca": {
                      "values": [
                        "120-159 bpm"
                      ]
                    }
                  },
                  {
                    "Pressão sistólica": {
                      "values": [
                        "70-119 mmHg"
                      ]
                    }
                  }
                ]
              }
            },
            {
              "Status clínico 2": {
                "groupedChoices": "true",
                "values": [
                  {
                    "Escala de Coma de Glasgow": {
                      "values": [
                        "6"
                      ]
                    }
                  },
                  {
                    "Temperatura": {
                      "values": [
                        "<35 °C"
                      ]
                    }
                  }
                ]
              }
            },
            {
              "Droga vasoativa": {
                "uniqueValues": "true",
                "values": [
                  "Não",
                  "Sim"
                ]
              }
            }
          ],
          "locked": []
        },
        "Alterações laboratoriais": {
          "open": [
            {
              "Bilirrubina": {
                "uniqueValues": "true",
                "values": [
                  "<2 mg/dl",
                  "2-6 mg/dl",
                  ">=6 mg/dl"
                ]
              }
            },
            {
              "Creatinina": {
                "uniqueValues": "true",
                "values": [
                  "<1.2 mg/dl",
                  "1.2-1.9 mg/dl",
                  "2-3.4 mg/dl",
                  ">=3.5 mg/dl"
                ]
              }
            },
            {
              "pH": {
                "uniqueValues": "true",
                "values": [
                  "<=7.25",
                  ">7.25"
                ]
              }
            },
            {
              "Leucócitos": {
                "uniqueValues": "true",
                "values": [
                  "<15mil /mm³",
                  ">=15mil /mm³"
                ]
              }
            },
            {
              "Plaquetas": {
                "uniqueValues": "true",
                "values": [
                  "<20mil /mm³",
                  "20-49mil /mm³",
                  "50-99mil /mm³",
                  ">=100mil /mm³"
                ]
              }
            },
            {
              "Oxigenação": {
                "uniqueValues": "true",
                "values": [
                  "paO2 >=60 sem VM",
                  "paO2 <60 sem VM",
                  "paO2/FiO2 <100 em VM",
                  "paO2/FiO2 >=100 em VM"
                ]
              }
            }
          ],
          "locked": []
        }
      },
      {
        "dificuldade": "6",
        "Idade": {
          "open": [],
          "locked": [
            {
              "Idade": {
                "selectList": "true",
                "values": [
                  "<40 anos"
                ]
              }
            }
          ]
        },
        "Origem": {
          "open": [],
          "locked": [
            {
              "Origem": {
                "selectList": "true",
                "values": [
                  "Outro local do hospital"
                ]
              }
            }
          ]
        },
        "Comorbidade": {
          "open": [
            {
              "Portador de": {
                "selectList": "true",
                "values": [
                  "IC NYHA IV",
                  "Câncer metastático",
                  "Terapia oncológica",
                  "Câncer hematológico",
                  "Cirrose",
                  "SIDA"
                ]
              }
            }
          ],
          "locked": [
            {
              "Internado antes da admissão": {
                "uniqueValues": "true",
                "values": [
                  ">=28 dias"
                ]
              }
            },
            {
              "Infectado antes da admissão": {
                "uniqueValues": "true",
                "values": [
                  "Não"
                ]
              }
            }
          ]
        },
        "Contexto da admissão": {
          "open": [],
          "locked": [
            {
              "Admissão planejada": {
                "uniqueValues": "true",
                "values": [
                  "Não"
                ]
              }
            },
            {
              "Submetido à cirurgia": {
                "uniqueValues": "true",
                "values": [
                  "Não"
                ]
              }
            },
            {
              "Motivo de admissão na UTI": {
                "multipleValues": "true",
                "values": [
                  "Outro choque"
                ]
              }
            }
          ]
        },
        "Status clínico": {
          "open": [
            {
              "Status clínico": {
                "selectList": "true",
                "values": [
                  {
                    "Temperatura": {
                      "values": [
                        "<35 °C"
                      ]
                    }
                  },
                  {
                    "Frequência cardíaca": {
                      "values": [
                        ">=160 bpm"
                      ]
                    }
                  },
                  {
                    "Pressão sistólica": {
                      "values": [
                        "<40 mmHg"
                      ]
                    }
                  }
                ]
              }
            }
          ],
          "locked": [
            {
              "Droga vasoativa": {
                "uniqueValues": "true",
                "values": [
                  "Sim"
                ]
              }
            },
            {
              "Escala de Coma de Glasgow": {
                "uniqueValues": "true",
                "values": [
                  "3-4"
                ]
              }
            }
          ]
        },
        "Alterações laboratoriais": {
          "open": [
            {
              "Alterações laboratoriais": {
                "selectList": "true",
                "values": [
                  {
                    "Bilirrubina": {
                      "values": [
                        ">=6 mg/dl"
                      ]
                    }
                  },
                  {
                    "Creatinina": {
                      "values": [
                        ">=3.5 mg/dl"
                      ]
                    }
                  },
                  {
                    "pH": {
                      "values": [
                        "<=7.25"
                      ]
                    }
                  },
                  {
                    "Leucócitos": {
                      "values": [
                        ">=15mil /mm³"
                      ]
                    }
                  },
                  {
                    "Plaquetas": {
                      "values": [
                        "<20mil /mm³"
                      ]
                    }
                  },
                  {
                    "Oxigenação": {
                      "values": [
                        "paO2/FiO2 <100 em VM"
                      ]
                    }
                  }
                ]
              }
            }
          ],
          "locked": []
        }
      },
      {
        "dificuldade": "7",
        "Idade": {
          "open": [],
          "locked": [
            {
              "Idade": {
                "selectList": "true",
                "values": [
                  "<40 anos"
                ]
              }
            }
          ]
        },
        "Origem": {
          "open": [
            {
              "Origem": {
                "selectList": "true",
                "values": [
                  "Pronto Socorro",
                  "Outra UTI",
                  "Outro local do hospital"
                ]
              }
            }
          ],
          "locked": []
        },
        "Comorbidade": {
          "open": [
            {
              "Portador de": {
                "selectList": "true",
                "values": [
                  "IC NYHA IV",
                  "Câncer metastático",
                  "Terapia oncológica",
                  "Câncer hematológico",
                  "Cirrose",
                  "SIDA"
                ]
              }
            }
          ],
          "locked": [
            {
              "Internado antes da admissão": {
                "uniqueValues": "true",
                "values": [
                  ">=28 dias"
                ]
              }
            },
            {
              "Infectado antes da admissão": {
                "uniqueValues": "true",
                "values": [
                  "Não"
                ]
              }
            }
          ]
        },
        "Contexto da admissão": {
          "open": [],
          "locked": [
            {
              "Admissão planejada": {
                "uniqueValues": "true",
                "values": [
                  "Não"
                ]
              }
            },
            {
              "Submetido à cirurgia": {
                "uniqueValues": "true",
                "values": [
                  "Não"
                ]
              }
            },
            {
              "Motivo de admissão na UTI": {
                "multipleValues": "true",
                "values": [
                  "Insuficiência hepática"
                ]
              }
            }
          ]
        },
        "Status clínico": {
          "open": [
            {
              "Status clínico 1": {
                "selectList": "true",
                "values": [
                  {
                    "Temperatura": {
                      "values": [
                        "<35 °C"
                      ]
                    }
                  },
                  {
                    "Frequência cardíaca": {
                      "values": [
                        ">=160 bpm"
                      ]
                    }
                  }
                ]
              }
            },
            {
              "Status clínico 2": {
                "selectList": "true",
                "values": [
                  {
                    "Escala de Coma de Glasgow": {
                      "values": [
                        "3-4"
                      ]
                    }
                  },
                  {
                    "Pressão sistólica": {
                      "values": [
                        "<40 mmHg"
                      ]
                    }
                  }
                ]
              }
            }
          ],
          "locked": [
            {
              "Droga vasoativa": {
                "uniqueValues": "true",
                "values": [
                  "Sim"
                ]
              }
            }
          ]
        },
        "Alterações laboratoriais": {
          "open": [
            {
              "Alterações laboratoriais 1": {
                "groupedChoices": "true",
                "values": [
                  {
                    "Bilirrubina": {
                      "values": [
                        ">=6 mg/dl"
                      ]
                    }
                  },
                  {
                    "Plaquetas": {
                      "values": [
                        "<20mil /mm³"
                      ]
                    }
                  },
                  {
                    "pH": {
                      "values": [
                        "<=7.25"
                      ]
                    }
                  }
                ]
              }
            },
            {
              "Alterações laboratoriais 2": {
                "groupedChoices": "true",
                "values": [
                  {
                    "Oxigenação": {
                      "values": [
                        "paO2/FiO2 <100 em VM"
                      ]
                    }
                  },
                  {
                    "Creatinina": {
                      "values": [
                        ">=3.5 mg/dl"
                      ]
                    }
                  },
                  {
                    "Leucócitos": {
                      "values": [
                        "<15mil /mm³"
                      ]
                    }
                  }
                ]
              }
            }
          ],
          "locked": []
        }
      },
      {
        "dificuldade": "8",
        "Idade": {
          "open": [],
          "locked": [
            {
              "Idade": {
                "selectList": "true",
                "values": [
                  "<40 anos"
                ]
              }
            }
          ]
        },
        "Origem": {
          "open": [
            {
              "Origem": {
                "selectList": "true",
                "values": [
                  "Pronto Socorro",
                  "Outra UTI",
                  "Outro local do hospital"
                ]
              }
            }
          ],
          "locked": []
        },
        "Comorbidade": {
          "open": [
            {
              "Portador de": {
                "selectList": "true",
                "values": [
                  "IC NYHA IV",
                  "Câncer metastático",
                  "Terapia oncológica",
                  "Câncer hematológico",
                  "Cirrose",
                  "SIDA"
                ]
              }
            }
          ],
          "locked": [
            {
              "Internado antes da admissão": {
                "uniqueValues": "true",
                "values": [
                  "14-27 dias"
                ]
              }
            },
            {
              "Infectado antes da admissão": {
                "uniqueValues": "true",
                "values": [
                  "Nosocomial"
                ]
              }
            }
          ]
        },
        "Contexto da admissão": {
          "open": [],
          "locked": [
            {
              "Admissão planejada": {
                "uniqueValues": "true",
                "values": [
                  "Não"
                ]
              }
            },
            {
              "Submetido à cirurgia": {
                "uniqueValues": "true",
                "values": [
                  "Não"
                ]
              }
            },
            {
              "Motivo de admissão na UTI": {
                "multipleValues": "true",
                "values": [
                  "Alteração do nível de consciência"
                ]
              }
            }
          ]
        },
        "Status clínico": {
          "open": [
            {
              "Status clínico 1": {
                "groupedChoices": "true",
                "values": [
                  {
                    "Escala de Coma de Glasgow": {
                      "values": [
                        "6"
                      ]
                    }
                  },
                  {
                    "Pressão sistólica": {
                      "values": [
                        "70-119 mmHg"
                      ]
                    }
                  }
                ]
              }
            },
            {
              "Status clínico 2": {
                "groupedChoices": "true",
                "values": [
                  {
                    "Temperatura": {
                      "values": [
                        "<35 °C"
                      ]
                    }
                  },
                  {
                    "Frequência cardíaca": {
                      "values": [
                        "120-159 bpm"
                      ]
                    }
                  }
                ]
              }
            }
          ],
          "locked": []
        },
        "Alterações laboratoriais": {
          "open": [
            {
              "Alterações laboratoriais 1": {
                "groupedChoices": "true",
                "values": [
                  {
                    "Bilirrubina": {
                      "values": [
                        "2-6 mg/dl"
                      ]
                    }
                  },
                  {
                    "pH": {
                      "values": [
                        "<=7.25"
                      ]
                    }
                  },
                  {
                    "Plaquetas": {
                      "values": [
                        "20-49mil /mm³"
                      ]
                    }
                  }
                ]
              }
            },
            {
              "Alterações laboratoriais 2": {
                "groupedChoices": "true",
                "values": [
                  {
                    "Creatinina": {
                      "values": [
                        "1.2-1.9 mg/dl"
                      ]
                    }
                  },
                  {
                    "Leucócitos": {
                      "values": [
                        ">=15mil /mm³"
                      ]
                    }
                  },
                  {
                    "Oxigenação": {
                      "values": [
                        "paO2 <60 sem VM"
                      ]
                    }
                  }
                ]
              }
            }
          ],
          "locked": []
        }
      },
      {
        "dificuldade": "9",
        "Idade": {
          "open": [],
          "locked": [
            {
              "Idade": {
                "selectList": "true",
                "values": [
                  "<40 anos"
                ]
              }
            }
          ]
        },
        "Origem": {
          "open": [
            {
              "Origem": {
                "selectList": "true",
                "values": [
                  "Pronto Socorro",
                  "Outra UTI",
                  "Outro local do hospital"
                ]
              }
            }
          ],
          "locked": []
        },
        "Comorbidade": {
          "open": [
            {
              "Portador de": {
                "selectList": "true",
                "values": [
                  "IC NYHA IV",
                  "Câncer metastático",
                  "Terapia oncológica",
                  "Câncer hematológico",
                  "Cirrose",
                  "SIDA"
                ]
              }
            }
          ],
          "locked": [
            {
              "Internado antes da admissão": {
                "uniqueValues": "true",
                "values": [
                  "14-27 dias"
                ]
              }
            },
            {
              "Infectado antes da admissão": {
                "uniqueValues": "true",
                "values": [
                  "Respiratória"
                ]
              }
            }
          ]
        },
        "Contexto da admissão": {
          "open": [],
          "locked": [
            {
              "Admissão planejada": {
                "uniqueValues": "true",
                "values": [
                  "Não"
                ]
              }
            },
            {
              "Submetido à cirurgia": {
                "uniqueValues": "true",
                "values": [
                  "Não"
                ]
              }
            },
            {
              "Motivo de admissão na UTI": {
                "multipleValues": "true",
                "values": [
                  "Alteração do nível de consciência"
                ]
              }
            }
          ]
        },
        "Status clínico": {
          "open": [
            {
              "Status clínico 1": {
                "groupedChoices": "true",
                "values": [
                  {
                    "Escala de Coma de Glasgow": {
                      "values": [
                        "6"
                      ]
                    }
                  },
                  {
                    "Pressão sistólica": {
                      "values": [
                        "70-119 mmHg"
                      ]
                    }
                  }
                ]
              }
            },
            {
              "Status clínico 2": {
                "groupedChoices": "true",
                "values": [
                  {
                    "Temperatura": {
                      "values": [
                        "<35 °C"
                      ]
                    }
                  },
                  {
                    "Frequência cardíaca": {
                      "values": [
                        "120-159 bpm"
                      ]
                    }
                  }
                ]
              }
            }
          ],
          "locked": []
        },
        "Alterações laboratoriais": {
          "open": [
            {
              "Alterações laboratoriais 1": {
                "groupedChoices": "true",
                "values": [
                  {
                    "Bilirrubina": {
                      "values": [
                        "2-6 mg/dl"
                      ]
                    }
                  },
                  {
                    "pH": {
                      "values": [
                        "<=7.25"
                      ]
                    }
                  },
                  {
                    "Plaquetas": {
                      "values": [
                        "20-49mil /mm³"
                      ]
                    }
                  }
                ]
              }
            },
            {
              "Alterações laboratoriais 2": {
                "groupedChoices": "true",
                "values": [
                  {
                    "Creatinina": {
                      "values": [
                        "1.2-1.9 mg/dl"
                      ]
                    }
                  },
                  {
                    "Leucócitos": {
                      "values": [
                        ">=15mil /mm³"
                      ]
                    }
                  },
                  {
                    "Oxigenação": {
                      "values": [
                        "paO2 <60 sem VM"
                      ]
                    }
                  }
                ]
              }
            }
          ],
          "locked": []
        }
      },
      {
        "dificuldade": "10",
        "Idade": {
          "open": [],
          "locked": [
            {
              "Idade": {
                "selectList": "true",
                "values": [
                  "<40 anos"
                ]
              }
            }
          ]
        },
        "Origem": {
          "open": [
            {
              "Origem": {
                "selectList": "true",
                "values": [
                  "Pronto Socorro",
                  "Outra UTI",
                  "Outro local do hospital"
                ]
              }
            }
          ],
          "locked": []
        },
        "Comorbidade": {
          "open": [
            {
              "Portador de": {
                "selectList": "true",
                "values": [
                  "IC NYHA IV",
                  "Câncer metastático",
                  "Terapia oncológica",
                  "Câncer hematológico",
                  "Cirrose",
                  "SIDA"
                ]
              }
            }
          ],
          "locked": [
            {
              "Internado antes da admissão": {
                "uniqueValues": "true",
                "values": [
                  ">=28 dias"
                ]
              }
            },
            {
              "Infectado antes da admissão": {
                "uniqueValues": "true",
                "values": [
                  "Não"
                ]
              }
            }
          ]
        },
        "Contexto da admissão": {
          "open": [],
          "locked": [
            {
              "Admissão planejada": {
                "uniqueValues": "true",
                "values": [
                  "Não"
                ]
              }
            },
            {
              "Submetido à cirurgia": {
                "uniqueValues": "true",
                "values": [
                  "Não"
                ]
              }
            },
            {
              "Motivo de admissão na UTI": {
                "multipleValues": "true",
                "values": [
                  "Outro choque",
                  "Abdome agudo",
                  "Pancreatite grave"
                ]
              }
            }
          ]
        },
        "Status clínico": {
          "open": [
            {
              "Status clínico 1": {
                "selectList": "true",
                "values": [
                  {
                    "Escala de Coma de Glasgow": {
                      "values": [
                        "5"
                      ]
                    }
                  },
                  {
                    "Temperatura": {
                      "values": [
                        "<35 °C"
                      ]
                    }
                  },
                  {
                    "Frequência cardíaca": {
                      "values": [
                        ">=160 bpm"
                      ]
                    }
                  }
                ]
              }
            },
            {
              "Status clínico 2": {
                "selectList": "true",
                "values": [
                  {
                    "Pressão sistólica": {
                      "values": [
                        "<40 mmHg"
                      ]
                    }
                  },
                  "Droga vasoativa",
                  {
                    "Frequência cardíaca": {
                      "values": [
                        "120-159 bpm"
                      ]
                    }
                  }
                ]
              }
            }
          ],
          "locked": []
        },
        "Alterações laboratoriais": {
          "open": [
            {
              "Alterações laboratoriais 1": {
                "selectList": "true",
                "values": [
                  {
                    "pH": {
                      "values": [
                        "<=7.25"
                      ]
                    }
                  },
                  {
                    "Leucócitos": {
                      "values": [
                        ">=15mil /mm³"
                      ]
                    }
                  },
                  {
                    "Oxigenação": {
                      "values": [
                        "paO2/FiO2 >=100 em VM"
                      ]
                    }
                  }
                ]
              }
            },
            {
              "Alterações laboratoriais 2": {
                "selectList": "true",
                "values": [
                  {
                    "Plaquetas": {
                      "values": [
                        "<20mil /mm³"
                      ]
                    }
                  },
                  {
                    "Creatinina": {
                      "values": [
                        ">=3.5 mg/dl"
                      ]
                    }
                  },
                  {
                    "Bilirrubina": {
                      "values": [
                        ">=6 mg/dl"
                      ]
                    }
                  }
                ]
              }
            }
          ],
          "locked": []
        }
      },

    ]
  }

  Prognosis.challengeOneLvls = {
    "pacients":[
      {
        "dificuldade": "1",
        "Idade":{
          "locked": [
            {
              "Idade":{
                "selectList":"true",
                "values":[
                  "<40 anos",
                ]
              }
            }
          ],
          "open": []
        },
        "Origem":{
          "locked": [
            {
              "Origem":{
                "selectList":"true",
                "values":[
                  "Pronto Socorro",
                ]
              },
            }
          ],
          "open": [],
        },
        "Comorbidade":{
          "locked": [
            {
              "IC NYHA IV": {
                "values": [
                  "Sim",
                ],
              },
            },
          ],
          "open": [],
        },
        "Contexto da admissão": {
          "locked": [
            {
              "Admissão planejada": {
                "values":[
                  "Sim",
                ]
              },
            },
            {
              "Submetido à cirurgia": {
                "cascade": "true",
                "radioYN": "true",
                "uniqueValues": "true",
                "values": [
                  "Cirurgia eletiva",
                ],
                "child": [
                  "Transplante",
                ],
              },
            },
            {
              "Motivo de admissão na UTI": {
                "values": [
                  "Arritmia",
                ],
              },
            },
          ],
          "open": []
        },
        "Status clínico": {
          "locked": [
            {
              "Escala de Coma de Glasgow": {
                "uniqueValues":"true",
                "values": [
                  ">=13",
                ],
              },
            },
            {
              "Temperatura": {
                "uniqueValues":"true",
                "values": [
                  ">=35 °C",
                ],
              },
            },
            {
              "Frequência cardíaca": {
                "uniqueValues":"true",
                "values": [
                  "<120 bpm",
                ],
              },
            },
            {
              "Pressão sistólica": {
                "uniqueValues":"true",
                "values": [
                  ">=120 mmHg",
                ],
              },
            },
            {
              "Droga vasoativa": {
                "uniqueValues":"true",
                "values": [
                  "Não",
                ]
              },
            },
          ],
          "open": [],
        },
        "Alterações laboratoriais": {
          "locked": [
            {
              "Bilirrubina": {
                "uniqueValues":"true",
                "values": [
                  ">=6 mg/dl",
                ],
              },
            },
            {
              "Creatinina": {
                "uniqueValues":"true",
                "values": [
                  "<1.2 mg/dl",
                ],
              },
            },
            {
              "pH": {
                "uniqueValues":"true",
                "values": [
                  ">7.25"
                ],
              },
            },
            {
              "Leucócitos": {
                "uniqueValues":"true",
                "values": [
                  ">=15mil /mm³",
                ],
              },
            },
            {
              "Plaquetas": {
                "uniqueValues":"true",
                "values": [
                  ">=100mil /mm³",
                ],
              },
            },
            {
              "Oxigenação": {
                "uniqueValues":"true",
                "values": [
                  "paO2 >=60 sem VM",
                ],
              },
            },
          ],
          "open": [],
        },
      },
      {
        "dificuldade": "2",
        "Idade":{
          "locked": [
            {
              "Idade":{
                "selectList":"true",
                "values":[
                  "40-59 anos",
                ]
              }
            }
          ],
          "open": []
        },
        "Origem":{
          "locked": [
            {
              "Origem":{
                "selectList":"true",
                "values":[
                  "Pronto Socorro",
                ]
              },
            }
          ],
          "open": [],
        },
        "Comorbidade":{
          "locked": [
            {
              "IC NYHA IV": {
                "values": [
                  "Sim",
                ],
              },
            },
          ],
          "open": [],
        },
        "Contexto da admissão": {
          "locked": [
            {
              "Admissão planejada": {
                "values":[
                  "Sim",
                ]
              },
            },
            {
              "Submetido à cirurgia": {
                "cascade": "true",
                "radioYN": "true",
                "uniqueValues": "true",
                "values": [
                  "Cirurgia eletiva",
                ],
                "child": [
                  "Transplante",
                ],
              },
            },
            {
              "Motivo de admissão na UTI": {
                "values": [
                  "Arritmia",
                ],
              },
            },
          ],
          "open": []
        },
        "Status clínico": {
          "locked": [
            {
              "Escala de Coma de Glasgow": {
                "uniqueValues":"true",
                "values": [
                  ">=13",
                ],
              },
            },
            {
              "Temperatura": {
                "uniqueValues":"true",
                "values": [
                  ">=35 °C",
                ],
              },
            },
            {
              "Frequência cardíaca": {
                "uniqueValues":"true",
                "values": [
                  "<120 bpm",
                ],
              },
            },
            {
              "Pressão sistólica": {
                "uniqueValues":"true",
                "values": [
                  ">=120 mmHg",
                ],
              },
            },
            {
              "Droga vasoativa": {
                "uniqueValues":"true",
                "values": [
                  "Não",
                ]
              },
            },
          ],
          "open": [],
        },
        "Alterações laboratoriais": {
          "locked": [
            {
              "Bilirrubina": {
                "uniqueValues":"true",
                "values": [
                  ">=6 mg/dl",
                ],
              },
            },
            {
              "Creatinina": {
                "uniqueValues":"true",
                "values": [
                  "<1.2 mg/dl",
                ],
              },
            },
            {
              "pH": {
                "uniqueValues":"true",
                "values": [
                  ">7.25"
                ],
              },
            },
            {
              "Leucócitos": {
                "uniqueValues":"true",
                "values": [
                  ">=15mil /mm³",
                ],
              },
            },
            {
              "Plaquetas": {
                "uniqueValues":"true",
                "values": [
                  ">=100mil /mm³",
                ],
              },
            },
            {
              "Oxigenação": {
                "uniqueValues":"true",
                "values": [
                  "paO2 >=60 sem VM",
                ],
              },
            },
          ],
          "open": [],
        },
      },
    ]
  }

  Prognosis.challengeTwoLvls = {
    "pacients":[
      {
        "dificuldade": "1",
        "prognTarget": "50-100",
        "Idade":{
          "locked": [

          ],
          "open": [
            {
              "Idade":{
                "selectList":"true",
                "values":[
                  "<40 anos",
                  "40-59 anos",
                  "60-69 anos",
                  "70-74 anos",
                  "75-79 anos",
                  ">=80 anos",
                ]
              }
            }

          ]
        },
        "Origem":{
          "locked": [],
          "open": [
            {
              "Origem":{
                "selectList":"true",
                "values":[
                  "Pronto Socorro",
                  "Outra UTI",
                  "Outro local do hospital",
                ]
              },
            }
          ],
        },
        "Comorbidade":{
          "locked": [

          ],
          "open": [
            {
              "IC NYHA IV": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },
            },
            {
              "Câncer metastático": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },
            },
            {
              "Terapia oncológica": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },
            },
            {
              "Câncer hematológico": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },
            },
            {
              "Cirrose": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },
            },
            {
              "SIDA": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },
            },
            {
              "Internado antes da admissão": {
                "cascade": "true",
                "radioYN": "true",
                "uniqueValues":"true",
                "values": [
                  "<14 dias",
                  "14-27 dias",
                  ">=28 dias",
                ],
              },
            },
            {
              "Infectado antes da admissão": {
                "cascade": "true",
                "radioYN": "true",
                "multipleValues": "true",
                "values": [
                  "Nosocomial",
                  "Respiratória",
                ],
              },
            },
          ],
        },
        "Contexto da admissão": {
          "locked": [],
          "open": [
            {
              "Admissão planejada": {
                "values":[
                  "Não",
                  "Sim",
                ]
              },
            },
            {
              "Submetido à cirurgia": {
                "cascade": "true",
                "radioYN": "true",
                "uniqueValues": "true",
                "values": [
                  "Cirurgia eletiva",
                  "Cirurgia urgência",
                ],
                "child": [
                  "Neurocirurgia por acidente vascular cerebral",
                  "Revascularização miocárdica",
                  "Trauma",
                  "Transplante",
                  "Outro",
                ],
              },
            },
            {
              "Motivo de admissão na UTI": {
                "values": [
                  "Arritmia",
                  "Choque hipovolêmico",
                  "Outro choque",
                  "Convulsão",
                  "Abdome agudo",
                  "Pancreatite grave",
                  "Déficit focal",
                  "Efeito de massa intracraniana",
                  "Insuficiência hepática",
                  "Alteração do nível de consciência",
                  "Nenhum dos anteriores",
                ],
              },
            },
          ]
        },
        "Status clínico": {
          "locked": [],
          "open": [
            {
              "Escala de Coma de Glasgow": {
                "uniqueValues":"true",
                "values": [
                  "3-4",
                  "5",
                  "6",
                  "7-12",
                  ">=13",
                ],
              },
            },
            {
              "Temperatura": {
                "uniqueValues":"true",
                "values": [
                  "<35 °C",
                  ">=35 °C",
                ],
              },
            },
            {
              "Frequência cardíaca": {
                "uniqueValues":"true",
                "values": [
                  "<120 bpm",
                  "120-159 bpm",
                  ">=160 bpm",
                ],
              },
            },
            {
              "Pressão sistólica": {
                "uniqueValues":"true",
                "values": [
                  "<40 mmHg",
                  "40-69 mmHg",
                  "70-119 mmHg",
                  ">=120 mmHg",
                ],
              },
            },
            {
              "Droga vasoativa": {
                "uniqueValues":"true",
                "values": [
                  "Não",
                  "Sim",
                ]
              },
            },
          ],
        },
        "Alterações laboratoriais": {
          "locked": [],
          "open": [
            {
              "Bilirrubina": {
                "uniqueValues":"true",
                "values": [
                  "<2 mg/dl",
                  "2-6 mg/dl",
                  ">=6 mg/dl",
                ],
              },
            },
            {
              "Creatinina": {
                "uniqueValues":"true",
                "values": [
                  "<1.2 mg/dl",
                  "1.2-1.9 mg/dl",
                  "2-3.4 mg/dl",
                  ">=3.5 mg/dl",
                ],
              },
            },
            {
              "pH": {
                "uniqueValues":"true",
                "values": [
                  "<=7.25",
                  ">7.25"
                ],
              },
            },
            {
              "Leucócitos": {
                "uniqueValues":"true",
                "values": [
                  "<15mil /mm³",
                  ">=15mil /mm³",
                ],
              },
            },
            {
              "Plaquetas": {
                "uniqueValues":"true",
                "values": [
                  "<20mil /mm³",
                  "20-49mil /mm³",
                  "50-99mil /mm³",
                  ">=100mil /mm³",
                ],
              },
            },
            {
              "Oxigenação": {
                "uniqueValues":"true",
                "values": [
                  "paO2 >=60 sem VM",
                  "paO2 <60 sem VM",
                  "paO2/FiO2 <100 em VM",
                  "paO2/FiO2 >=100 em VM",
                ],
              },
            },
          ],
        },
      },
      {
        "dificuldade": "2",
        "prognTarget": "50-90",
        "Idade":{
          "locked": [

          ],
          "open": [
            {
              "Idade":{
                "selectList":"true",
                "values":[
                  "<40 anos",
                  "40-59 anos",
                  "60-69 anos",
                  "70-74 anos",
                  "75-79 anos",
                  ">=80 anos",
                ]
              }
            }

          ]
        },
        "Origem":{
          "locked": [],
          "open": [
            {
              "Origem":{
                "selectList":"true",
                "values":[
                  "Pronto Socorro",
                  "Outra UTI",
                  "Outro local do hospital",
                ]
              },
            }
          ],
        },
        "Comorbidade":{
          "locked": [

          ],
          "open": [
            {
              "IC NYHA IV": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },
            },
            {
              "Câncer metastático": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },
            },
            {
              "Terapia oncológica": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },
            },
            {
              "Câncer hematológico": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },
            },
            {
              "Cirrose": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },
            },
            {
              "SIDA": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },
            },
            {
              "Internado antes da admissão": {
                "cascade": "true",
                "radioYN": "true",
                "uniqueValues":"true",
                "values": [
                  "<14 dias",
                  "14-27 dias",
                  ">=28 dias",
                ],
              },
            },
            {
              "Infectado antes da admissão": {
                "cascade": "true",
                "radioYN": "true",
                "multipleValues": "true",
                "values": [
                  "Nosocomial",
                  "Respiratória",
                ],
              },
            },
          ],
        },
        "Contexto da admissão": {
          "locked": [],
          "open": [
            {
              "Admissão planejada": {
                "values":[
                  "Não",
                  "Sim",
                ]
              },
            },
            {
              "Submetido à cirurgia": {
                "cascade": "true",
                "radioYN": "true",
                "uniqueValues": "true",
                "values": [
                  "Cirurgia eletiva",
                  "Cirurgia urgência",
                ],
                "child": [
                  "Neurocirurgia por acidente vascular cerebral",
                  "Revascularização miocárdica",
                  "Trauma",
                  "Transplante",
                  "Outro",
                ],
              },
            },
            {
              "Motivo de admissão na UTI": {
                "values": [
                  "Arritmia",
                  "Choque hipovolêmico",
                  "Outro choque",
                  "Convulsão",
                  "Abdome agudo",
                  "Pancreatite grave",
                  "Déficit focal",
                  "Efeito de massa intracraniana",
                  "Insuficiência hepática",
                  "Alteração do nível de consciência",
                  "Nenhum dos anteriores",
                ],
              },
            },
          ]
        },
        "Status clínico": {
          "locked": [],
          "open": [
            {
              "Escala de Coma de Glasgow": {
                "uniqueValues":"true",
                "values": [
                  "3-4",
                  "5",
                  "6",
                  "7-12",
                  ">=13",
                ],
              },
            },
            {
              "Temperatura": {
                "uniqueValues":"true",
                "values": [
                  "<35 °C",
                  ">=35 °C",
                ],
              },
            },
            {
              "Frequência cardíaca": {
                "uniqueValues":"true",
                "values": [
                  "<120 bpm",
                  "120-159 bpm",
                  ">=160 bpm",
                ],
              },
            },
            {
              "Pressão sistólica": {
                "uniqueValues":"true",
                "values": [
                  "<40 mmHg",
                  "40-69 mmHg",
                  "70-119 mmHg",
                  ">=120 mmHg",
                ],
              },
            },
            {
              "Droga vasoativa": {
                "uniqueValues":"true",
                "values": [
                  "Não",
                  "Sim",
                ]
              },
            },
          ],
        },
        "Alterações laboratoriais": {
          "locked": [],
          "open": [
            {
              "Bilirrubina": {
                "uniqueValues":"true",
                "values": [
                  "<2 mg/dl",
                  "2-6 mg/dl",
                  ">=6 mg/dl",
                ],
              },
            },
            {
              "Creatinina": {
                "uniqueValues":"true",
                "values": [
                  "<1.2 mg/dl",
                  "1.2-1.9 mg/dl",
                  "2-3.4 mg/dl",
                  ">=3.5 mg/dl",
                ],
              },
            },
            {
              "pH": {
                "uniqueValues":"true",
                "values": [
                  "<=7.25",
                  ">7.25"
                ],
              },
            },
            {
              "Leucócitos": {
                "uniqueValues":"true",
                "values": [
                  "<15mil /mm³",
                  ">=15mil /mm³",
                ],
              },
            },
            {
              "Plaquetas": {
                "uniqueValues":"true",
                "values": [
                  "<20mil /mm³",
                  "20-49mil /mm³",
                  "50-99mil /mm³",
                  ">=100mil /mm³",
                ],
              },
            },
            {
              "Oxigenação": {
                "uniqueValues":"true",
                "values": [
                  "paO2 >=60 sem VM",
                  "paO2 <60 sem VM",
                  "paO2/FiO2 <100 em VM",
                  "paO2/FiO2 >=100 em VM",
                ],
              },
            },
          ],
        },
      },
  ]
  }

  Prognosis.sapsScoreValues = {
    "pacient":{
      "Idade":{
        "values":{
          "<40 anos":{
            "saps":0,
            "text":"menos que 40 anos",
          },
          "40-59 anos":{
            "saps":5,
            "text":"entre 40 e 59 anos",
          },
          "60-69 anos":{
            "saps":9,
            "text":"entre 60 e 69 anos",
          },
          "70-74 anos":{
            "saps":13,
            "text":"entre 70 e 74 anos",
          },
          "75-79 anos":{
            "saps":15,
            "text":"entre 75 e 79 anos",
          },
          ">=80 anos":{
            "saps":18,
            "text":"mais que 80 anos",
          },
        }
      },
      "Origem":{
        "values":{
          "Pronto Socorro":{
            "saps":5,
            "text":"do Pronto Socorro",
          },
          "Outra UTI":{
            "saps":7,
            "text":"de outra UTI",
          },
          "Outro local do hospital":{
            "saps":8,
            "text":"de outro local do hospital",
          },
        }
      },
      "IC NYHA IV":{
        "values":{
          "Não":{
            "saps":0,
            "text":"",
          },
          "Sim":{
            "saps":6,
            "text":"IC NYHA IV",
          },
        },
      },
      "Câncer metastático":{
        "values":{
          "Não":{
            "saps":0,
            "text":"",
          },
          "Sim":{
            "saps":11,
            "text":"câncer metastático",
          },
        },
      },
      "Terapia oncológica":{
        "values":{
          "Não":{
            "saps":0,
            "text":"",
          },
          "Sim":{
            "saps":3,
            "text":"tratamento oncológico",
          },
        },
      },
      "Câncer hematológico":{
        "values":{
          "Não":{
            "saps":0,
            "text":"",
          },
          "Sim":{
            "saps":6,
            "text":"câncer hematológico",
          },
        },
      },
      "Cirrose":{
        "values":{
          "Não":{
            "saps":0,
            "text":"",
          },
          "Sim":{
            "saps":8,
            "text":"cirrose",
          },
        },
      },
      "SIDA":{
        "values":{
          "Não":{
            "saps":0,
            "text":"",
          },
          "Sim":{
            "saps":8,
            "text":"SIDA",
          },
        },
      },
      "Internado antes da admissão":{
        "values":{
          "Não":{
            "saps":0,
            "text":"",
          },
          "<14 dias":{
            "saps":0,
            "text":"há menos de 14 dias",
          },
          "14-27 dias":{
            "saps":6,
            "text":"entre 14 e 27 dias",
          },
          ">=28 dias":{
            "saps":7,
            "text":"há mais de 28 dias",
          },
        },
      },
      "Infectado antes da admissão":{
        "values":{
          "Não":{
            "saps":0,
            "text":"",
          },
          "Nosocomial":{
            "saps":4,
            "text":"nosocomial",
          },
          "Respiratória":{
            "saps":5,
            "text":"respiratória",
          },
        },
      },
      "Admissão planejada":{
        "values":{
          "Não":{
            "saps":3,
            "text":"não eletivamente",
          },
          "Sim":{
            "saps":0,
            "text":"eletivamente",
          },
        },
      },
      "Submetido à cirurgia":{
        "values":{
          "Não":{
            "saps":5,
            "text":"não submetido à cirurgia",
          },
          "Cirurgia eletiva":{
            "saps":0,
            "text":"submetido à cirurgia eletiva",
          },
          "Cirurgia urgência":{
            "saps":6,
            "text":"submetido à cirurgia de urgência",
          },
          "Neurocirurgia por acidente vascular cerebral":{
            "saps":5,
            "text":"neurocirurgia por acidente vascular cerebral",
          },
          "Revascularização miocárdica":{
            "saps":-6,
            "text":"revascularização miocárdica",
          },
          "Trauma":{
            "saps":-8,
            "text":"trauma",
          },
          "Transplante":{
            "saps":-11,
            "text":"transplante",
          },
          "Outro":{
            "saps":0,
            "text":"",
          },
        },
      },
      "Motivo de admissão na UTI":{
        "values":{
          "Arritmia":{
            "saps":-5,
            "text":"arritmia",
          },
          "Choque hipovolêmico":{
            "saps":3,
            "text":"choque hipovolêmico",
          },
          "Outro choque":{
            "saps":5,
            "text":"outro choque",
          },
          "Convulsão":{
            "saps":-4,
            "text":"convulsão",
          },
          "Abdome agudo":{
            "saps":3,
            "text":"abdome agudo",
          },
          "Pancreatite grave":{
            "saps":9,
            "text":"pancreatite grave",
          },
          "Déficit focal":{
            "saps":7,
            "text":"déficit focal",
          },
          "Efeito de massa intracraniana":{
            "saps":10,
            "text":"efeito de massa intracraniana",
          },
          "Insuficiência hepática":{
            "saps":6,
            "text":"insuficiência hepática",
          },
          "Alteração do nível de consciência":{
            "saps":4,
            "text":"alteração do nível de consciência",
          },
          "Nenhum dos anteriores":{
            "saps":0,
            "text":"",
          },
        },
      },
      "Escala de Coma de Glasgow":{
        "values":{
          "3-4":{
            "saps":15,
            "text":"3 a 4",
          },
          "5":{
            "saps":10,
            "text":"5",
          },
          "6":{
            "saps":7,
            "text":"6",
          },
          "7-12":{
            "saps":2,
            "text":"7 a 12",
          },
          ">=13":{
            "saps":0,
            "text":"&#8805;13",
          },
        },
      },
      "Temperatura":{
        "values":{
          "<35 °C":{
            "saps":7,
            "text":"<35 °C",
          },
          ">=35 °C":{
            "saps":0,
            "text":"&#8805;35 °C",
          },
        },
      },
      "Frequência cardíaca":{
        "values":{
          "<120 bpm":{
            "saps":0,
            "text":"<120 bpm",
          },
          "120-159 bpm":{
            "saps":5,
            "text":"120-159 bpm",
          },
          ">=160 bpm":{
            "saps":7,
            "text":"&#8805;160 bpm",
          },
        },
      },
      "Pressão sistólica":{
        "values":{
          "<40 mmHg":{
            "saps":11,
            "text":"<40 mmHg",
          },
          "40-69 mmHg":{
            "saps":8,
            "text":"40-69 mmHg",
          },
          "70-119 mmHg":{
            "saps":3,
            "text":"70-119 mmHg",
          },
          ">=120 mmHg":{
            "saps":0,
            "text":"&#8805;120 mmHg",
          },
        },
      },
      "Droga vasoativa":{
        "values":{
          "Não":{
            "saps":0,
            "text":"sem",
          },
          "Sim":{
            "saps":3,
            "text":"em",
          },
        },
      },
      "Bilirrubina":{
        "values":{
          "<2 mg/dl":{
            "saps":0,
            "text":"<2 mg/dl",
          },
          "2-6 mg/dl":{
            "saps":4,
            "text":"2-6 mg/dl",
          },
          ">=6 mg/dl":{
            "saps":5,
            "text":"&#8805;6 mg/dl",
          },
        },
      },
      "Creatinina":{
        "values":{
          "<1.2 mg/dl":{
            "saps":0,
            "text":"<1,2 mg/dl",
          },
          "1.2-1.9 mg/dl":{
            "saps":2,
            "text":"1,2-1,9 mg/dl",
          },
          "2-3.4 mg/dl":{
            "saps":7,
            "text":"2-3,4 mg/dl",
          },
          ">=3.5 mg/dl":{
            "saps":8,
            "text":"&#8805;3,5 mg/dl",
          },
        },
      },
      "pH":{
        "values":{
          "<=7.25":{
            "saps":3,
            "text":"&#8804;7,25",
          },
          ">7.25":{
            "saps":0,
            "text":">7,25",
          },
        },
      },
      "Leucócitos":{
        "values":{
          "<15mil /mm³":{
            "saps":0,
            "text":"<15mil /mm³",
          },
          ">=15mil /mm³":{
            "saps":2,
            "text":"&#8805;15mil /mm³",
          },
        },
      },
      "Plaquetas":{
        "values":{
          "<20mil /mm³":{
            "saps":13,
            "text":"<20mil /mm³",
          },
          "20-49mil /mm³":{
            "saps":8,
            "text":"20-49mil /mm³",
          },
          "50-99mil /mm³":{
            "saps":5,
            "text":"50-99mil /mm³",
          },
          ">=100mil /mm³":{
            "saps":0,
            "text":"&#8805;100mil /mm³",
          },
        },
      },
      "Oxigenação":{
        "values":{
          "paO2 >=60 sem VM":{
            "saps":0,
            "text":"sem VM com paO2 &#8805;60",
          },
          "paO2 <60 sem VM":{
            "saps":5,
            "text":"sem VM com paO2 <60",
          },
          "paO2/FiO2 >=100 em VM":{
            "saps":7,
            "text":"em VM com paO2/FiO2 &#8805;100",
          },
          "paO2/FiO2 <100 em VM":{
            "saps":11,
            "text":"em VM com paO2/FiO2 <100",
          },
        },
      },
    }
  }

  Prognosis.playerOption =
  `
  <div class="input-group mb-2 d-flex no-gutters">
  <div class="input-group-prepend ">
  </div>
  <div class="d-flex flex-grow-1 border col flex-wrap" id="options-[id]-wrapper">
  </div>
  </div>
  `
  Prognosis.playerOptionLocked =
  `
  <div class="input-group mb-2 d-flex no-gutters disabled-lock">
  <div class="input-group-prepend ">
  </div>
  <div class="d-flex flex-grow-1 border col" id="options-[id]-wrapper">
  </div>
  </div>
  `
  Prognosis.playerGroupedOption =
  `
  <div class="input-group mb-2 d-flex no-gutters">
    <div class="input-group-prepend ">
      <label class="input-group-text">[prependText]</label>
    </div>
    <div class="form-check form-check-inline">
      <input class="form-check-input" type="radio" name="[name]" id="[id]" value="">
      <label class="form-check-label" for="[id]">Escolher esse grupo</label>
    </div>
    <div class="w-100">
    </div>
    <div class="d-flex flex-grow-1 border col flex-wrap disabled-look" id="grouped-[id]-wrapper">
    </div>
  </div>
  `
  Prognosis.playerOptionCheckbox =
  `
  <div class="form-check form-check-inline">
  <input class="form-check-input" type="checkbox" id="[id]" value="[value]" required>
  <label class="form-check-label" for="[id]">[valueText]</label>
  </div>`
  Prognosis.playerOptionRadio =
  `
  <div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name=[name] id="[id]" value="[value]" required>
  <label class="form-check-label" for="[id]">[valueText]</label>
  </div>`
  Prognosis.playerSelectList =
  `
  <select class="custom-select" id="[id]" required>
    <option value="" selected>Escolha uma opção...</option>
  </select>
  `
  Prognosis.playerOptionInputDisabled =
  `
  <input class="form-control h-100" type="text" id="[id]" value="[value]" disabled>
  `
  Prognosis.playerGuessTxt =
  `
  Você respondeu que a chance do paciente sobreviver era: <i class="text-info">[playerGuess]</i>
  `
  Prognosis.sapsCalcTxt =
  `
  A chance calculada é de: <i class="text-info">[sapsSurvival]</i>.<br>Essa porcentagem te dá direito à escolha de <i class="text-info">[rouletteN]</i> número[plural] para a roleta.
  `
})()

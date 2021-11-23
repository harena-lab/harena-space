 class PrognosisProgress {
  constructor() {
    this.start = this.start.bind(this)
    MessageBus.i.subscribe('control/dhtml/ready', this.start)
  }

  async start(){
    MessageBus.i.unsubscribe('control/dhtml/ready', this.start)
    await this.getPrognosisUserInfo()
    if(document.querySelector('#progn-lvl-progress-wrapper')){
      let selectList = document.querySelector('#select-wrapper select')
      switch (selectList.value) {
        case 'learning':
          this.listLvlProgress()
          break
        case 'ch1':
          this.listChOneProgress()
          break
        case 'ch2':
          this.listChTwoProgress()
          break
        default:

      }
      const fnSelectList = function(){
        switch (this.value) {
          case 'learning':
            PrognosisProgress.i.listLvlProgress()
            break
          case 'ch1':
            PrognosisProgress.i.listChOneProgress()
            break
          case 'ch2':
            PrognosisProgress.i.listChTwoProgress()
            break
          default:

        }
      }
      selectList.addEventListener('change', fnSelectList)
    }


  }

  async getPrognosisUserInfo (){
    PrognosisProgress.i.user = {}
    const config = {
      method: 'GET',
      url: DCCCommonServer.managerAddressAPI + 'user/property',
      params: {
        propertyTitle: `prognosis%`,
      },
      withCredentials: true
    }
    let properties
    let prognosisList = {}
    await axios(config)
      .then(function (endpointResponse) {
        properties = endpointResponse.data.userProperty
      })
      .catch(function (error) {
        console.log(error)
      })
    for (let prop of properties) {
      PrognosisProgress.i.user[prop.title] = prop.value
    }
    MessageBus.i.publish('data/progn.info/ready')
  }

  async getStars (progressInfo) {
    let stars = 0
    for (let i = 1; i <= progressInfo[`prognosis-highest-lvl`]; i++) {
      let diffCalc = progressInfo[`prognosis-lvl-${i}-best-guess`]
      let overviewTxt = progressInfo[`prognosis-lvl-${i}-pacient`]
      let bestProgn = progressInfo[`prognosis-lvl-${i}-best-progn`]
      let perfectValue = progressInfo[`prognosis-lvl-${i}-perfect`]
      let bestScenario = false
      let lvlCompleted = false
      if((bestProgn == perfectValue) && (bestProgn != null && perfectValue != null)){
        bestScenario = true
      }else{
        bestScenario = false
      }
      if(bestProgn == null || perfectValue == null){
        lvlCompleted = false
      }else {
        lvlCompleted = true
      }

      let accuracy = this.checkAccuracy(diffCalc, 10)
      if(bestScenario)
        stars++
      if(accuracy == 'Na mosca!')
        stars++
      if(lvlCompleted)
        stars++
    }
    for (let i = 1; i <= progressInfo[`prognosis-challenge1-highest-lvl`]; i++) {
      let diffCalc = progressInfo[`prognosis-challenge1-lvl-${i}-best-guess`]
      let lvlCompleted = false
      if(diffCalc == null){
        lvlCompleted = false
      }else {
        lvlCompleted = true
      }

      let accuracy = this.checkAccuracy(diffCalc, 10)
      let lvlSuccess = []
      if(accuracy == 'Na mosca!')
        stars++
      if(lvlCompleted)
        stars++
    }
    PrognosisProgress.i.user.starQuant = stars
    return stars
  }

  async listLvlProgress (){
    let prognosisList = PrognosisProgress.i.user
    const progressWrapper = document.querySelector('#progn-lvl-progress-wrapper')
    const highestLvl = prognosisList[`prognosis-highest-lvl`]
    const successColor = 'bg-success text-light'
    const failColor = 'bg-secondary text-dark'

    progressWrapper.innerHTML = ''
    /* function checkAccuracy(diff){
    //   if(diff!=null){
    //     if(diff > 10){
    //       return 'Super estimado.'
    //
    //     }else if (diff < -10) {
    //       return 'Sub estimado.'
    //
    //     }else if (diff <= 10 && diff >= -10) {
    //       return 'Na mosca!'
    //
    //     }
    // }else{
    //   return 'Incompleto'
    // }
    // }
    // function stars(success, max, half){
    //
    //   let resultStar = ''
    //   if(success.length == max){
    //     resultStar = `<i class="fas fa-star prognosis-perfect-prog"></i><i class="fas fa-star prognosis-perfect-prog"></i><i class="fas fa-star prognosis-perfect-prog"></i>`
    //   }else if (success.length <= half && success.length>=1 && success.length<max) {
    //     for (let i = 0; i < success.length; i++) {
    //       resultStar += `<i class="fas fa-star prognosis-half-prog"></i>`
    //     }
    //     for (let i = 0; i < (max - success.length); i++) {
    //       resultStar += `<i class="far fa-star prognosis-half-prog"></i>`
    //     }
    //
    //   }else{
    //     resultStar = `<i class="far fa-star prognosis-bad-prog"></i><i class="far fa-star prognosis-bad-prog"></i><i class="far fa-star prognosis-bad-prog"></i>`
    //   }
    //   return resultStar
    //   // <i class="fas fa-star prognosis-perfect-prog"></i>
    //   // <i class="fas fa-star-half-alt prognosis-half-prog"></i>
    //   // <i class="far fa-star prognosis-bad-prog"></i>
     }*/
    function lastAvailable (wrapper, highest){
      let template = document.createElement('template')
      if(highestLvl == '10'){
        let diffCalc = prognosisList[`prognosis-lvl-10-best-guess`]
        let overviewTxt = prognosisList[`prognosis-lvl-10-pacient`]
        let bestProgn = prognosisList[`prognosis-lvl-10-best-progn`]
        let perfectValue = prognosisList[`prognosis-lvl-10-perfect`]
        let bestScenario = false
        let lvlCompleted = false
        if((bestProgn == perfectValue) && (bestProgn != null && perfectValue != null)){
          bestScenario = true
        }else{
          bestScenario = false
        }
        if(bestProgn == null || perfectValue == null){
          lvlCompleted = false
        }else {
          lvlCompleted = true
        }

        let accuracy = PrognosisProgress.i.checkAccuracy(diffCalc, 10)
        let lvlSuccess = []

        if(bestScenario)
          lvlSuccess.push(true)
        if(accuracy == 'Na mosca!')
          lvlSuccess.push(true)
        if(lvlCompleted)
          lvlSuccess.push(true)

        template.innerHTML = PrognosisProgress.lvlContainer
          .replace(/\[containerColor\]/ig, 'bg-dark')
          .replace(/\[currentLvl\]/ig, '10')
          .replace(/\[progress\]/ig, lvlCompleted?'Completo':'Em aberto')
          .replace(/\[progressColor\]/ig, lvlCompleted?successColor:'bg-warning text-dark')
          .replace(/\[pacientOverviewTxt\]/ig, overviewTxt)
          .replace(/\[bestPacient\]/ig, bestScenario?'Sim':'Não')
          .replace(/\[bestPacientColor\]/ig, bestScenario?successColor:failColor)
          .replace(/\[correctPrognosis\]/ig, accuracy)
          .replace(/\[correctPrognosisColor\]/ig, (accuracy == 'Na mosca!'?successColor:failColor))
          .replace(/\[starPoints\]/ig, PrognosisProgress.i.stars(lvlSuccess, 3, 2))
          .replace(/\[overviewPart\]/ig, PrognosisProgress.overviewTxt
                                          .replace(/\[currentLvl\]/ig, '10')
                                          .replace(/\[pacientOverviewTxt\]/ig, overviewTxt))
      }else {
        template.innerHTML = PrognosisProgress.lvlContainer
          .replace(/\[containerColor\]/ig, 'bg-light')
          .replace(/\[currentLvl\]/ig, highest)
          .replace(/\[progress\]/ig, 'Em aberto')
          .replace(/\[progressColor\]/ig, 'text-dark bg-warning')
          .replace(/\[pacientOverviewTxt\]/ig, '')
          .replace(/\[bestPacient\]/ig, '')
          .replace(/\[bestPacientColor\]/ig, failColor)
          .replace(/\[correctPrognosis\]/ig, '')
          .replace(/\[correctPrognosisColor\]/ig, failColor)
          .replace(/\[starPoints\]/ig, stars([], 3, 2))
          .replace(/\[overviewPart\]/ig, '')
      }
      wrapper.appendChild(template.content.cloneNode(true))
    }
    /*function lockedLvls (wrapper, highest){
      let i = parseInt(highest)+1
      for (i; i <= 10; i++) {
        let template = document.createElement('template')
        template.innerHTML = PrognosisProgress.lvlContainerLocked
          .replace(/\[difficulty\]/ig, i)
        wrapper.appendChild(template.content.cloneNode(true))
      }

    }*/

    for (var i = 1; i <= highestLvl; i++) {
      let diffCalc = prognosisList[`prognosis-lvl-${i}-best-guess`]
      let overviewTxt = prognosisList[`prognosis-lvl-${i}-pacient`]
      let bestProgn = prognosisList[`prognosis-lvl-${i}-best-progn`]
      let perfectValue = prognosisList[`prognosis-lvl-${i}-perfect`]
      let bestScenario = false
      let lvlCompleted = false
      if((bestProgn == perfectValue) && (bestProgn != null && perfectValue != null)){
        bestScenario = true
      }else{
        bestScenario = false
      }
      if(bestProgn == null || perfectValue == null){
        lvlCompleted = false
      }else {
        lvlCompleted = true
      }

      let accuracy = this.checkAccuracy(diffCalc, 10)
      let lvlSuccess = []

      if(bestScenario)
        lvlSuccess.push(true)
      if(accuracy == 'Na mosca!')
        lvlSuccess.push(true)
      if(lvlCompleted)
        lvlSuccess.push(true)

      let template = document.createElement('template')
      template.innerHTML = PrognosisProgress.lvlContainer
        .replace(/\[containerColor\]/ig, 'bg-dark')
        .replace(/\[currentLvl\]/ig, i)
        .replace(/\[progress\]/ig, lvlCompleted?'Completo':'Em aberto')
        .replace(/\[progressColor\]/ig, lvlCompleted?successColor:'bg-warning text-dark')
        .replace(/\[pacientOverviewTxt\]/ig, overviewTxt)
        .replace(/\[bestPacient\]/ig, bestScenario?'Sim':'Não')
        .replace(/\[bestPacientColor\]/ig, bestScenario?successColor:failColor)
        .replace(/\[correctPrognosis\]/ig, accuracy)
        .replace(/\[correctPrognosisColor\]/ig, (accuracy == 'Na mosca!'?successColor:failColor))
        .replace(/\[starPoints\]/ig, this.stars(lvlSuccess, 3, 2))
        .replace(/\[overviewPart\]/ig, PrognosisProgress.overviewTxt
                                        .replace(/\[currentLvl\]/ig, i)
                                        .replace(/\[pacientOverviewTxt\]/ig, overviewTxt))
      progressWrapper.appendChild(template.content.cloneNode(true))
    }

    // lastAvailable(progressWrapper, highestLvl)
    this.lockedLvls(progressWrapper, highestLvl, 10)

  }

  checkAccuracy(diff, range){
    if(diff!=null){
      if(diff > range){
        return 'Super estimado.'

      }else if (diff < -range) {
        return 'Sub estimado.'

      }else if (diff <= range && diff >= -range) {
        return 'Na mosca!'

      }
  }else{
    return 'Incompleto'
  }
  }
  stars(success, max, half){

    let resultStar = ''
    if(success.length == max){
      for (let i = 0; i < max; i++) {
        resultStar += `<i class="fas fa-star prognosis-perfect-prog"></i>`
      }
      // resultStar = `<i class="fas fa-star prognosis-perfect-prog"></i><i class="fas fa-star prognosis-perfect-prog"></i><i class="fas fa-star prognosis-perfect-prog"></i>`
    }else if (success.length <= half && success.length>=1 && success.length<max) {
      for (let i = 0; i < success.length; i++) {
        resultStar += `<i class="fas fa-star prognosis-half-prog"></i>`
      }
      for (let i = 0; i < (max - success.length); i++) {
        resultStar += `<i class="far fa-star prognosis-half-prog"></i>`
      }

    }else{
      for (let i = 0; i < max; i++) {
        resultStar += `<i class="far fa-star prognosis-bad-prog"></i>`
      }
      // resultStar = `<i class="far fa-star prognosis-bad-prog"></i><i class="far fa-star prognosis-bad-prog"></i><i class="far fa-star prognosis-bad-prog"></i>`
    }
    return resultStar
  }
  lockedLvls (wrapper, highest, limitLvl){
    let i = parseInt(highest)+1
    for (i; i <= limitLvl; i++) {
      let template = document.createElement('template')
      template.innerHTML = PrognosisProgress.lvlContainerLocked
        .replace(/\[difficulty\]/ig, i)
      wrapper.appendChild(template.content.cloneNode(true))
    }

  }

  async listChOneProgress (){
    let prognosisList = PrognosisProgress.i.user
    const progressWrapper = document.querySelector('#progn-lvl-progress-wrapper')
    const highestLvl = prognosisList[`prognosis-challenge1-highest-lvl`] || 0
    const limitLvl = 10
    const successColor = 'bg-success text-light'
    const failColor = 'bg-secondary text-dark'

    progressWrapper.innerHTML = ''
    for (let i = 1; i <= highestLvl; i++) {
      let diffCalc = prognosisList[`prognosis-challenge1-lvl-${i}-best-guess`]
      let overviewTxt = prognosisList[`prognosis-challenge1-lvl-${i}-pacient`]
      let lvlCompleted = false
      if(diffCalc == null){
        lvlCompleted = false
      }else {
        lvlCompleted = true
      }

      let accuracy = this.checkAccuracy(diffCalc, 10)
      let lvlSuccess = []

      // if(bestScenario)
      //   lvlSuccess.push(true)
      if(accuracy == 'Na mosca!')
        lvlSuccess.push(true)
      if(lvlCompleted)
        lvlSuccess.push(true)

      let template = document.createElement('template')
      template.innerHTML = PrognosisProgress.chLvlContainer
        .replace(/\[gameMode\]/ig, 'challenge/1')
        .replace(/\[containerColor\]/ig, 'bg-dark')
        .replace(/\[currentLvl\]/ig, i)
        .replace(/\[progress\]/ig, lvlCompleted?'Completo':'Em aberto')
        .replace(/\[progressColor\]/ig, lvlCompleted?successColor:'bg-warning text-dark')
        .replace(/\[pacientOverviewTxt\]/ig, overviewTxt)
        .replace(/\[correctPrognosis\]/ig, accuracy)
        .replace(/\[correctPrognosisColor\]/ig, (accuracy == 'Na mosca!'?successColor:failColor))
        .replace(/\[starPoints\]/ig, this.stars(lvlSuccess, 2, 1))
        .replace(/\[overviewPart\]/ig, PrognosisProgress.overviewTxt
                                        .replace(/\[currentLvl\]/ig, i)
                                        .replace(/\[pacientOverviewTxt\]/ig, overviewTxt))
      progressWrapper.appendChild(template.content.cloneNode(true))
    }
    this.lockedLvls(progressWrapper, highestLvl, limitLvl)
  }

  async listChTwoProgress (){
    let prognosisList = PrognosisProgress.i.user
    const progressWrapper = document.querySelector('#progn-lvl-progress-wrapper')
    const highestLvl = prognosisList[`prognosis-challenge2-highest-lvl`] || 0
    const limitLvl = 10
    const successColor = 'bg-success text-light'
    const failColor = 'bg-secondary text-dark'

    progressWrapper.innerHTML = ''
    for (let i = 1; i <= highestLvl; i++) {
      let prognRange = prognosisList[`prognosis-challenge2-lvl-${i}-range`]
      let overviewTxt = prognosisList[`prognosis-challenge2-lvl-${i}-pacient`]
      let bestProgn = prognosisList[`prognosis-challenge2-lvl-${i}-best-progn`]
      let perfectValue = prognosisList[`prognosis-challenge2-lvl-${i}-perfect`]
      let bestScenario = false
      let lvlCompleted = false
      if((bestProgn == perfectValue) && (bestProgn != null && perfectValue != null)){
        bestScenario = true
      }else{
        bestScenario = false
      }
      if(bestProgn == null){
        lvlCompleted = false
      }else {
        lvlCompleted = true
      }
      let accuracy
      if(prognRange){
        prognRange = prognRange.split('-')
        accuracy = Prognosis.i.calcPrognRange(parseInt(prognRange[0]),parseInt(prognRange[1]), parseFloat(bestProgn))
      }else{
        accuracy = 'Incompleto'
      }
      let lvlSuccess = []
      if(accuracy.includes('Na mosca!')){
        lvlSuccess.push(true)
        accuracy = 'Na mosca!'
      }
      if(lvlCompleted)
        lvlSuccess.push(true)

      let template = document.createElement('template')
      template.innerHTML = PrognosisProgress.chLvlContainer
        .replace(/\[gameMode\]/ig, 'challenge/2')
        .replace(/\[containerColor\]/ig, 'bg-dark')
        .replace(/\[currentLvl\]/ig, i)
        .replace(/\[progress\]/ig, lvlCompleted?'Completo':'Em aberto')
        .replace(/\[progressColor\]/ig, lvlCompleted?successColor:'bg-warning text-dark')
        .replace(/\[pacientOverviewTxt\]/ig, overviewTxt)
        .replace(/\[correctPrognosis\]/ig, accuracy)
        .replace(/\[correctPrognosisColor\]/ig, (accuracy.includes('Na mosca!')?successColor:failColor))
        .replace(/\[starPoints\]/ig, this.stars(lvlSuccess, 2, 1))
        .replace(/\[overviewPart\]/ig, PrognosisProgress.overviewTxt
                                        .replace(/\[currentLvl\]/ig, i)
                                        .replace(/\[pacientOverviewTxt\]/ig, overviewTxt))
      progressWrapper.appendChild(template.content.cloneNode(true))
    }
    this.lockedLvls(progressWrapper, highestLvl, limitLvl)
  }

}
(function() {
  PrognosisProgress.i = new PrognosisProgress()
  PrognosisProgress.overviewTxt = `
  <button type="button" class="col-3 btn btn-warning w-100 mb-2" data-toggle="modal" data-target="#pacient-overview-modal-[currentLvl]"><i class="far fa-address-card"></i></button>
  <div class="modal fade" id="pacient-overview-modal-[currentLvl]" tabindex="-1" role="dialog" aria-labelledby="pacient-overview" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Resumo do último paciente</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          [pacientOverviewTxt]
        </div>
      </div>
    </div>
  </div>`
  PrognosisProgress.lvlContainer = `
  <div class="progn-lvl-progress col-lg-3 col-md-5 col-12 m-1 pt-2 [containerColor] border border-light rounded">
    <h5 class="mb-1 text-secondary" style="color:#808080; font-weight: bold;">Dificuldade: [currentLvl]</h5>
    <h5 class="mb-1 [progressColor] rounded">Progresso: [progress]</h5>
    <h5 class="mb-1 [correctPrognosisColor] rounded">Acertou prognóstico?<br> [correctPrognosis]</h5>
    <h5 class="mb-1 [bestPacientColor] rounded">Criou o melhor cenário possível?<br> [bestPacient]</h5>
    <h5 class="mb-1 text-center text-dark rounded bg-secondary">[starPoints]</h5>
    <div class="row">
      <button type="button" class="col btn btn-info w-100 mb-2" onclick="document.location.href='/prognosis/learn/player?diffic=[currentLvl]'"><i class="fas fa-play"></i></button>
      [overviewPart]
    </div>

  </div>
  `
  PrognosisProgress.chLvlContainer = `
  <div class="progn-lvl-progress col-lg-3 col-md-5 col-12 m-1 pt-2 [containerColor] border border-light rounded">
    <h5 class="mb-1 text-secondary" style="color:#808080; font-weight: bold;">Dificuldade: [currentLvl]</h5>
    <h5 class="mb-1 [progressColor] rounded">Progresso: [progress]</h5>
    <h5 class="mb-1 [correctPrognosisColor] rounded">Acertou prognóstico?<br> [correctPrognosis]</h5>
    <h5 class="mb-1 text-center text-dark rounded bg-secondary">[starPoints]</h5>
    <div class="row">
      <button type="button" class="col btn btn-info w-100 mb-2" onclick="document.location.href='/prognosis/[gameMode]?diffic=[currentLvl]'"><i class="fas fa-play"></i></button>
      [overviewPart]
    </div>

  </div>
  `
  PrognosisProgress.lvlContainerLocked = `
  <div class="progn-lvl-progress col-lg-3 col-md-5 col-12 m-1 pt-2 disabled-look rounded">
    <div class="position-absolute" style="top:10%; left:43%; font-size: 3rem !important;">
      <i class="fas fa-lock"></i>
    </div>
    <h5 class="mb-1 text-secondary" style="color:#808080; font-weight: bold;">Dificuldade: [difficulty]</h5>
    <h5 class="mb-1 rounded bg-secondary">Progresso: Incompleto</h5>
  </div>`
})()

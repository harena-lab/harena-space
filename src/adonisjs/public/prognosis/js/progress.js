 class PrognosisProgress {
  constructor() {
    this.start = this.start.bind(this)
    MessageBus.int.subscribe('control/dhtml/ready', this.start)
  }

  async start(){
    this.listLvlProgress()

  }

  async listLvlProgress (){


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
    for (var prop of properties) {
      prognosisList[prop.title] = prop.value
    }
    const progressWrapper = document.querySelector('#progn-lvl-progress-wrapper')
    const highestLvl = prognosisList[`prognosis-highest-lvl`]
    const successColor = 'bg-success text-light'
    const failColor = 'bg-secondary text-dark'

    function checkAccuracy(diff){
      if(diff > 10){
        return 'Super estimado.'

      }else if (diff < -10) {
        return 'Sub estimado.'

      }else if (diff <= 10 && diff >= -10) {
        return 'Na mosca!'

      }
    }
    function stars(success, max, half){

      let resultStar = ''
      if(success.length == max){
        resultStar = `<i class="fas fa-star prognosis-perfect-prog"></i><i class="fas fa-star prognosis-perfect-prog"></i><i class="fas fa-star prognosis-perfect-prog"></i>`
      }else if (success.length <= half && success.length>1) {
        for (let i = 0; i < success.length; i++) {
          resultStar += `<i class="fas fa-star prognosis-half-prog"></i>`
        }
        for (let i = 0; i < (max - success.length); i++) {
          resultStar += `<i class="far fa-star prognosis-half-prog"></i>`
        }

      }else{
        resultStar = `<i class="far fa-star prognosis-bad-prog"></i><i class="far fa-star prognosis-bad-prog"></i><i class="far fa-star prognosis-bad-prog"></i>`
      }
      return resultStar
      // <i class="fas fa-star prognosis-perfect-prog"></i>
      // <i class="fas fa-star-half-alt prognosis-half-prog"></i>
      // <i class="far fa-star prognosis-bad-prog"></i>
    }
    function lastAvailable (wrapper, highest){
      let template = document.createElement('template')
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
      wrapper.appendChild(template.content.cloneNode(true))
    }
    function lockedLvls (wrapper, highest){
      let i = parseInt(highest)+1
      for (i; i <= 10; i++) {
        let template = document.createElement('template')
        template.innerHTML = PrognosisProgress.lvlContainerLocked
          .replace(/\[difficulty\]/ig, i)
        wrapper.appendChild(template.content.cloneNode(true))
      }

    }

    for (let i = 1; i < highestLvl; i++) {
      let diffCalc = prognosisList[`prognosis-lvl-${i}-best-guess`]
      let overviewTxt = prognosisList[`prognosis-lvl-${i}-pacient`]
      let bestProgn = prognosisList[`prognosis-lvl-${i}-best-progn`]
      let perfectValue = prognosisList[`prognosis-lvl-${i}-perfect`]

      let accuracy = checkAccuracy(diffCalc)
      let lvlSuccess = [true]
      if(bestProgn == perfectValue)
        lvlSuccess.push(true)
      if(accuracy == 'Na mosca!')
        lvlSuccess.push(true)

      let template = document.createElement('template')
      template.innerHTML = PrognosisProgress.lvlContainer
        .replace(/\[containerColor\]/ig, 'bg-dark')
        .replace(/\[currentLvl\]/ig, i)
        .replace(/\[progress\]/ig, 'Completo')
        .replace(/\[progressColor\]/ig, 'text-light bg-success')
        .replace(/\[pacientOverviewTxt\]/ig, overviewTxt)
        .replace(/\[bestPacient\]/ig, (bestProgn == perfectValue?'Sim':'Não'))
        .replace(/\[bestPacientColor\]/ig, bestProgn == perfectValue?successColor:failColor)
        .replace(/\[correctPrognosis\]/ig, accuracy)
        .replace(/\[correctPrognosisColor\]/ig, (accuracy == 'Na mosca!'?successColor:failColor))
        .replace(/\[starPoints\]/ig, stars(lvlSuccess, 3, 2))
        .replace(/\[overviewPart\]/ig, PrognosisProgress.overviewTxt
                                        .replace(/\[currentLvl\]/ig, i)
                                        .replace(/\[pacientOverviewTxt\]/ig, overviewTxt))
      progressWrapper.appendChild(template.content.cloneNode(true))
    }

    lastAvailable(progressWrapper, highestLvl)
    lockedLvls(progressWrapper, highestLvl)

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
          <h5 class="modal-title">Resumo do paciente</h5>
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
  PrognosisProgress.lvlContainerLocked = `
  <div class="progn-lvl-progress col-lg-3 col-md-5 col-12 m-1 pt-2 disabled-look rounded">
    <div class="position-absolute" style="top:10%; left:43%; font-size: 3rem !important;">
      <i class="fas fa-lock"></i>
    </div>
    <h5 class="mb-1 text-secondary" style="color:#808080; font-weight: bold;">Dificuldade: [difficulty]</h5>
    <h5 class="mb-1 rounded bg-secondary">Progresso: Incompleto</h5>
  </div>`
})()

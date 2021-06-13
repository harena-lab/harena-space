 class PrognosisProgress {
  constructor() {
    this.start = this.start.bind(this)
    MessageBus.int.subscribe('control/dhtml/ready', this.start)
  }

  async start(){
    this.listLvlProgress()

  }

  async listLvlProgress (){
    const progressWrapper = document.querySelector('#progn-lvl-progress-wrapper')
    const lvlProgress = document.querySelector('#current-lvl').value
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
      // console.log(prognosisList)
    // console.log(properties)
    for (let i = 1; i < lvlProgress; i++) {
      let template = document.createElement('template')
      template.innerHTML = PrognosisProgress.lvlContainer
        .replace(/\[currentLvl\]/ig, i)
        .replace(/\[progress\]/ig, 'Completo')
        .replace(/\[pacientOverviewTxt\]/ig, prognosisList[`prognosis-lvl-${i}-pacient`])
        // .replace(/\[starPoints\]/ig, i)
        .replace(/\[bestPacient\]/ig, prognosisList[`prognosis-lvl-${i}-best-progn`])
        .replace(/\[correctPrognosis\]/ig, this.prognAccuracy(prognosisList[`prognosis-lvl-${i}-best-guess`]))
      progressWrapper.appendChild(template.content.cloneNode(true))
    }

  }

}
(function() {
  PrognosisProgress.i = new PrognosisProgress()
  PrognosisProgress.lvlContainer = `
  <div class="progn-lvl-progress col-lg-3 col-md-5 col-12 m-1 pt-2 bg-dark border border-light rounded">
    <h5 class="mb-1 text-secondary" style="color:#808080; font-weight: bold;">Dificuldade: [currentLvl]</h5>
    <h5 class="mb-1 bg-secondary">Progresso: [progress]</h5>
    <h5 class="mb-1 bg-secondary">Acertou prognóstico? [correctPrognosis]</h5>
    <h5 class="mb-1 bg-secondary">Criou o melhor cenário possível? [bestPacient]</h5>
    <h5 class="mb-1 bg-secondary">Pontuação: [starPoints]</h5>
    <div class="row">
      <button type="button" class="col btn btn-info w-100 mb-2" onclick="document.location.href='/prognosis/learn/player?diffic=[currentLvl]'"><i class="fas fa-play"></i></button>
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
      </div>
    </div>

  </div>
  `
})()

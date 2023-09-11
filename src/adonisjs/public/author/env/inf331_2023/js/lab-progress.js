 class labProgressManager {
  constructor() {
    function hourExpiration(_date, increment){
      _date.setTime(_date.getTime() + (increment*60*60*1000))
      return _date
    }
    // this.labRelease = {1:new Date('2023/08/31'),2:new Date('2023/09/06'),
    // 3:new Date('2023/09/06'),4:new Date('2023/09/13'),
    // 5:new Date('2023/09/20'),6:new Date('2023/09/27')}
    this.labRelease = {1:this.setDateToISO(hourExpiration(new Date('2023/09/05 GMT-0300'),13)),2:this.setDateToISO(hourExpiration(new Date('2023/09/05 GMT-0300'),14)),
    3:this.setDateToISO(hourExpiration(new Date('2023/09/11 GMT-0300'),14)),4:this.setDateToISO(hourExpiration(new Date('2023/09/13 GMT-0300'),18)),
    5:this.setDateToISO(hourExpiration(new Date('2023/09/20 GMT-0300'),18)),6:this.setDateToISO(hourExpiration(new Date('2023/09/27 GMT-0300'),18))}
    this.labExpiration = {1:this.setDateToISO(hourExpiration(new Date('2023/09/09 GMT-0300'),23)), 2:this.setDateToISO(hourExpiration(new Date('2023/09/16 GMT-0300'),23)),
    3:this.setDateToISO(hourExpiration(new Date('2023/09/16 GMT-0300'),23)),4:this.setDateToISO(hourExpiration(new Date('2023/09/23 GMT-0300'),23)),
    5:this.setDateToISO(hourExpiration(new Date('2023/09/30 GMT-0300'),23)),6:this.setDateToISO(hourExpiration(new Date('2023/10/06 GMT-0300'),23))}
    this.start = this.start.bind(this)
    MessageBus.i.subscribe('control/html/ready', this.start)
  }

  setDateToISO(date){
    return new Date(date.toISOString())
  }

  async start(){
    MessageBus.i.unsubscribe('control/dhtml/ready', this.start)
    // await this.getPrognosisUserInfo()
    // console.log('getting lab user info...')
    await this.getLabUserInfo()
    // console.log('Lab user info completed...')
    // console.log(labProgressManager.i.lab)
    if(document.querySelector('#lab-progress-wrapper')){
      this.listLabProgress()

    }


  }
  async getCaseProperties (id){
    const config = {
      method: 'GET',
      url: DCCCommonServer.managerAddressAPI + 'case',
      params: {
        caseId: id,
      },
      withCredentials: true
    }
    let prop
    await axios(config)
      .then(function (endpointResponse) {
        prop = endpointResponse.data.property
      })
      .catch(function (error) {
        console.log(error)
      })
    return prop
  }

  async getLabUserInfo (){
    labProgressManager.i.lab = {}
    const config = {
      method: 'GET',
      url: DCCCommonServer.managerAddressAPI + 'user/cases',
      params: {
        clearance: 5,
        fSearchStr: 'INF 331 - Laboratório',
        page: 1,
        nItems: 30,
      },
      withCredentials: true
    }
    let labList
    let prognosisList = {}
    await axios(config)
      .then(function (endpointResponse) {
        labList = endpointResponse.data.cases
      })
      .catch(function (error) {
        console.log(error)
      })
    for (let lab of labList) {
      let propsLab = await this.getCaseProperties(lab.id)
      let extendPeriod = null
      let property = null
      if ('complete' in propsLab){
        property = propsLab['complete']
      }else{
        property = null
      }
      if ('extendPeriod' in propsLab){
        extendPeriod = new Date((propsLab['extendPeriod']))
      }else{
        extendPeriod = null
      }
      if (lab.title == lab.description && lab.title == lab.keywords){
        labProgressManager.i.lab[lab.title.substring(lab.title.length-1)] = {'id':lab.id,'desc':lab.description,'keywords':lab.keywords,'property':property, 'extendPeriod':extendPeriod}
      }else if (lab.description == lab.keywords){
        labProgressManager.i.lab[lab.description.substring(lab.description.length-1)] = {'id':lab.id,'desc':lab.description,'keywords':lab.keywords,'property':property, 'extendPeriod':extendPeriod}
      }
    }
    MessageBus.i.publish('data/lab.info/ready')
  }

  /*async createLab (labNumber){
    const config = {
      method: 'POST',
      url: DCCCommonServer.managerAddressAPI + '/case',
      params: {
        title: `INF 331 - Laboratório ${labNumber}`,
        source: labMarkdown,
        description: `INF 331 - Laboratório ${labNumber}`,
        language: 'pt-BR',
        // domain: '',
        // specialty: '',
        keywords: `INF 331 - Laboratório ${labNumber}`,
        creationDate: new Date().toJSON().slice(0,10).replace(/-/g,'/'),
        institution: sessionStorage.getItem('harena-user-institution'),
        // complexity: '',

      },
      withCredentials: true
    }
    let labList
    let prognosisList = {}
    await axios(config)
      .then(function (endpointResponse) {
        labList = endpointResponse.data.cases
      })
      .catch(function (error) {
        console.log(error)
      })
    for (let lab of labList) {
      labProgressManager.i.lab[lab.title.substring(lab.title.length-1)] = lab.id
    }
    MessageBus.i.publish('data/lab.info/ready')
  }*/

  noticeModalContent (txtClass, bodyClass, txt, closeTime){
    $('#notice-modal').modal('show')
    let txtModal = document.querySelector(`#modal-notice-txt`)
    let modalBody = document.querySelector(`#modal-notice-body`)
    modalBody.className = modalBody.className.replace(/bg-+?/g, '')
    txtModal.className = txtModal.className.replace(/text-+?/g, '')

    modalBody.classList.add(bodyClass)
    txtModal.classList.add(txtClass)
    txtModal.innerHTML = txt

    if(closeTime != null && closeTime > 0){
      setTimeout(function(){
        $('#notice-modal').modal('hide')
      }, closeTime)
    }
  }
  prependZero (number){
    if (number <10){
      if (number < 0 && number >-10){
        number = '-0'+Math.abs(number)
      }else if (number >-10) {
        number = '0'+number
      }

    }
    return number
  }

  convertTzBrt(date){
    const convertedDate = date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo',hour12:false })
    return convertedDate
  }

  convertToLocalTz(date, _locale){
    let convertedT = new Date(date.toUTCString())

    if (_locale == 'string'){
      convertedT = date.toLocaleString('pt-BR',{hour12:false})
    }else if (_locale == 'date'){
      convertedT = new Date(date.toLocaleString('pt-BR',{hour12:false}))
    }

    return convertedT
  }

  getDateString(date){
    return date.toLocaleDateString('pt-BR', { hour12:false })
  }

  getTimeString(date){
    return date.toLocaleTimeString('pt-BR',{hour12:false})
  }

  async lockedLvls (wrapper, highest, limitLvl){
    console.log(highest);
    let i = parseInt(highest+1  )
    let released = true
    for (i; i <= limitLvl; i++) {
      // let labTemplate = await MessageBus.i.request(
      //   'data/template/' + `labs/lab_${i}`.replace(/\//g, '.') +
      //     '/get', {static: false}, null, true)
      // if (labTemplate.message.code == 404){
      //   released = false
      // }
      let template = document.createElement('template')
      template.innerHTML = labProgressManager.lvlContainerLocked
        .replace(/\[difficulty\]/ig, i)
        .replace(/\[labRelease\]/ig, `${this.convertToLocalTz(this.labRelease[i],'string')}`)
        .replace(/\[labText\]/ig, 'Ainda não publicado...')
      wrapper.appendChild(template.content.cloneNode(true))
    }

  }

  async listLabProgress (){
    let labList = labProgressManager.i.lab
    const progressWrapper = document.querySelector('#lab-progress-wrapper')
    const successColor = 'bg-lab-dark text-lab-primary'
    const failColor = 'bg-lab-light text-lab-dark'
    let labCompleted = false
    let labDelivered = false
    let labLastEdit = null
    let labExtended = false
    let labExpired = false
    let pastRelease = false
    const highestLab = Object.keys(labList).length
    // let nLabReleased = 0
    const currentDate = new Date()
    // console.log(labProgressManager.i.lab);

    let createdBtn = false
    let released = true
    const lateReleaseTxt = 'Não publicado...(atraso)'
    progressWrapper.innerHTML = ''
    for (var i = 1; i <= Object.keys(this.labRelease).length; i++) {
      labCompleted = false
      labDelivered = false
      labExtended = false
      labExpired = false
      pastRelease = false
      

      if (this.setDateToISO(currentDate) > this.setDateToISO(this.labExpiration[i])){
        labExpired = true
      }
      // console.log(`lab ${i}`,this.setDateToISO(currentDate), this.setDateToISO(this.labRelease[i]));
      if (this.setDateToISO(currentDate) > this.setDateToISO(this.labRelease[i])){
        pastRelease = true
      }

      if (labExpired){
        if (Object.keys(labList).length >= i){
          if (labList[i]['extendPeriod'] != null){
            if((this.setDateToISO((labList[i]['extendPeriod'])) > this.setDateToISO(currentDate))){
              labExtended = true
            }
          }
        }
      }
      
      let labTemplate = await MessageBus.i.request(
        'data/template/' + `labs/lab_${i}`.replace(/\//g, '.') +
          '/get', {static: false}, null, true)
      if (labTemplate.message.code == 404){
        released = false
      }
      createdBtn = false

      let template = document.createElement('template')
      // console.log('============ current greater then release',pastRelease)
      // console.log('============ current date greater then expiration',labExpired)

      if (pastRelease && highestLab >= i){
        if (labProgressManager.i.lab[i]['property'] != null && labProgressManager.i.lab[i]['property'] == '0'){
          labDelivered = true
        }
        // console.log('============ current date and release and highestLab')
        if (released == false){
          // console.log('============ released false')
          template.innerHTML = labProgressManager.lvlContainerLocked
          .replace(/\[difficulty\]/ig, i)
          .replace(/\[labRelease\]/ig, `${this.convertToLocalTz(this.labRelease[i],'string')}`)
          .replace(/\[labText\]/ig, lateReleaseTxt)

        }else if (pastRelease && labExpired && !labExtended){
          // console.log('============ release and expiration greater')
          template.innerHTML = labProgressManager.lvlContainerExpired
          .replace(/\[containerColor\]/ig, 'bg-lab-primary')
          .replace(/\[btnColor\]/ig, 'btn-lab-secondary')
          .replace(/\[labNumber\]/ig, Object.keys(this.labRelease)[i-1])
          .replace(/\[progress\]/ig, 'Fechado')
          .replace(/\[progressColor\]/ig, labCompleted?successColor:'bg-lab-dark text-lab-light')
          .replace(/\[this.labExpirationColor\]/ig, 'bg-lab-dark text-lab-light-pink')
          .replace(/\[this.labExpiration\]/ig,
          `${this.convertToLocalTz(this.labExpiration[i],'string')}`)
          .replace(/\[labDelivered\]/ig, labDelivered?'Sim!':'Não')
          .replace(/\[labDeliveredColor\]/ig, labDelivered?successColor:failColor)
          .replace(/\[labLastEdit\]/ig, labLastEdit)
          .replace(/\[labLastEditColor\]/ig, (failColor))
        }else if (pastRelease && !labExpired || (pastRelease && labExpired && labExtended)){
          if (labExtended){
            template.innerHTML = labProgressManager.lvlContainer
          .replace(/\[containerColor\]/ig, 'bg-lab-primary')
          .replace(/\[btnColor\]/ig, 'btn-lab-primary')
          .replace(/\[labNumber\]/ig, Object.keys(labList)[i-1])
          .replace(/\[progress\]/ig, 'Submissão extendida')
          .replace(/\[progressColor\]/ig, labCompleted?successColor:'bg-lab-dark text-lab-light')
          .replace(/\[this.labExpirationColor\]/ig, 'bg-lab-dark text-lab-light-pink')
          .replace(/\[this.labExpiration\]/ig,
          `${this.convertToLocalTz(labList[i]['extendPeriod'],'string')}`)
          .replace(/\[labDelivered\]/ig, labDelivered?'Sim!':'Não')
          .replace(/\[labDeliveredColor\]/ig, labDelivered?successColor:failColor)
          .replace(/\[labLastEdit\]/ig, labLastEdit)
          .replace(/\[labLastEditColor\]/ig, (failColor))
          .replace(/\[labId\]/ig, labList[i]['id'])
          .replace(/\[buttonIcon\]/ig, 'play')
          }else{
            template.innerHTML = labProgressManager.lvlContainer
            .replace(/\[containerColor\]/ig, 'bg-lab-primary')
            .replace(/\[btnColor\]/ig, 'btn-lab-primary')
            .replace(/\[labNumber\]/ig, Object.keys(this.labRelease)[i-1])
            .replace(/\[progress\]/ig, 'Em aberto')
            .replace(/\[progressColor\]/ig, labCompleted?successColor:'bg-lab-dark text-lab-light')
            .replace(/\[this.labExpirationColor\]/ig, 'bg-lab-dark text-lab-light-pink')
            .replace(/\[this.labExpiration\]/ig,
            `${this.convertToLocalTz(this.labExpiration[i],'string')}`)
            .replace(/\[labDelivered\]/ig, labDelivered?'Sim!':'Não')
            .replace(/\[labDeliveredColor\]/ig, labDelivered?successColor:failColor)
            .replace(/\[labLastEdit\]/ig, labLastEdit)
            .replace(/\[labLastEditColor\]/ig, (failColor))
            .replace(/\[labId\]/ig, labList[i]['id'])
            .replace(/\[buttonIcon\]/ig, 'play')
          }
        }


      }else if(pastRelease && labExpired && !labExtended){
        template.innerHTML = labProgressManager.lvlContainerExpired
        .replace(/\[containerColor\]/ig, 'bg-lab-primary')
        .replace(/\[btnColor\]/ig, 'btn-lab-secondary')
        .replace(/\[labNumber\]/ig, Object.keys(this.labRelease)[i-1])
        .replace(/\[progress\]/ig, 'Fechado')
        .replace(/\[progressColor\]/ig, labCompleted?successColor:'bg-lab-dark text-lab-light')
        .replace(/\[this.labExpirationColor\]/ig, 'bg-lab-dark text-lab-light-pink')
        .replace(/\[this.labExpiration\]/ig,
        `${this.convertToLocalTz(this.labExpiration[i],'string')}`)
        .replace(/\[labDelivered\]/ig, labDelivered?'Sim!':'Não')
        .replace(/\[labDeliveredColor\]/ig, labDelivered?successColor:failColor)
        .replace(/\[labLastEdit\]/ig, labLastEdit)
        .replace(/\[labLastEditColor\]/ig, (failColor))
      }else if (pastRelease){
        if (released == false){
          template.innerHTML = labProgressManager.lvlContainerLocked
          .replace(/\[difficulty\]/ig, i)
          .replace(/\[labRelease\]/ig, `${this.convertToLocalTz(this.labRelease[i],'string')}`)
          .replace(/\[labText\]/ig, lateReleaseTxt)

        }else{
          createdBtn = true
          if (!labExpired || (pastRelease && labExpired && labExtended)){
            if (labExtended){
              template.innerHTML = labProgressManager.lvlContainer
              .replace(/\[containerColor\]/ig, 'bg-lab-primary')
              .replace(/\[btnColor\]/ig, 'btn-lab-primary')
              .replace(/\[labNumber\]/ig, Object.keys(labList)[i-1])
              .replace(/\[progress\]/ig, 'Submissão extendida')
              .replace(/\[progressColor\]/ig, labCompleted?successColor:'bg-lab-dark text-lab-light')
              .replace(/\[this.labExpirationColor\]/ig, 'bg-lab-dark text-lab-light-pink')
              .replace(/\[this.labExpiration\]/ig,
              `${this.convertToLocalTz(labList[i]['extendPeriod'],'string')}`)
              .replace(/\[labDelivered\]/ig, labDelivered?'Sim!':'Não')
              .replace(/\[labDeliveredColor\]/ig, labDelivered?successColor:failColor)
              .replace(/\[labLastEdit\]/ig, labLastEdit)
              .replace(/\[labLastEditColor\]/ig, (failColor))
              .replace(/\[buttonIcon\]/ig, 'plus')
            }else{
              template.innerHTML = labProgressManager.lvlContainer
            .replace(/\[containerColor\]/ig, 'bg-lab-primary')
            .replace(/\[btnColor\]/ig, 'btn-lab-secondary')
            .replace(/\[labNumber\]/ig, Object.keys(this.labRelease)[i-1])
            .replace(/\[progress\]/ig, 'Em aberto')
            .replace(/\[progressColor\]/ig, labCompleted?successColor:'bg-lab-dark text-lab-light')
            .replace(/\[this.labExpirationColor\]/ig, 'bg-lab-dark text-lab-light-pink')
            .replace(/\[this.labExpiration\]/ig,
            `${this.convertToLocalTz(this.labExpiration[i],'string')}`)
            .replace(/\[labDelivered\]/ig, labDelivered?'Sim!':'Não')
            .replace(/\[labDeliveredColor\]/ig, labDelivered?successColor:failColor)
            .replace(/\[labLastEdit\]/ig, labLastEdit)
            .replace(/\[labLastEditColor\]/ig, (failColor))
            .replace(/\[buttonIcon\]/ig, 'plus')
            }
        }
      }
      }else if (!pastRelease){
        template.innerHTML = labProgressManager.lvlContainerLocked
        .replace(/\[difficulty\]/ig, i)
        .replace(/\[labRelease\]/ig, `${this.convertToLocalTz(this.labRelease[i],'string')}`)
        .replace(/\[labText\]/ig, 'Ainda não publicado...')
      }

      progressWrapper.appendChild(template.content.cloneNode(true))

      const fnCreateLab = async function(){
        labProgressManager.i.noticeModalContent ('text-dark','bg-white', 'Configurando laboratório...', 0)
        //Object containing key 'params'.
        //Inside it, needs to contain 'title','description','language','domain','keywords','creationDate','complexity'
        //'category','template'
        let labN = this.id.substring(this.id.length-1)
        const params = {
          'params':{
          'title': `INF 331 - Laboratório ${labN}`,
          'template': `labs/lab_${labN}`,
          'category': 'plain',
          'description': `INF 331 - Laboratório ${labN}`,
          'language': 'pt-BR',
          // 'domain': '',
          // 'specialty': '',
          'keywords': `INF 331 - Laboratório ${labN}`,
          'creationDate': `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`,
          'institution': sessionStorage.getItem('harena-user-institution'),
          // 'complexity': '',
          }
        }
        const labId = await TemplateToCase.s.storeCaseNoUi(params)
        labProgressManager.i.noticeModalContent ('text-white','bg-success', 'Laboratório configurado! Redirecionando...', 3000)
        setTimeout(window.location.href = `/author/env/inf331_2023/lab/?id=${labId['data']}`, 5000)

      }
      if (createdBtn){
        let btnCreateLab = progressWrapper.querySelector(`button[id="btn-lab-${i}"]`)
        btnCreateLab.addEventListener('click',fnCreateLab)
      }else{
        if (progressWrapper.querySelector(`button[id="btn-lab-${i}"]`)){
          let btnLab = progressWrapper.querySelector(`button[id="btn-lab-${i}"]`)
          btnLab.addEventListener('click',function(){window.location.href = `/author/env/inf331_2023/lab/?id=${btnLab.dataset.action}`})
        }
      }

    }
      let template = document.createElement('template')
      /*if(highestLab == '10'){
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

        template.innerHTML = labProgressManager.lvlContainer
          .replace(/\[containerColor\]/ig, 'bg-dark')
          .replace(/\[currentLvl\]/ig, '10')
          .replace(/\[progress\]/ig, lvlCompleted?'Completo':'Em aberto')
          .replace(/\[progressColor\]/ig, lvlCompleted?successColor:'bg-warning text-dark')
          .replace(/\[pacientOverviewTxt\]/ig, overviewTxt)
          .replace(/\[labDelivered\]/ig, bestScenario?'Sim':'Não')
          .replace(/\[labDeliveredColor\]/ig, bestScenario?successColor:failColor)
          .replace(/\[labLastEdit\]/ig, accuracy)
          .replace(/\[labLastEditColor\]/ig, (accuracy == 'Na mosca!'?successColor:failColor))
          .replace(/\[starPoints\]/ig, labProgressManager.i.stars(lvlSuccess, 3, 2))
          .replace(/\[overviewPart\]/ig, labProgressManager.overviewTxt
                                          .replace(/\[currentLvl\]/ig, '10')
                                          .replace(/\[pacientOverviewTxt\]/ig, overviewTxt)
                                          .replace(/\[gameMode\]/ig, 'progn'))
      }else {
        template.innerHTML = labProgressManager.lvlContainer
          .replace(/\[containerColor\]/ig, 'bg-light')
          .replace(/\[currentLvl\]/ig, highestLab)
          .replace(/\[progress\]/ig, 'Em aberto')
          .replace(/\[progressColor\]/ig, 'text-dark bg-warning')
          .replace(/\[pacientOverviewTxt\]/ig, '')
          .replace(/\[labDelivered\]/ig, '')
          .replace(/\[labDeliveredColor\]/ig, failColor)
          .replace(/\[labLastEdit\]/ig, '')
          .replace(/\[labLastEditColor\]/ig, failColor)
          .replace(/\[starPoints\]/ig, stars([], 3, 2))
          .replace(/\[overviewPart\]/ig, '')
      }*/
    /*const prognBusList = document.querySelectorAll('#lab-progress-wrapper [data-bus-entity]')
    for (let el of prognBusList) {
      //TEMPORARY FIX - Generate change for MutationObserver
      el.classList.add('bus')
    }*/

    // lastAvailable(progressWrapper, highestLvl)
    // this.lockedLvls(progressWrapper, highestLab+nLabReleased, 6)

  }

}
(function() {
  labProgressManager.i = new labProgressManager()

  /*

    <h5 class="mb-1 [labLastEditColor] rounded">Última edição: [labLastEdit]</h5>
  */
  labProgressManager.lvlContainer = `
  <div class="progn-lvl-progress col-lg-3 col-md-5 col-12 m-1 pt-2 [containerColor] border border-light rounded">
    <h5 class="mb-1 text-lab-dark" style="color:#808080; font-weight: bold;">Laboratório: [labNumber]</h5>
    <h5 class="mb-1 [progressColor] rounded">Progresso: [progress]</h5>
    <h5 class="mb-1 [this.labExpirationColor] rounded">Data limite: [this.labExpiration]</h5>
    <h5 class="mb-1 [labDeliveredColor] rounded">Entregue: [labDelivered]</h5>
    <div class="row px-3">
      <button type="button" id="btn-lab-[labNumber]" class="col btn [btnColor] w-100 mb-2"
      data-action="[labId]"><i class="fas fa-[buttonIcon]"></i></button>
    </div>

  </div>
  `
  labProgressManager.lvlContainerExpired = `
  <div class="progn-lvl-progress col-lg-3 col-md-5 col-12 m-1 pt-2 [containerColor] disabled-look border border-light rounded">
    <h5 class="mb-1 text-lab-dark" style="color:#808080; font-weight: bold;">Laboratório: [labNumber]</h5>
    <h5 class="mb-1 [progressColor] rounded">Progresso: [progress]</h5>
    <h5 class="mb-1 [this.labExpirationColor] rounded">Data limite: [this.labExpiration]</h5>
    <h5 class="mb-1 [labDeliveredColor] rounded">Entregue: [labDelivered]</h5>
  </div>
  `

  labProgressManager.lvlContainerLocked = `
  <div class="progn-lvl-progress col-lg-3 col-md-5 col-12 m-1 pt-2 disabled-look rounded">
    <h5 class="mb-1 text-lab-dark" style="color:#808080; font-weight: bold;">Laboratório: [difficulty]</h5>
    <h5 class="rounded mb-1 bg-lab-secondary text-lab-light">[labText]</h5>
    <h5 class="rounded mb-3 bg-lab-secondary text-lab-light [this.labExpirationColor] rounded">Lançamento: [labRelease]</h5>
  </div>`
})()

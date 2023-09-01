 class labProgressManager {
  constructor() {
    function hourExpiration(_date, increment){
      _date.setTime(_date.getTime() + (increment*60*60*1000)) 
      return _date
    }
    // this.labRelease = {1:new Date('2023/08/31'),2:new Date('2023/09/06'),
    // 3:new Date('2023/09/06'),4:new Date('2023/09/13'),
    // 5:new Date('2023/09/20'),6:new Date('2023/09/27')}
    this.labRelease = {1:hourExpiration(new Date('2023/08/31'),18),2:hourExpiration(new Date('2023/09/06'),15),
    3:hourExpiration(new Date('2023/09/06'),18),4:hourExpiration(new Date('2023/09/13'),18),
    5:hourExpiration(new Date('2023/09/20'),18),6:hourExpiration(new Date('2023/09/27'),18)}
    this.labExpiration = {1:hourExpiration(new Date('2023/09/07'),8), 2:hourExpiration(new Date('2023/09/09'),8),
    3:hourExpiration(new Date('2023/09/16'),8),4:hourExpiration(new Date('2023/09/23'),8),
    5:hourExpiration(new Date('2023/09/30'),8),6:hourExpiration(new Date('2023/10/06'),8)}
    this.start = this.start.bind(this)
    MessageBus.i.subscribe('control/html/ready', this.start)
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
      if (lab.title == lab.description && lab.title == lab.keywords){
        labProgressManager.i.lab[lab.title.substring(lab.title.length-1)] = {'id':lab.id,'desc':lab.description,'keywords':lab.keywords}
      }else if (lab.description == lab.keywords){
        labProgressManager.i.lab[lab.description.substring(lab.description.length-1)] = {'id':lab.id,'desc':lab.description,'keywords':lab.keywords}
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
      number = '0'+number
    }
    return number
  }

  async lockedLvls (wrapper, highest, limitLvl){
    console.log('locked case',);
    let i = parseInt(highest)
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
        .replace(/\[labRelease\]/ig, `${this.prependZero(this.labRelease[i].getDate())}/${this.prependZero(this.labRelease[i].getMonth()+1)}/${this.labExpiration[i].getFullYear()}
        ${this.prependZero(this.labRelease[i].getHours())}:${this.prependZero(this.labRelease[i].getMinutes())}
        ${this.labRelease[i].getHours() <12? "a.m":"p.m"}`)
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
    const highestLab = Object.keys(labList).length
    const currentDate = new Date()
    let createdBtn = false
    let released = true
    const lateReleaseTxt = 'Não publicado...(atraso)'
    progressWrapper.innerHTML = ''
    for (var i = 1; i <= Object.keys(this.labRelease).length; i++) {
     let labTemplate = await MessageBus.i.request(
        'data/template/' + `labs/lab_${i}`.replace(/\//g, '.') +
          '/get', {static: false}, null, true)
      if (labTemplate.message.code == 404){
        released = false
      }
      createdBtn = false
      let template = document.createElement('template')
      console.log(this.labRelease[i]);
      console.log(highestLab);
      console.log('today',currentDate);
      console.log('release',this.labRelease[i]);
      if (currentDate > this.labRelease[i] && highestLab >= i){
        console.log('has lab created and current date is greater then release');
        if (released == false){
          console.log('has lab created and released false');
          template.innerHTML = labProgressManager.lvlContainerLocked
          .replace(/\[difficulty\]/ig, i)
          .replace(/\[labRelease\]/ig, `${this.prependZero(this.labRelease[i].getDate())}/${this.prependZero(this.labRelease[i].getMonth()+1)}/${this.labExpiration[i].getFullYear()}`)
          .replace(/\[labText\]/ig, lateReleaseTxt)
          
        }else if (currentDate > this.labRelease[i] && currentDate>this.labExpiration[i]){
          console.log('case expired and current date is greater then release');
          template.innerHTML = labProgressManager.lvlContainerExpired
          .replace(/\[containerColor\]/ig, 'bg-lab-primary')
          .replace(/\[btnColor\]/ig, 'btn-lab-secondary')
          .replace(/\[labNumber\]/ig, Object.keys(this.labRelease)[i-1])
          .replace(/\[progress\]/ig, 'Fechado')
          .replace(/\[progressColor\]/ig, labCompleted?successColor:'bg-lab-dark text-lab-light')
          .replace(/\[this.labExpirationColor\]/ig, 'btn-lab-primary text-lab-light-pink')
          .replace(/\[this.labExpiration\]/ig, 
          `${this.prependZero(this.labExpiration[i].getDate())}/${this.prependZero(this.labExpiration[i].getMonth()+1)}/${this.labExpiration[i].getFullYear()} 
          ${this.labExpiration[i].getHours() <10? "0"+ this.labExpiration[i].getHours():this.labExpiration[i].getHours()}:${this.prependZero(this.labExpiration[i].getMinutes())}
          ${this.labExpiration[i].getHours() <12? "a.m":"p.m"}`)
          .replace(/\[labDelivered\]/ig, labDelivered?'Sim':'Não')
          .replace(/\[labDeliveredColor\]/ig, labDelivered?successColor:failColor)
          .replace(/\[labLastEdit\]/ig, labLastEdit)
          .replace(/\[labLastEditColor\]/ig, (failColor))
        }else{
          console.log('elseee');
          template.innerHTML = labProgressManager.lvlContainer
        .replace(/\[containerColor\]/ig, labDelivered?'disabled-look':'bg-lab-primary')
        .replace(/\[btnColor\]/ig, 'btn-lab-primary')
        .replace(/\[labNumber\]/ig, Object.keys(labList)[i-1])
        .replace(/\[progress\]/ig, 'Em aberto')
        .replace(/\[progressColor\]/ig, labCompleted?successColor:'bg-lab-dark text-lab-light')
        .replace(/\[this.labExpirationColor\]/ig, 'btn-lab-primary text-lab-light-pink')
        .replace(/\[this.labExpiration\]/ig, 
        `${this.prependZero(this.labExpiration[i].getDate())}/${this.prependZero(this.labExpiration[i].getMonth()+1)}/${this.labExpiration[i].getFullYear()}
        ${this.prependZero(this.labExpiration[i].getHours())}:${this.prependZero(this.labExpiration[i].getMinutes())}
        ${this.labExpiration[i].getHours() <12? "a.m":"p.m"}`)
        .replace(/\[labDelivered\]/ig, labDelivered?'Sim!':'Não')
        .replace(/\[labDeliveredColor\]/ig, labDelivered?successColor:failColor)
        .replace(/\[labLastEdit\]/ig, labLastEdit)
        .replace(/\[labLastEditColor\]/ig, (failColor))
        .replace(/\[labId\]/ig, labList[i]['id'])
        .replace(/\[buttonIcon\]/ig, 'play')
        }
        

      }else if (currentDate > this.labRelease[i]){
        console.log('doesnt have case');
        if (released == false){
          console.log('released false');
          template.innerHTML = labProgressManager.lvlContainerLocked
          .replace(/\[difficulty\]/ig, i)
          .replace(/\[labRelease\]/ig, `${this.prependZero(this.labRelease[i].getDate())}/${this.prependZero(this.labRelease[i].getMonth()+1)}/${this.labExpiration[i].getFullYear()}`)
          .replace(/\[labText\]/ig, lateReleaseTxt)
          
        }else{
          console.log('released true');
          createdBtn = true
          template.innerHTML = labProgressManager.lvlContainer
          .replace(/\[containerColor\]/ig, 'bg-lab-primary')
          .replace(/\[btnColor\]/ig, 'btn-lab-secondary')
          .replace(/\[labNumber\]/ig, Object.keys(this.labRelease)[i-1])
          .replace(/\[progress\]/ig, 'Em aberto')
          .replace(/\[progressColor\]/ig, labCompleted?successColor:'bg-lab-dark text-lab-light')
          .replace(/\[this.labExpirationColor\]/ig, 'btn-lab-primary text-lab-light-pink')
          .replace(/\[this.labExpiration\]/ig, 
          `${this.prependZero(this.labExpiration[i].getDate())}/${this.prependZero(this.labExpiration[i].getMonth()+1)}/${this.labExpiration[i].getFullYear()}
          ${this.prependZero(this.labExpiration[i].getHours())}:${this.prependZero(this.labExpiration[i].getMinutes())}
          ${this.labExpiration[i].getHours() <12? "a.m":"p.m"}`)
          .replace(/\[labDelivered\]/ig, labDelivered?'Sim':'Não')
          .replace(/\[labDeliveredColor\]/ig, labDelivered?successColor:failColor)
          .replace(/\[labLastEdit\]/ig, labLastEdit)
          .replace(/\[labLastEditColor\]/ig, (failColor))
          .replace(/\[buttonIcon\]/ig, 'plus')
        }
      }
      
      progressWrapper.appendChild(template.content.cloneNode(true))

      const fnCreateLab = async function(){
        console.log('clicked to create lab...');
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
        console.log(labId);
        labProgressManager.i.noticeModalContent ('text-white','bg-success', 'Laboratório configurado! Redirecionando...', 3000)
        setTimeout(window.location.href = `/env/inf331_2023/lab/?id=${labId['data']}`, 5000)

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
    this.lockedLvls(progressWrapper, highestLab+1, 6)

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

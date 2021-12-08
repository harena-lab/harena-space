class PrognosisAvatar {
  constructor() {

    this.preStart = this.preStart.bind(this)
    MessageBus.i.subscribe('control/html/ready', this.preStart)
  }
  async preStart () {
    MessageBus.i.unsubscribe('control/html/ready', this.preStart)
    if(!this._avatarSet)
      this._avatarSet = await PrognosisAvatar.i.avatarSet()
    this.start()
  }

  async start() {

    if(document.querySelector('.character-selection-wrapper') && PrognosisAvatar.i._avatarSet == false){
      const wrapper = document.querySelector('.character-selection-wrapper')
      const template = document.createElement('template')
      template.innerHTML = PrognosisAvatar.avatarSelectionHeader
      wrapper.appendChild(template.content.cloneNode(true))

      await PrognosisAvatar.i.loadAvatarSelection()
      const chooseAvatar = document.querySelectorAll('.character-selection-wrapper img')
      const btnConfirmAvatar = document.querySelector('#btn-confirm-avatar')

      const fnConfirmAvatar = function (){
        // const activeAvatar = document.createElement('input')
        // activeAvatar.type = 'hidden'
        // activeAvatar.id = 'avatar-active'
        // activeAvatar.value = PrognosisAvatar.i._avatarSet
        // wrapper.appendChild(activeAvatar)
        document.querySelector('dcc-submit[bind="submit-prognosis-avatar-player"]')._computeTrigger()
        const avatars = document.querySelectorAll('.character-selection-wrapper img')
        const txtHeader = document.querySelector('.character-selection-wrapper h4')
        txtHeader.textContent = `Bem vindo à Roda da Fortuna, ${PrognosisAvatar.i.getName(PrognosisAvatar.i._avatarActive)}!`
        txtHeader.style.color = '#66c8a8'
        for (let avatar of avatars) {
          if(avatar.dataset.avatarId == PrognosisAvatar.i._avatarActive){
            avatar.style.background = '#2917fb4d'
            avatar.style.width = '75pt'
          }else {
            avatar.classList.add('img-disabled')
          }
        }
        $('#avatar-description-modal').modal('hide')
      }
      btnConfirmAvatar.addEventListener('click', fnConfirmAvatar)
      const fnChooseAvatar = function (){
        const id = this.dataset.avatarId
        const title = document.querySelector('#txt-avatar-title')
        const desc = document.querySelector('#desc-txt')
        const img = document.querySelector('#avatar-img')
        PrognosisAvatar.i._avatarActive = id
        title.textContent = PrognosisAvatar.i.getName(id)
        desc.textContent = PrognosisAvatar.i.getDescription(id)
        img.src = PrognosisAvatar.i.getSrc(id)
        $('#avatar-description-modal').modal('show')
      }
      for (let img of chooseAvatar) {
        img.addEventListener('click', fnChooseAvatar)
      }
    }

    if(document.querySelector('#logoutDropdownBtn') && PrognosisAvatar.i._avatarSet != false){
      const logoutBtn = document.querySelector('#logoutDropdownBtn')
      // PrognosisAvatar.i.changeMenuAvatar(PrognosisAvatar.i._avatarSet, logoutBtn)
    }
  }

  async loadAvatarSelection() {
    const selectionWrapper = document.querySelector('.character-selection-wrapper')
    for (let i = 0; i < Object.keys(PrognosisAvatar.avatarDesc).length; i++) {
      let key = Object.keys(PrognosisAvatar.avatarDesc)
      const template = document.createElement('template')
      template.innerHTML = PrognosisAvatar.avatarSelectionImg
      .replace(/\[id\]/ig, key[i])
      .replace(/\[name\]/ig, PrognosisAvatar.avatarDesc[key[i]]['name'])
      .replace(/\[src\]/ig, PrognosisAvatar.avatarDesc[key[i]]['src'])
      selectionWrapper.appendChild(template.content.cloneNode(true))
    }
  }

  getDescription (avatar) {
    return PrognosisAvatar.avatarDesc[avatar]['desc']
  }
  getName (avatar) {
    return PrognosisAvatar.avatarDesc[avatar]['name']
  }
  getSrc (avatar) {
    return PrognosisAvatar.avatarDesc[avatar]['src']
  }
  async avatarSelection (avatar) {
    this._avatarActive = avatar
  }
  async avatarSet() {

    const config = {
      method: 'GET',
      url: DCCCommonServer.managerAddressAPI + 'user/property',
      params: {
        propertyTitle: `prognosis-avatar-id`,
      },
      withCredentials: true
    }
    let property
    await axios(config)
      .then(function (endpointResponse) {
        if (!endpointResponse.data.userProperty[0])
          return false
        else
          property = endpointResponse.data.userProperty[0]['value']

      })
      .catch(function (error) {
        console.log(error)
      })
      if (property != null) {
        return property
      }else {
        return false
      }
  }

  async changeMenuAvatar (avatar, btn){

    const imgAvatar = PrognosisAvatar.i.getSrc(avatar)
    const img = document.createElement('img')
    img.src = imgAvatar
    img.classList.add('avatar-mini')
    btn.classList.remove('pl-4','pt-1')
    btn.innerHTML = ''
    btn.appendChild(img)
  }
}

(function() {
  PrognosisAvatar.i = new PrognosisAvatar()
  PrognosisAvatar.avatarSelectionHeader = `<h4 class="pt-4" style="color:#ae5353">Escolha quem é você e vamos começar o estágio!</h4>`
  PrognosisAvatar.avatarSelectionImg = `<img class="character-mini character-selection mx-1" data-avatar-id="[id]" src="[src]" alt="pacient miniature" data-toggle="tooltip" data-placement="top" title="[name]"/>`
  PrognosisAvatar.avatarDesc = {
    "carruagemApolo":{
      "name":"Carruagem de Apolo",
      "src":"/prognosis/img/carruagem-apolo.svg",
      "desc":"Carregando o pai de Asclépio, leve iluminação e proteção por onde passar.",
    },
    "harpa":{
      "name":"Harpa",
      "src":"/prognosis/img/harpa.svg",
      "desc":"Seja o elo entre o Céu e a Terra e tenha o poder de tranquilizar os aflitos.",
    },
    "piraGrega":{
      "name":"Pira Grega",
      "src":"/prognosis/img/pira-grega.svg",
      "desc":"Seja guardião do fogo, elemento da renovação e transformação.",
    },
    "cavaloTroia":{
      "name":"Cavalo de Tróia",
      "src":"/prognosis/img/cavalo-troia.svg",
      "desc":"em tudo que reluz é ouro...Seja a maior arma do exército espartano.",
    },
    "gaia":{
      "name":"Gaia",
      "src":"/prognosis/img/gaia.svg",
      "desc":"Seja a Mãe-terra, geradora do Céu que protege todos os mortais.",
    },
    "peon":{
      "name":"Péon",
      "src":"/prognosis/img/peon.svg",
      "desc":"Morador do Olimpo, seja o médio dos deuses.",
    },
    "morfeu":{
      "name":"Morfeu",
      "src":"/prognosis/img/morfeu.svg",
      "desc":"Filho de Hipnos, leve os mortos no colo e personifique todos os seus sonhos.",
    },
    "medusa":{
      "name":"Medusa",
      "src":"/prognosis/img/medusa.svg",
      "desc":"Tenha os cabelos mais famosos da história e o olhar mais avassalador.",
    },
    "nix":{
      "name":"Nix",
      "src":"/prognosis/img/nix.svg",
      "desc":"Seja a segunda criatura a emergir no início dos tempos, grande comandante da Noite.",
    },
    "temis":{
      "name":"Têmis",
      "src":"/prognosis/img/temis.svg",
      "desc":"Seja a Deusa-guardiã dos juramentos, com grande conhecimento das leis e regras.",
    },
  }
})()

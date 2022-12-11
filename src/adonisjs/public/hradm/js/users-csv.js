class UsersCSVManager {

  constructor(){
    this._totalReady = 0
    this._updateCSV = this._updateCSV.bind(this)
    MessageBus.i.subscribe('table/updated', this._updateCSV)
    this._addUsers = this._addUsers.bind(this)
    MessageBus.i.subscribe('/adm/add/users', this._addUsers)
    this.preStart = this.preStart.bind(this)
    MessageBus.i.subscribe('control/dhtml/ready', this.preStart)
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

  start () {
    this._settingsFromUrl()
  }



  _updateCSV (topic, message) {
    console.log('===== CSV received')
    console.log(message)
    this._table = message.table
  }
  _settingsFromUrl(){
    let url = new URL(document.location)
    try {
      if(url.searchParams.get('role')){
        document.querySelector(`#role > option[value=${url.searchParams.get('role')}]`).setAttribute('selected','')
      }
    }catch(e){}
    try{
      if(url.searchParams.get('institution')){
        document.querySelector(`#institution > option[value=${url.searchParams.get('institution')}]`).setAttribute('selected','')
      }
    }catch(e){}
    try{
      if(url.searchParams.get('grade')){
        document.querySelector(`#grade > option[value=${url.searchParams.get('grade')}]`).setAttribute('selected','')
      }
    }catch(e){}
    try{
      if(url.searchParams.get('group')){
        document.querySelector(`#group > option[value=${url.searchParams.get('group')}]`).setAttribute('selected','')
      }
    }catch(e){}

  }

  async _addUsers (topic, message) {
    const tableContent = this._table.content
    let playersSuccess = {}
    if(document.querySelector('#btn-add-users').form.checkValidity() && this._table != null){
      let nameC = -1
      let emailC = -1
      let schema = this._table.schema
      const gradeId = document.querySelector('#grade').value
      const roleId = document.querySelector('#role').value
      const institutionId = document.querySelector('#institution').value
      const groupId = document.querySelector('#group').value || null
      for (let s in schema) {
        switch (schema[s].toLowerCase()) {
          case 'nome':
          case 'name': nameC = s; break;
          case 'e-mail':
          case 'email': emailC = s; break;
        }
      }
      if (nameC > -1 && emailC > -1) {

        for (let line = 0; line < tableContent.length; line++) {
          if (tableContent[line][emailC]) {
            let lp = tableContent[line][emailC].substring(0, tableContent[line][emailC].indexOf('@'))
            console.log('========== creating user ==========')
            let user = await MessageBus.i.request('user/create/post',
              {
                username: tableContent[line][nameC],
                email: tableContent[line][emailC],
                password: lp,
                login: tableContent[line][emailC],
                institution: institutionId,
                grade: gradeId
              }
            )
            playersSuccess[tableContent[line][nameC]] = {}
          if (user.message.error) {
            console.log('--- error')
            console.log(user.message.error)
            playersSuccess[tableContent[line][nameC]]['error'] = 'Creation conflict'
          } else {
            console.log(user.message.username)
            console.log(user.message.id)
            let role = await MessageBus.i.request('link/role/post',
            {
              userId: user.message.id,
              roleId: roleId
            }
          )
          if (role.message.error) {
            console.log('--- error')
            console.log(role.message.error)
              playersSuccess[tableContent[line][nameC]]['role'] = 0
          } else {
            console.log('--- link role success')
              playersSuccess[tableContent[line][nameC]]['role'] =  ' (SUCCESS)'
            if(groupId != null){
              let group = await MessageBus.i.request('link/group/post',
              {
                userId: user.message.id,
                groupId: groupId
              }
            )
            if (group.message.error) {
              console.log('--- error')
              console.log(group.message.error)
                playersSuccess[tableContent[line][nameC]]['group'] = 0
            } else{
              console.log('--- link group success')
              playersSuccess[tableContent[line][nameC]]['group'] = ' (SUCCESS)'
            }
          }
        }
      }
    }
  }
}
      let playersAddedTxt = ''
      for (const [key, value] of Object.entries(playersSuccess)) {
        console.log('222222',key, value)
        console.log(key, playersSuccess[key])
        playersAddedTxt += key+' -> '
        for (const [subKey, subValue] of Object.entries(playersSuccess[key])) {
          console.log('3333333',subKey, subValue)
          playersAddedTxt += subKey+' '+subValue+' ||'
          if (subKey == 'error') {
            playersAddedTxt +=`      <i class="fas fa-exclamation-triangle"></i> `
          }
        }
        console.log('next user, breaking line...');
        playersAddedTxt +='<br>'
      }
      console.log(playersAddedTxt)
      let alert = document.querySelector('#alert-feedback')
      alert.innerHTML = ""
      let header = document.createElement('h4')
      header.innerHTML = '<b>Users created</b>'
      header.classList.add('alert-header')
      header.style.color = '#721c24'
      alert.classList.add('alert-success', 'alert-dismissible', 'show')
      alert.classList.remove('alert-danger')
      alert.insertAdjacentElement('afterbegin', header)
      alert.insertAdjacentHTML('beforeend',playersAddedTxt)
      alert.style.display = 'block'
      alert.insertAdjacentHTML('beforeend',`
      <button type="button" class="close" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>`)
      alert.querySelector('button.close').onclick = function() {
        alert.classList.remove('show')
        alert.style.display = 'none'
      }
      setTimeout(function(){
        alert.classList.remove('show')
        alert.style.display = 'none'
      }, 8000)

    }
    if(tableContent == null){
      let alert = document.querySelector('#alert-feedback')
      alert.innerHTML = ""
      let header = document.createElement('h4')
      header.innerHTML = '<b>Empty table!</b>'
      header.classList.add('alert-header')
      header.style.color = '#721c24'
      alert.classList.add('alert-danger', 'alert-dismissible', 'show')
      alert.classList.remove('alert-success')
      alert.insertAdjacentElement('afterbegin', header)
      alert.insertAdjacentText('beforeend','You have to drag a csv containing the list of users with columns "name" and "email" in the "drag zone"')
      alert.style.display = 'block'
      alert.insertAdjacentHTML('beforeend',`
      <button type="button" class="close" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>`)
      alert.querySelector('button.close').onclick = function() {
        alert.classList.remove('show')
        alert.style.display = 'none'
      }
      setTimeout(function(){
        alert.classList.remove('show')
        alert.style.display = 'none'
      }, 8000)
    }
  }
}

(function () {
  UsersCSVManager.i = new UsersCSVManager()
})()

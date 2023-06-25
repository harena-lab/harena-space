class ImporterManager {

  constructor(){
    this._totalReady = 0
    this._updateCSV = this._updateCSV.bind(this)
    MessageBus.i.subscribe('table/updated', this._updateCSV)
    this._importDocuments = this._importDocuments.bind(this)
    MessageBus.i.subscribe('author/import/documents', this._importDocuments)
    this._preStart = this._preStart.bind(this)
    MessageBus.i.subscribe('control/dhtml/ready', this._preStart)
    MessageBus.i.publish('control/dhtml/status/request')
  }

  async _preStart () {
    const dhtmlList = document.querySelectorAll('dcc-dhtml')
    for (let i = 0; i < dhtmlList.length; i++) {
      if(dhtmlList[i]._ready == true){
        this._totalReady++
      }
      if(this._totalReady == dhtmlList.length){
        MessageBus.i.unsubscribe('control/dhtml/ready', this._preStart)
        MessageBus.i.unsubscribe('control/html/ready', this._preStart)
        this.start()
      }
    }
    if(dhtmlList.length == 0){
      MessageBus.i.unsubscribe('control/html/ready', this._preStart)
      this.start()
    }
  }

  start () {
    this._settingsFromUrl()
  }

  _settingsFromUrl(){
    let url = new URL(document.location)
    try {
      if(url.searchParams.get('quest')){
        document.querySelector(`#quest > option[value=${url.searchParams.get('quest')}]`).setAttribute('selected','')
      }
    }catch(e){}
  }

  _updateCSV (topic, message) {
    console.log('===== CSV received')
    console.log(message)
    this._table = message.table
  }

  async _importDocuments (topic, message) {
    console.log('=== import documents')
    console.log(document.querySelector('#btn-import').form.checkValidity())
    console.log(this._table)
    if(document.querySelector('#btn-import').form.checkValidity() &&
       this._table != null){
      const questId = document.querySelector('#quests').value
      console.log('=== quest selected')
      console.log(questId)

      const roomId = document.querySelector('#rooms').value
      console.log('=== room selected')
      console.log(roomId)

      let prefix = document.querySelector('#tprefix').value
      console.log('=== prefix')
      console.log(prefix)

      const schema = this._table.schema
      const content = this._table.content

      // look for the title and document columns
      let titleC = -1
      let documentC = -1
      for (let s in schema) {
        switch (schema[s].toLowerCase()) {
          case 'code':
          case 'title':
          case 'name': titleC = s; break;
          case 'document':
          case 'text': documentC = s; break;
        }
      }
      console.log('=== document column')
      console.log(documentC)
      if (documentC > -1) {
        const templateMd =
          await MessageBus.i.request(
            'data/template/plain.case.document/get',
            {static: false}, null, false)
        console.log('=== template')
        console.log(templateMd)
        for (let line = 0; line < content.length; line++) {
          if (content[line][documentC]) {
            console.log('========== creating case/document ==========')

            let metadata = '* metadata'
            for (let c = 0; c < schema.length; c++)
              if (c != documentC)
                metadata += '\n  * ' + schema[c] + ': ' + content[line][c]

            let cs = await MessageBus.i.request('case/create/post',
              {
                title: prefix +
                  ((titleC > -1 && content[line][titleC])
                    ? content[line][titleC] : line),
                source: templateMd.message
                  .replace('Text.', content[line][documentC])
                  .replace('* metadata', metadata)
              }
            )
            if (cs.message.error) {
              console.log('--- error')
              console.log(user.message.error)
            } else {
              console.log('--- case/document created')
              console.log(cs)
              let csq = await MessageBus.i.request('link/quest/post',
                {
                  questId: questId,
                  caseId: cs.message.id,
                  orderPosition: line
                }
              )
              if (csq.message.error) {
                console.log('--- error')
                console.log(csq.message.error)
              } else {
                console.log('--- link quest success')
                let rmq = await MessageBus.i.request('link/room/post',
                  {
                    room_id: roomId,
                    case_id: cs.message.id
                  }
                )
                if (rmq.message.error) {
                  console.log('--- error')
                  console.log(rmq.message.error)
                } else {
                  console.log('--- link room success')
                }
              }
            }
          }
        }
      }
    }
    if(this._table == null){
      let alert = document.querySelector('#alert-feedback')
      alert.innerHTML = ""
      let header = document.createElement('h4')
      header.innerHTML = '<b>Empty table!</b>'
      header.classList.add('alert-header')
      header.style.color = '#721c24'
      alert.classList.add('alert-danger', 'alert-dismissible', 'show')
      alert.classList.remove('alert-success')
      alert.insertAdjacentElement('afterbegin', header)
      alert.insertAdjacentText('beforeend','You have to drag a csv containing the list of documents with columns "title" (optional) and "document" in the "drag zone"')
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
  ImporterManager.i = new ImporterManager()
})()

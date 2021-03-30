class DraftManager {
  async start () {
    let mode = window.location.search.substr(1)
    if (mode != null && mode.length > 0) {
      const md = mode.match(/mode=([\w-]+)/i)
      mode = (md == null) ? null : md[1]
    } else { mode = null }
    const advanced =
         !!((mode != null && mode.toLowerCase() == 'advanced'))

    this.deleteCase = this.deleteCase.bind(this)
    MessageBus.int.subscribe('control/case/delete', this.deleteCase)

    if (advanced) {
      this.downloadCase = this.downloadCase.bind(this)
      MessageBus.int.subscribe('control/case/download', this.downloadCase)
    }

    // const authorState = Basic.service.authorStateRetrieve();
    this._draftCategoryCasesSelect = this._draftCategoryCasesSelect.bind(this)
    this._boxesPanel = document.querySelector('#case-boxes')
    // this._draftSelect(authorState.userid, advanced);
    // document.getElementsByClassName('buttons-container').length > 0
    //   ? MessageBus.ext.subscribe('control/dhtml/ready', this._draftCategoryCasesSelect) : this._draftSelect(advanced)
    MessageBus.int.subscribe('control/dhtml/updated', this._draftCategoryCasesSelect)
  }

  async _draftSelect (advanced) {
    console.log('Drafting total cases')
    const cases = await MessageBus.ext.request('data/case/*/list')
    // {user: userid});

    const cl = cases.message
    for (const c in cl) {
      const template = document.createElement('template')
      const html = DraftManager.caseBox
        .replace('[download]', (advanced) ? DraftManager.caseDownload : '')
      template.innerHTML = html
        .replace(/\[id\]/ig, cl[c].id)
      // .replace("[icon]", cl[c].icon)
        .replace('[title]', cl[c].title)
      // .replace("[description]", cl[c].description);
      this._boxesPanel.appendChild(template.content.cloneNode(true))
      const editButton = this._boxesPanel.querySelector('#e' + cl[c].id)
      const previewButton = this._boxesPanel.querySelector('#p' + cl[c].id)
      const deleteButton = this._boxesPanel.querySelector('#d' + cl[c].id)
      const downloadButton = (advanced)
        ? this._boxesPanel.querySelector('#w' + cl[c].id) : null
      editButton.addEventListener('click',
        function () {
          Basic.service.authorPropertyStore('caseId', this.id.substring(1))
          // window.location.href = "http://0.0.0.0:10010/author/author.html";
          if(new URL(document.location).pathname.includes('feedback')){
            window.location.href =
                    '/author?id=' + this.id.substring(1)+'&fdbk'
          }else {
            window.location.href =
                    '/author?id=' + this.id.substring(1)
          }
        }
      )
      previewButton.addEventListener('click',
        function () {
          Basic.service.authorPropertyStore('caseId', this.id.substring(1))
          window.location.href = '/player/case?id=' +
                                      this.id.substring(1) +
                                      '&preview=1'
        }
      )
      console.log('=== adding listener 1')
      deleteButton.addEventListener('click',
        function () {
          MessageBus.int.publish('control/case/delete', this.id.substring(1))
        }
      )
      if (advanced) {
        downloadButton.addEventListener('click',
          function () {
            MessageBus.int.publish('control/case/download', this.id.substring(1))
          }
        )
      }
    }
    MessageBus.int.publish('control/dhtml/ready')
  }

  async _draftCategoryCasesSelect (advanced) {
    // console.log('Drafting cases by category')
    // const cases = await MessageBus.ext.request('data/case/*/list')
    // {user: userid});

    const cl = document.getElementsByClassName('buttons-container')
    const caseListInput = document.querySelector('#table_id')


    if(document.querySelector('#select-all-checkbox')){
      const selectAllCases = document.querySelector('#select-all-checkbox')
      var caseList = new Array()
      selectAllCases.addEventListener('click',
      function () {

        for (var c in cl){
          try {
            var editButton = cl[c].children[0]
            const caseContainer = document.querySelector('#b'+editButton.id.substring(1))
            const shareCheckbox = document.querySelector('#c'+editButton.id.substring(1))
            if(selectAllCases.checked){
              // console.log('============ all checked')
              shareCheckbox.checked = true
              selectAllCases.nextElementSibling.innerHTML = 'Unselect All'
              caseContainer.style.backgroundColor = '#769fdb'
              caseContainer.firstElementChild.style.color = '#fff'
            } else{
              // console.log('============all unchecked')
              shareCheckbox.checked = false
              selectAllCases.nextElementSibling.innerHTML = 'Select All'
              caseContainer.style.backgroundColor = ''
              caseContainer.firstElementChild.style.color = '#808080'
            }
          } catch (e) {
            break
          }
        }
      })
    }

    for (const c in cl) {
      if (cl[c].children) {
        const editButton = cl[c].children[0]
        const previewButton = cl[c].children[1]
        const deleteButton = cl[c].children[2]
        const caseContainer = document.querySelector('#b'+editButton.id.substring(1))

        if(document.querySelector('#c'+editButton.id.substring(1))){
        const shareCheckbox = document.querySelector('#c'+editButton.id.substring(1))

        caseContainer.firstElementChild.addEventListener('click',
          function () {

            shareCheckbox.click()
          })

        shareCheckbox.addEventListener('change',
          function () {
            // console.log('============ click checkbox')
            if(shareCheckbox.checked){
              // console.log('============ checkbox checked')
              caseList.push(shareCheckbox.value)
              document.querySelector('#table_id').value = caseList
              // sessionStorage.setItem('caseList', caseList)
              caseContainer.style.backgroundColor = '#769fdb'
              caseContainer.firstElementChild.style.color = '#fff'
            }else{
              // console.log('============ checkbox unchecked')
              caseList.splice(caseList.indexOf(shareCheckbox.value), 1)
              document.querySelector('#table_id').value = caseList
              // sessionStorage.setItem('caseList', caseList)
              caseContainer.style.backgroundColor = ''
              caseContainer.firstElementChild.style.color = '#808080'
            }
          })
        }
        editButton.addEventListener('click',
          function () {
            Basic.service.authorPropertyStore('caseId', editButton.id.substring(1))
            // window.location.href = "http://0.0.0.0:10010/author/author.html";
            if(new URL(document.location).pathname.includes('feedback')){
              window.location.href =
                      '/author?id=' + this.id.substring(1)+'&fdbk=""'
            }else {
              window.location.href =
                      '/author?id=' + this.id.substring(1)
            }
          })
        previewButton.addEventListener('click',
          function () {
            Basic.service.authorPropertyStore('caseId', editButton.id.substring(1))
            window.location.href = '/player/case?id=' +
                                         previewButton.id.substring(1) +
                                         '&preview=1'
          })
        console.log('=== adding listener 2')
        deleteButton.addEventListener('click',
          function () {
            MessageBus.int.publish('control/case/delete', editButton.id.substring(1))
          })
        // if (advanced) {
        //   downloadButton.addEventListener('click',
        //     function () {
        //       MessageBus.int.publish('control/case/download', this.id.substring(1))
        //     })
        // }
      }

    }

  }
  async deleteCase (topic, message) {
    const decision =
         await DCCNoticeInput.displayNotice(
           'Are you sure that you want to delete this case? (write yes or no)',
           'input')
    if (decision.toLowerCase() == 'yes') {
      await MessageBus.ext.request('data/case/' + message + '/delete')
      // console.log(message);
      this._boxesPanel.querySelector('#b' + message).remove()
      // this._boxesPanel.removeChild(box)
    }
  }

  async downloadCase (topic, message) {
    const caseObj = await MessageBus.ext.request(
      'data/case/' + message + '/get')
    Basic.service.downloadFile(
      caseObj.message.source, caseObj.message.title + '.md')
  }
}
// <div class="draft-case-image w-100 h-50"></div>

(function () {
  DraftManager.instance = new DraftManager()

  DraftManager.caseBox =
`<div id="b[id]" class="row draft-author-case-container">
  <div class="col draft-case-title">[title]</div>
  <div class="d-flex justify-content-end">
    <div id="e[id]" class="col author-panel-button">EDIT</div>
    <div id="p[id]" class="col author-panel-button">PREVIEW</div>
    <div id="d[id]" class="col author-panel-button">DELETE</div>
  </div>
</div>`

  DraftManager.caseDownload =
`
      <div id="w[id]" class="author-panel-button">DOWNLOAD</div>`
})()

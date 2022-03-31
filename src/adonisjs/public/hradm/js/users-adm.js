class AdminManager {
  constructor(){
    this.start = this.start.bind(this)
    MessageBus.i.subscribe('control/html/ready', this.start)
  }

async start (){
  MessageBus.i.unsubscribe('control/html/ready', this.start)
  console.log('============starting adminManager')
  this._boxesPanel = document.querySelector('#case-boxes')
  this.usersSelect = this.usersSelect.bind(this)
  MessageBus.i.subscribe('control/dhtml/ready', this.usersSelect)
  MessageBus.i.publish('control/dhtml/status/request', {id: 'harena-dhtml-users'})
}

async usersSelect (topic, message) {
  if(message.id == 'harena-dhtml-users'){
    MessageBus.i.unsubscribe('control/dhtml/ready', this.usersSelect)

    const cl = document.getElementsByClassName('buttons-container')
    // const caseListInput = document.querySelector('#table_id')

    if(message != null && message.id != null && message.id == 'harena-dhtml-cases'){

      //CHECKBOX INTERACTIONS
      if(document.querySelector('#select-all-checkbox')){
        const selectAllCases = document.querySelector('#select-all-checkbox')

        const listenerFnSelectAll = function () {
          for (let c in cl){
            try {

              let editButton = cl[c].children[0]
              const userContainer = document.querySelector('#b'+editButton.id.substring(1))
              const shareCheckbox = document.querySelector('#c'+editButton.id.substring(1))
              if(selectAllCases.checked){
                // console.log('============ all checked')
                shareCheckbox.checked = true
                selectAllCases.nextElementSibling.innerHTML = 'Unselect All'
                userContainer.style.backgroundColor = '#769fdb'
                userContainer.firstElementChild.style.color = '#fff'
              } else{
                // console.log('============all unchecked')
                shareCheckbox.checked = false
                selectAllCases.nextElementSibling.innerHTML = 'Select All'
                userContainer.style.backgroundColor = ''
                userContainer.firstElementChild.style.color = '#808080'
              }
              var changeEv = new Event('change')
              shareCheckbox.dispatchEvent(changeEv)
            } catch (e) {
              break
            }
          }
        }
        selectAllCases.removeEventListener('click', listenerFnSelectAll)
        selectAllCases.addEventListener('click', listenerFnSelectAll)
      }
    }
    let userList = new Array()
    for (let c in cl) {
      if (cl[c].children) {
        console.log(cl[c].children[0].id)
        const editButton = cl[c].children[0]
        const previewButton = cl[c].children[1]
        const generateToken = cl[c].children[2]
        const userContainer = document.querySelector('#b'+editButton.id.substring(1))

        if(document.querySelector('#c'+editButton.id.substring(1))){
          const shareCheckbox = document.querySelector('#c'+editButton.id.substring(1))

          const listenerFnCaseContainer = function () {
            console.log('click some case container')
            let pCheckbox = shareCheckbox.checked
            shareCheckbox.click()
            // console.log(pCheckbox)
            // console.log(shareCheckbox.checked)
            shareCheckbox.disabled = true
            setTimeout(function () {
              shareCheckbox.disabled = false
            }, 300);
          }
          userContainer.firstElementChild.removeEventListener('click', listenerFnCaseContainer)
          userContainer.firstElementChild.addEventListener('click', listenerFnCaseContainer)

          const listenerFnShareCheckbox = function () {
            // console.log('============ click checkbox')
            if(shareCheckbox.checked){
              // console.log('============ checkbox checked')
              userList.push(shareCheckbox.value)
              document.querySelector('#table_id').value = userList
              userContainer.style.backgroundColor = '#769fdb'
              userContainer.firstElementChild.style.color = '#fff'
            }else{
              // console.log('============ checkbox unchecked')
              userList.splice(userList.indexOf(shareCheckbox.value), 1)
              document.querySelector('#table_id').value = userList
              userContainer.style.backgroundColor = ''
              userContainer.firstElementChild.style.color = '#808080'
            }
          }
          shareCheckbox.removeEventListener('change', listenerFnShareCheckbox)
          shareCheckbox.addEventListener('change', listenerFnShareCheckbox)
        }

        if(editButton){
          const listenerFnEdit = function () {
            // OPEN MODAL TO CHANGE USER INFO  TODO
          }
          editButton.removeEventListener('click', listenerFnEdit)
          editButton.addEventListener('click', listenerFnEdit)
        }
        if(previewButton){
          const listenerFnPreview = function () {
            //OPEN MODAL TO LIST USER INFO   TODO
          }
          previewButton.removeEventListener('click', listenerFnPreview)
          previewButton.addEventListener('click', listenerFnPreview)
        }

        if(generateToken){
          // console.log('=== adding listener 2')
          const listenerFnToken = function () {
            //Generate token for user (rest). Maybe open modal to generate token an also custom url for redirect
          }
          generateToken.removeEventListener('click', listenerFnToken)
          generateToken.addEventListener('click', listenerFnToken)
        }
        // if (advanced) {
        //   downloadButton.addEventListener('click',
        //     function () {
        //       MessageBus.i.publish('control/case/download', this.id.substring(1))
        //     })
        // }
      }

    }

  }
}
}

(function () {
  AdminManager.i = new AdminManager()

})()

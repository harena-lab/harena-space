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
    let usernameSelected = document.querySelector('#username_table')

    if(message != null && message.id != null && message.id == 'harena-dhtml-users'){

      //CHECKBOX INTERACTIONS
      if(document.querySelector('#select-all-checkbox')){
        const selectAllCases = document.querySelector('#select-all-checkbox')

        const listenerFnSelectAll = function () {
          for (let c in cl){
            try {

              let editButton = cl[c].children[0]
              const userContainer = document.querySelector('#b'+editButton.id.substring(1))
              const selectUserCheckbox = document.querySelector('#c'+editButton.id.substring(1))
              if(selectAllCases.checked){
                // console.log('============ all checked')
                selectUserCheckbox.checked = true
                selectAllCases.nextElementSibling.innerHTML = 'Unselect All'
                userContainer.style.backgroundColor = '#769fdb'
                userContainer.firstElementChild.style.color = '#fff'
              } else{
                // console.log('============all unchecked')
                selectUserCheckbox.checked = false
                selectAllCases.nextElementSibling.innerHTML = 'Select All'
                userContainer.style.backgroundColor = ''
                userContainer.firstElementChild.style.color = '#808080'
              }
              var changeEv = new Event('change')
              selectUserCheckbox.dispatchEvent(changeEv)
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
    let usernameList = new Array()
    for (let c in cl) {
      if (cl[c].children) {
        const editButton = cl[c].children[0]
        const previewButton = cl[c].children[1]
        const generateToken = cl[c].children[2]
        const userContainer = document.querySelector('#b'+editButton.id.substring(1))

        if(document.querySelector('#c'+editButton.id.substring(1))){
          const selectUserCheckbox = document.querySelector('#c'+editButton.id.substring(1))

          const listenerFnCaseContainer = function () {
            // console.log('click some case container')
            let pCheckbox = selectUserCheckbox.checked
            selectUserCheckbox.click()
            // console.log(pCheckbox)
            // console.log(selectUserCheckbox.checked)
            selectUserCheckbox.disabled = true
            setTimeout(function () {
              selectUserCheckbox.disabled = false
            }, 300);
          }
          userContainer.firstElementChild.removeEventListener('click', listenerFnCaseContainer)
          userContainer.firstElementChild.addEventListener('click', listenerFnCaseContainer)

          const listenerFnShareCheckbox = function () {
            // console.log('============ click checkbox')
            if(selectUserCheckbox.checked){
              // console.log('============ checkbox checked')
              userList.push(selectUserCheckbox.value)
              document.querySelector('#table_id').value = userList
              usernameList.push(selectUserCheckbox.dataset.username)
              usernameSelected.textContent = usernameList
              userContainer.style.backgroundColor = '#769fdb'
              userContainer.firstElementChild.style.color = '#fff'
            }else{
              // console.log('============ checkbox unchecked')
              userList.splice(userList.indexOf(selectUserCheckbox.value), 1)
              document.querySelector('#table_id').value = userList
              usernameList.splice(usernameList.indexOf(selectUserCheckbox.dataset.username), 1)
              usernameSelected.textContent = usernameList
              userContainer.style.backgroundColor = ''
              userContainer.firstElementChild.style.color = '#808080'
            }
          }
          selectUserCheckbox.removeEventListener('change', listenerFnShareCheckbox)
          selectUserCheckbox.addEventListener('change', listenerFnShareCheckbox)
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
            let userId = this.id.substring(1)
            document.querySelector('#user-id').value = userId
            document.querySelector('dcc-submit[bind="submit-admin-user-info"]')._computeTrigger()
          }
          previewButton.removeEventListener('click', listenerFnPreview)
          previewButton.addEventListener('click', listenerFnPreview)
        }

        if(generateToken){
          const listenerFnToken = function () {
            //Generate token for user (rest). Maybe open modal to generate token an also custom url for redirect
            let userId = document.querySelector('#user-id')
            userId.value = this.id.substring(1)
            document.querySelector('dcc-submit[bind="submit-admin-gen-login-token"]')._computeTrigger()
          }
          generateToken.removeEventListener('click', listenerFnToken)
          generateToken.addEventListener('click', listenerFnToken)
        }

      }

    }

  }
}
}

(function () {
  AdminManager.i = new AdminManager()

})()

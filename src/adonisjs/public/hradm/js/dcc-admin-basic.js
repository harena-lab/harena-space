(function () {
  DCC.component(
    'submit-admin-multi-gen-login-token',
    'dcc-submit',
    {
      pre: function (message, form, schema) {
        // console.log('============ logging')
        let userList = document.querySelector('#table_id')
        if(!userList.dataset.completed){
          userList.dataset.completed = 0
        }
        userList.dataset.completed = 1+parseInt(userList.dataset.completed)
        if (userList.value != '' && userList.value != null) {
          let _userList = new Array()
          _userList = userList.value.split(',')
          message['value']['userId'] = _userList[0]
          // console.log('============ array before shift:',_userList)
          _userList.shift()
          // console.log('============ array after shift:',_userList)
          userList.value = _userList
          // console.log('============ message',message['value'])
          // console.log('============ value in input updated:', userList.value)
          $('#notice-modal').modal('show')
          let txt = document.querySelector('#modal-notice-txt')
          let modalBody = document.querySelector('#modal-notice-body')
          txt.innerHTML = `Generating login tokens...(${userList.dataset.completed}/${userList.dataset.nUsers})`

          modalBody.classList.remove('bg-danger')
          modalBody.classList.remove('bg-success')
          txt.classList.remove('text-white')
          modalBody.classList.add('bg-white')
          txt.classList.add('text-secondary')
          return true
        }else {
          $('#notice-modal').modal('show')
          let txt = document.querySelector('#modal-notice-txt')
          let modalBody = document.querySelector('#modal-notice-body')
          txt.innerHTML = 'Error. Please select at least one user for the token generation.'
          modalBody.classList.remove('bg-success')
          modalBody.classList.remove('bg-white')
          txt.classList.remove('text-secondary')
          modalBody.classList.add('bg-danger')
          txt.classList.add('text-white')

          setTimeout(function(){
            $('#notice-modal').modal('hide')
          }, 7000)

          return false
        }

      },
      pos: function (response) {
        const userList = document.querySelector('#table_id')
        // console.log(response)
        if(response['harena-admin-gen-login-token']['message'] == 'Generation successful'){
      }else {
        // console.log('============ error in generation')
      }
      // console.log('============ userlist: ',userList.value)
      // console.log('============ userlist length:', userList.value.split(',').length)
      if(userList.value.split(',').length > 0 && userList.value != '')
        document.querySelector('dcc-submit[bind="submit-admin-multi-gen-login-token"]')._computeTrigger()
      else{
        let txt = document.querySelector('#modal-notice-txt')
        let modalBody = document.querySelector('#modal-notice-body')
        txt.innerHTML = 'Token generation successful! <br> Look in the respective user info.'
        modalBody.classList.remove('bg-danger')
        modalBody.classList.remove('bg-white')
        txt.classList.remove('text-secondary')
        modalBody.classList.add('bg-success')
        txt.classList.add('text-white')
        userList.dataset.completed = 0

        setTimeout(function(){
          $('#notice-modal').modal('hide')
        }, 7000)
      }
    }
    }
  )

  DCC.component(
    'submit-admin-gen-login-token',
    'dcc-submit',
    {
      pre: function (message, form, schema) {
        let userId = document.querySelector('#user-id')
        if(userId.value !='' && userId.value != null){
          message['value']['userId'] = userId.value
          userId.value = ''
          $('#notice-modal').modal('show')
          let txt = document.querySelector('#modal-notice-txt')
          let modalBody = document.querySelector('#modal-notice-body')
          txt.innerHTML = 'Generating login token...'

          modalBody.classList.remove('bg-danger')
          modalBody.classList.remove('bg-success')
          txt.classList.remove('text-white')
          modalBody.classList.add('bg-white')
          txt.classList.add('text-secondary')
          return true
        }else {
          $('#notice-modal').modal('show')
          let txt = document.querySelector('#modal-notice-txt')
          let modalBody = document.querySelector('#modal-notice-body')
          txt.innerHTML = 'Error. Please select an user for the token generation.'
          modalBody.classList.remove('bg-success')
          modalBody.classList.remove('bg-white')
          txt.classList.remove('text-secondary')
          modalBody.classList.add('bg-danger')
          txt.classList.add('text-white')

          setTimeout(function(){
            $('#notice-modal').modal('hide')
          }, 7000)

          return false
        }

      },
      pos: function (response) {
        let txt = document.querySelector('#modal-notice-txt')
        let modalBody = document.querySelector('#modal-notice-body')
        txt.innerHTML = 'Token generation successful! <br><br> Look in the respective user info.'
        modalBody.classList.remove('bg-danger')
        modalBody.classList.remove('bg-white')
        txt.classList.remove('text-secondary')
        modalBody.classList.add('bg-success')
        txt.classList.add('text-white')
      }
    }
  )
  DCC.component(
    'submit-admin-user-info',
    'dcc-submit',
    {
      pre: function (message, form, schema) {
        let userId = document.querySelector('#user-id')
        if(userId.value !='' && userId.value != null){
          message['value']['userId'] = userId.value
          userId.value = ''
          $('#user-overview-info').modal('toggle')
          return true
        }else {
          return false
        }

      },
      pos: function (response) {
        // <TODO> DCC-SUBMIT problem. Cannot use pos without connections.
        //The only way to use dcc-dhtml with dcc-submit is without connection (only topic).
      }
    }
  )
})()

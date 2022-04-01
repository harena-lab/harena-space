(function () {
  DCC.component(
    'submit-admin-multi-gen-login-token',
    'dcc-submit',
    {
      pre: function (message, form, schema) {
        // console.log('============ logging')
        let userList = document.querySelector('#table_id')
        let _userList = new Array()
        _userList = userList.value.split(',')
        message['value']['userId'] = _userList[0]
        // console.log('============ array before shift:',_userList)
        _userList.shift()
        // console.log('============ array after shift:',_userList)
        userList.value = _userList
        // console.log('============ message',message['value'])
        // console.log('============ value in input updated:', userList.value)
        return true

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
    }
    }
  )

  DCC.component(
    'submit-admin-gen-login-token',
    'dcc-submit',
    {
      pre: function (message, form, schema) {
        let userId = document.querySelector('#user-id')
        if(userId.value !='' || userId.value != null){
          message['value']['userId'] = userId.value
          userId.value = ''
          return true
        }else {
          return false
        }

      },
      pos: function (response) {

      }
    }
  )
  DCC.component(
    'submit-admin-user-info',
    'dcc-submit',
    {
      pre: function (message, form, schema) {
        let userId = document.querySelector('#user-id')
        if(userId.value !='' || userId.value != null){
          message['value']['userId'] = userId.value
          userId.value = ''
          return true
        }else {
          return false
        }

      },
      pos: function (response) {
        $('#user-overview-info').modal('toggle')
      }
    }
  )
})()

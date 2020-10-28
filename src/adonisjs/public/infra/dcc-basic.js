(function () {
  DCC.component(
    'submit-login',
    'dcc-submit',
    {
      pre: function (message, form, schema) {
        let check = true
        if (message.value.login.length == 0)
          check = false
        return check
      },
      pos: function (response) {
        // console.log(response['harena-login'])
        if(response['harena-login']){
          console.log('login successful');
          window.location.href = '/'
        }
      }
    }
  )
  DCC.component(
    'submit-logout',
    'dcc-submit',
    {
      pos: function (response) {
        console.log(response)
        window.location.href = '/'
      }
    }
  )

  DCC.component(
    'submit-change-password',
    'dcc-submit',
    {
      pos: async function (response) {
        console.log(response['harena-change-password'])
        const responseContainer = document.querySelector('#updatePasswordResponse')
        responseContainer.innerHTML = response['harena-change-password']
        if(response['harena-change-password'] === 'Password changed successfully.'){
          console.log('if')
          responseContainer.classList.remove('text-danger')
          responseContainer.classList.add('text-success')
          const promise = new Promise((resolve, reject) => {
            setTimeout(() => resolve(window.location.href = '/'), 1000)
          })
        }else {
          console.log('else')
          responseContainer.classList.remove('text-success')
          responseContainer.classList.add('text-danger')
        }
      }
    }
  )
})()

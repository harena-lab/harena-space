(function () {
  DCC.component(
    'submit-login',
    'dcc-submit',
    {
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
      pos: function (response) {
        console.log(response['harena-change-password'])
        const responseContainer = document.querySelector('#updatePasswordResponse')
        responseContainer.innerHTML = response['harena-change-password']
        if(response['harena-change-password'] === 'Password changed successfully.'){
        responseContainer.classList.add('text-success')
      }else{
        responseContainer.classList.add('text-danger')
      }

      }
    }
  )
})()

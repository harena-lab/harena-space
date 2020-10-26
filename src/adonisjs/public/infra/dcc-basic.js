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
})()

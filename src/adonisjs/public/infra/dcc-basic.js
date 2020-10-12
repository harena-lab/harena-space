(function () {

  DCC.component(
    'submit-login',
    'dcc-submit',
    {
      pos: function(response) {
        window.location.href = '/'
        // console.log(response)
      }
    }
  )
  DCC.component(
    'submit-logout',
    'dcc-submit',
    {
      pos: function(response) {
        window.location.href = '/'
        // console.log(response)
      }
    }
  )
})()

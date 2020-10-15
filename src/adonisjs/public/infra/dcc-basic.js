(function () {
  DCC.component(
    'submit-login',
    'dcc-submit',
    {
      pos: function (response) {
        // console.log(response)
        window.location.href = '/'
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

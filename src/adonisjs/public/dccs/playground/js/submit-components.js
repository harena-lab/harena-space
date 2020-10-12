(function () {

DCC.component(
  'submit-login',
  'dcc-submit',
  {
    pos: function(response) {
      console.log('=== after processing')
      console.log(response)
    }
  }
)

DCC.component(
  'submit-logout',
  'dcc-submit',
  {
    pos: function(response) {
      console.log('=== after processing')
      console.log(response)
    }
  }
)

})()
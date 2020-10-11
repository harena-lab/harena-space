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

})()
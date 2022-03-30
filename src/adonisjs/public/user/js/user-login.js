class UserLogin {

  loginByToken () {
    console.log('============ triggering submit')
    document.querySelector('dcc-submit[bind="submit-token-login"]')._computeTrigger()
  }
}
(function () {
  UserLogin.i = new UserLogin()
})()

class UserLogin {

  loginByToken () {
    document.querySelector('dcc-submit[bind="submit-token-login"]')._computeTrigger()
  }
}
(function () {
  UserLogin.i = new UserLogin()
})()

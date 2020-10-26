class TokenController {
  constructor () {

    this._tokenChecked = false
    this.checkToken = this.checkToken.bind(this)
MessageBus.int.subscribe('control/button/logout-button/ready', this.checkToken)
    if (window.location.pathname !== '/') {
      this.redirectUnlogged()
    }
  }

  set tokenChecked (newValue) {
    this._tokenChecked = newValue
    // console.log('new value: ' + this._tokenChecked)
  }

  get tokenChecked () {
    // console.log(this._tokenChecked)
    return this._tokenChecked
  }

  async checkToken () {
    if (document.getElementById('harena-header')) {

      const elemLogin = document.getElementById('login-block')
      const elemLogout = document.getElementById('logout-block')

      if (TokenController.instance.tokenChecked) {
        // elem.setAttribute('onclick', 'LoginTest.i.logout()')
        elemLogin.style.display = 'none'
        elemLogout.style.display = 'block'
      } else {
        const config = {
          method: 'GET',
          url: DCCCommonServer.managerAddressAPI + 'auth/check',
          withCredentials: true
        }

        await axios(config)
          .then(function (endpointResponse) {
            if (endpointResponse.data.token === 'token valid') {
              console.log('token valid')
              elemLogin.style.display = 'none'
              elemLogout.style.display = 'block'
              document.querySelector('#logoutDropdownBtn').innerHTML = endpointResponse.data.username
            } else {
              console.log('token invalid')
              elemLogin.style.display = 'block'
              elemLogout.style.display = 'none'
            }
          })
          .catch(function (error) {
            console.log('=== check token error')
            console.log(error)
          })
      }
    }
  }

  async redirectUnlogged () {
    const config = {
      method: 'GET',
      url: DCCCommonServer.managerAddressAPI + 'auth/check',
      withCredentials: true
    }
    // console.log('=== check token request')
    // console.log(DCCCommonServer.managerAddressAPI + 'auth/check')
    await axios(config)
      .then(function (endpointResponse) {
        // console.log('=== check token redirect response')
        // console.log(endpointResponse.data);
        // endpointResponse.data === 'token valid' ? TokenController.instance.checkToken(true) : window.location.href = '/login'
        endpointResponse.data.token === 'token valid' ? TokenController.instance.tokenChecked = true : window.location.href = '/user'
      })
      .catch(function (error) {
        console.log('=== check redirect error')
        console.log(error)
      })
  }
}
(function () {
  TokenController.instance = new TokenController()
})()

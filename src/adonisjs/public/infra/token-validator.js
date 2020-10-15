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
        // console.log(TokenController.instance.tokenChecked)
        const config = {
          method: 'GET',
          url: DCCCommonServer.managerAddressAPI + 'auth/check',
          withCredentials: true
        }

        // console.log('=== check token request')
        // console.log(DCCCommonServer.managerAddressAPI + 'auth/check')
        await axios(config)
          .then(function (endpointResponse) {
          // return response.redirect('/')
          // console.log('=== check token response')
          // console.log(endpointResponse.data);

            if (endpointResponse.data === 'token valid') {
              // console.log('token valid')
              // const elem = document.getElementById('header-login').firstElementChild
              // elem.setAttribute('onclick', 'LoginTest.i.logout()')
              // elem.href = '#'
              elemLogin.style.display = 'none'
              elemLogout.style.display = 'block'
            } else {
              // console.log('token invalid')
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
        endpointResponse.data === 'token valid' ? TokenController.instance.tokenChecked = true : window.location.href = '/login'
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

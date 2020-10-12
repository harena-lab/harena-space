class TokenController {
  constructor () {
    // if (window.location.pathname != '/') {
    //   this.redirectUnlogged();
    // }else
    //   this.checkToken();
    window.location.pathname !== '/' ? this.redirectUnlogged() : this.checkToken()
  }

  async checkToken (checked) {
    let elemLogin
    let elemLogout
    if (document.getElementById('harena-header')) {
      elemLogin = document.getElementById('login-block')
      elemLogout = document.getElementById('logout-block')
    } else {
      return
    }

    if (checked) {
      // elem.setAttribute('onclick', 'LoginTest.i.logout()')
      elemLogin.style.display = 'none'
      elemLogout.style.display = 'block'
      return
    }

    const config = {
      method: 'GET',
      url: DCCCommonServer.managerAddressAPI + 'auth/check',
      withCredentials: true

    }
    console.log('=== check token request')
    console.log(DCCCommonServer.managerAddressAPI + 'auth/check')
    axios(config)
      .then(function (endpointResponse) {
      // return response.redirect('/')
      // console.log('=== check token response')
      // console.log(endpointResponse.data);

        if (endpointResponse.data === 'token valid') {
          console.log('token valid')
          // const elem = document.getElementById('header-login').firstElementChild
          // elem.setAttribute('onclick', 'LoginTest.i.logout()')
          // elem.href = '#'
          elemLogin.style.display = 'none'
          elemLogout.style.display = 'block'
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

  async redirectUnlogged () {
    const config = {
      method: 'GET',
      url: DCCCommonServer.managerAddressAPI + 'auth/check',
      withCredentials: true
    }
    // console.log('=== check token request')
    // console.log(DCCCommonServer.managerAddressAPI + 'auth/check')
    axios(config)
      .then(function (endpointResponse) {
        // console.log('=== check token redirect response')
        // console.log(endpointResponse.data);
        endpointResponse.data === 'token valid' ? TokenController.instance.checkToken(true) : window.location.href = '/login'
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

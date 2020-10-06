class TokenController {
  constructor () {
    // if (window.location.pathname != '/') {
    //   this.redirectUnlogged();
    // }else
    //   this.checkToken();

    window.location.pathname !== '/' ? this.redirectUnlogged() : this.checkToken()
  }

  async checkToken (checked) {
    let elem
    if (document.getElementById('harena-header')) {
      elem = document.getElementById('header-login').firstElementChild
    } else {
      return
    }

    if (checked) {
      console.log('IM STUPIDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDd')
      elem.setAttribute('onclick', 'LoginTest.i.logout()')
      console.log(elem.onclick)
      elem.innerHTML = 'Log out'
      return
    }

    const config = {
      method: 'GET',
      url: DCCCommonServer.managerAddressAPI + 'auth/check',
      withCredentials: true

    }
    // console.log('=== check token request')
    // console.log(DCCCommonServer.managerAddressAPI + 'auth/checkToken')
    axios(config)
      .then(function (endpointResponse) {
      // return response.redirect('/')
      // console.log('=== check token response')
      // console.log(endpointResponse.data);

        if (endpointResponse.data === 'token valid') {
          console.log('token valid')
          // const elem = document.getElementById('header-login').firstElementChild
          elem.onclick = 'LoginTest.i.logout()'
          elem.innerHTML = 'Log out'
        } else {
          elem.href = '/login'
          elem.onclick = ''
          elem.innerHTML = 'Log in'
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
    console.log('=== check token request')
    console.log(DCCCommonServer.managerAddressAPI + 'auth/check')
    axios(config)
      .then(function (endpointResponse) {
        console.log('=== check token redirect response')
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

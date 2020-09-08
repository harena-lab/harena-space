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
      elem.href = '/logout'
      elem.innerHTML = 'Log out'
      return
    }

    if (DCCCommonServer.token !== 'undefined') {
      const config = {
        method: 'GET',
        url: DCCCommonServer.managerAddressAPI + 'auth/check',
        headers: {
          Authorization: 'Bearer ' + DCCCommonServer.token
        }
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
            elem.href = '/logout'
            elem.innerHTML = 'Log out'
          }
        })
        .catch(function (error) {
          console.log('=== check token error')
          console.log(error)
        })
    } else {
      console.log('token invalid')
      // const elem = document.getElementById('header-login').firstElementChild
      elem.href = '/login'
      elem.innerHTML = 'Log in'
    }
  }

  async redirectUnlogged () {
    // $( document ).ready(function() {

    if (DCCCommonServer.token !== 'undefined') {
      const config = {
        method: 'GET',
        url: DCCCommonServer.managerAddressAPI + 'auth/check',
        headers: {
          Authorization: 'Bearer ' + DCCCommonServer.token
        }
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
    } else {
      window.location.href = '/login'
    }
    // });
  }
}
(function () {
  TokenController.instance = new TokenController()
})()

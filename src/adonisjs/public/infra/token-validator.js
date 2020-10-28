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

      if (TokenController.instance.tokenChecked) {
        // elem.setAttribute('onclick', 'LoginTest.i.logout()')
        // TokenController.instance.changeHeaderButtons('token valid')
      } else {
        const config = {
          method: 'GET',
          url: DCCCommonServer.managerAddressAPI + 'auth/check',
          withCredentials: true
        }

        await axios(config)
          .then(function (endpointResponse) {
            // console.log('check token');
            TokenController.instance.changeHeaderButtons(endpointResponse.data)
          })
          .catch(function (error) {
            console.log('=== check token error')
            console.log(error)
          })
      }
    }
  }

  async changeHeaderButtons(response){

      if (document.readyState === 'complete') {

        try {
          const elemLogin = document.querySelector('#login-block')
          const elemLogout = document.querySelector('#logout-block')

          if(response.token === 'token valid'){
            // console.log(response.token)
            elemLogin.style.display = 'none'
            elemLogout.style.display = 'block'
            document.querySelector('#logoutDropdownBtn').innerHTML = response.username
          }else{
            // console.log(response.token)
            elemLogin.style.display = 'block'
            elemLogout.style.display = 'none'
          }
        } catch (e) {
          // console.log(e)
        }
        MessageBus.ext.publish('control/validate/ready')
      }else{
        window.addEventListener("load", function(event) {
          try {
            const elemLogin = document.querySelector('#login-block')
            const elemLogout = document.querySelector('#logout-block')

            if(response.token === 'token valid'){
              // console.log(response.token)
              elemLogin.style.display = 'none'
              elemLogout.style.display = 'block'
              document.querySelector('#logoutDropdownBtn').innerHTML = response.username
            }else{
              // console.log(response.token)
              elemLogin.style.display = 'block'
              elemLogout.style.display = 'none'
            }
          } catch (e) {
            // console.log(e)
          }
          MessageBus.ext.publish('control/validate/ready')
        });
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
        // console.log(endpointResponse.data)
        // endpointResponse.data === 'token valid' ? TokenController.instance.checkToken(true) : window.location.href = '/login'
        endpointResponse.data.token === 'token valid' ? TokenController.instance.changeHeaderButtons(endpointResponse.data) : window.location.href = '/user'
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

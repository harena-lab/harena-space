class LoginTest {
  async login () {
    const endpointUrl = 'http://localhost:10020/api/v2/auth/login'
    const email = document.getElementById('email').value
    const pswd = document.getElementById('password').value
    var config = {
      method: 'post',
      url: endpointUrl,
      withCredentials: true,
      data: {
        email: email,
        password: pswd
      }
    }
    console.log('=== config')
    console.log(config)
    await axios(config)
      .then(function (endpointResponse) {
        console.log(endpointResponse.status)
        window.location.href = '/'
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  async logout () {
    const endpointUrl = 'http://localhost:10020/api/v2/auth/logout'

    var config = {
      method: 'post',
      url: endpointUrl,
      withCredentials: true
    }
    await axios(config)
      .then(function (endpointResponse) {
        console.log(endpointResponse.status)
        window.location.href = '/'
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}

(function () {
  LoginTest.i = new LoginTest()
})()

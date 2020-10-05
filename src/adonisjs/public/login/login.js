


class LoginTest {
  async login () {
    // const endpointUrl = Env.get('HARENA_MANAGER_URL') + '/api/v2/auth/login'
    // const endpointUrl = DCCCommonServer.managerAddressAPI + 'api/v2/auth/login'
    const endpointUrl = 'http://localhost:10020/api/v2/auth/login'

    var config = {
      method: 'post',
      url: endpointUrl,
      withCredentials: true,
      data: {
        email: 'jacinto@email.com',
        password: 'jacinto'
      }
    }
    await axios(config)
      .then(function (endpointResponse) {
        const responseUser = endpointResponse.data
        // session.put('username', responseUser.username)
        // await auth.loginViaId(responseUser.id)
        // console.log(endpointResponse)

        console.log(responseUser)
        // response.cookie('token', responseUser.token)
        // const endpointUrl2 = Env.get('HARENA_MANAGER_URL') + '/api/v1/case/04ef4c85-1823-4955-81a5-2da6e30ca7a1'
        const endpointUrl2 = 'http://localhost:10020/api/v1/case/69f34fb7-d510-4507-ba39-d69c6d615ce2'

        var config2 = {
          method: 'get',
          url: endpointUrl2,
          withCredentials: true
          // origin: "localhost:10010"
        }

        axios(config2)
          .then(function (endpointResponse2) {
            console.log(endpointResponse2)
          }).catch(function (error) {
            console.log(error)
          })

        // response.cookie('token', responseUser.token)
        // return response.route('index')
      })
      .catch(function (error) {
        console.log(error)
      })

  }
}

(function () {
  LoginTest.i = new LoginTest()
  // AuthorManager.jsonNote = '(function() { PlayerManager.player.presentNote(`{knot}`) })();'

  // AuthorManager.author = new AuthorManager()
})()

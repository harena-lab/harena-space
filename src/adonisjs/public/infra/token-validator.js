class HarenaController {
  constructor () {



        //this.test();

  }
  async checkToken (){

    if(DCCCommonServer.token != 'undefined'){

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
        // return response.redirect('/')
        console.log('=== check token response')
        console.log(endpointResponse.data);
        let elem = document.getElementById('header-login');
        endpointResponse.data='jwt token true' ? elem.parentNode.removeChild(elem):console.log('shit');;

      })
      .catch(function (error) {
        console.log('=== check token error')
        console.log(error)
      })
    }else{
      console.log('token invalid');
      let elem = document.getElementById('header-logout');
      elem.parentNode.removeChild(elem);
    }

  }
}
(function () {
  HarenaController.instance = new HarenaController()
  HarenaController.instance.checkToken();
})()

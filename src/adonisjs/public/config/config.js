class HarenaConfig {
}

(function () {
  HarenaConfig.local = false
  if(document.location.host === "localhost:10010"){
    HarenaConfig.manager = {
      url: 'http://localhost:10020',
      api: '/api/v1'
    }
  }else {
    HarenaConfig.manager = {
      url: 'https://' + document.location.host + '/manager',
      api: '/api/v1'
    }
  }

})()

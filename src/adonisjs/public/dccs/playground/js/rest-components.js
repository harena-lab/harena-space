

(function () {

DCC.contentComponent(
  'xkcd',
  'dcc-rest',
  {
    paths: {
      'http://xkcd.com/{comic_id}/info.0.json': {
        'get': {
          operationId: 'info'
        }
      }
    }
  }
)

DCC.contentComponent(
  'coronavirus',
  'dcc-rest',
  {
    paths: {
      'https://api.quarantine.country/api/v1/spots/year?region={region}': {
        'get': {
          operationId: 'latest'
        }
      }
    }
  }
)

DCC.contentComponent(
  'auth',
  'dcc-rest',
  {
    paths: {
      'https://harena.ds4h.org/manager/api/v1/auth/login/': {
        'get': {
          operationId: 'latest',
          parameters: [
            {name: 'email',
             in: 'query'},
            {name: 'password',
             in: 'query'}
          ]
        }
      }
    }
  }
)

})()
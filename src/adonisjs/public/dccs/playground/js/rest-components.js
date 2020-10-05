

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
  'harena-login',
  'dcc-rest',
  {
    credentials: 'store',
    oas: {
      paths: {
        'http://localhost:10020/api/v1/auth/login/': {
          'post': {
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
  }
)

DCC.contentComponent(
  'harena-login',
  'dcc-rest',
  {
    credentials: 'use',
    oas: {
      paths: {
        'http://localhost:10020/api/v1/auth/login/': {
          'post': {
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
  }
)

})()
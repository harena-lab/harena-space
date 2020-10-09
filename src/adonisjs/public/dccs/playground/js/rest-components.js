

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
        'http://localhost:10020/api/v2/auth/login': {
          'post': {
            operationId: 'login',
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
  'harena-roles',
  'dcc-rest',
  {
    credentials: 'use',
    oas: {
      paths: {
        'http://localhost:10020/api/v1/admin/roles': {
          'get': {
            operationId: 'roles',
            parameters: []
          }
        }
      }
    }
  }
)

DCC.contentComponent(
  'harena-cases',
  'dcc-rest',
  {
    credentials: 'use',
    oas: {
      paths: {
        'http://localhost:10020/api/v1/author/quest/cases?questId={questId}': {
          'get': {
            operationId: 'cases',
            parameters: [
              {name: 'questId'}
            ]
          }
        }
      }
    }
  }
)

})()
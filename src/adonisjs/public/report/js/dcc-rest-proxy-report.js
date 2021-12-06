(function () {

DCC.component(
  'harena-logger-list',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
    },
    oas: {
      paths: {
        '{url-manager}/logger/list': {
          'get': {
            operationId: 'loggers',
            parameters: [
              {name: 'url-manager',
               in: 'path'},
              {name: 'caseId',
               in: 'query'}
            ]
          }
        }
      }
    }
  }
)

DCC.component(
  'harena-logger-list-page',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api,
      'caseId': new URL(document.location).searchParams.get('id')
    },
    oas: {
      paths: {
        '{url-manager}/logger/list': {
          'get': {
            operationId: 'loggers',
            parameters: [
              {name: 'url-manager',
               in: 'path'},
              {name: 'caseId',
               in: 'query'}
            ]
          }
        }
      }
    }
  }
)

})()

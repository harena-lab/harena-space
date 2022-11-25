(function () {

DCC.component(
  'harena-quest-cases',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api,
      'questId': new URL(document.location).searchParams.get('questid')
    },
    oas: {
      paths: {
        '{url-manager}/author/quest/cases': {
          'get': {
            operationId: 'quest-cases',
            parameters: [
              {name: 'url-manager',
               in: 'path'},
              {name: 'questId',
               in: 'query'}
            ]
          }
        }
      }
    }
  }
)

DCC.component(
  'harena-load-case',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
    },
    oas: {
      paths: {
        '{url-manager}/case': {
          'get': {
            operationId: 'case',
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

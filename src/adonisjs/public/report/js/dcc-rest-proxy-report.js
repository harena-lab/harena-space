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

DCC.component(
  'harena-group-users',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api,
      'groupId': new URL(document.location).searchParams.get('id')
    },
    oas: {
      paths: {
        '{url-manager}/group/users': {
          'get': {
            operationId: 'group',
            parameters: [
              {name: 'url-manager',
               in: 'path'},
              {name: 'groupId',
               in: 'query'}
            ]
          }
        }
      }
    }
  }
)

DCC.component(
  'harena-user-cases',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
    },
    oas: {
      paths: {
        '{url-manager}/user/cases': {
          'get': {
            operationId: 'user-cases',
            parameters: [
              {name: 'url-manager',
               in: 'path'},
              {name: 'clearance',
               in: 'query'},
              {name: 'nItems',
               in: 'query'}
            ]
          }
        }
      }
    }
  }
)

DCC.component(
  'harena-case',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api,
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

(function () {

DCC.component(
  'harena-create-user',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
    },
    oas: {
      paths: {
        '{url-manager}/user/self': {
          'post': {
            operationId: 'create-user',
            parameters: [
              {name: 'url-manager',
               in: 'path'},
              {name: 'username',
               in: 'query'},
              {name: 'email',
               in: 'query'},
              {name: 'password',
               in: 'query'},
              {name: 'login',
               in: 'query'},
              {name: 'institution',
               in: 'query'},
              {name: 'grade',
               in: 'query'},
              {name: 'property_ids',
                in: 'query'},
              {name: 'property_values',
                in: 'query'},
              {name: 'eventId',
               in: 'query'}
            ]
          }
        }
      }
    }
  }
)

DCC.component(
  'harena-link-term',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
    },
    oas: {
      paths: {
        '{url-manager}/term/link/user': {
          'post': {
            operationId: 'create-user',
            parameters: [
              {name: 'url-manager',
               in: 'path'},
              {name: 'userId',
               in: 'query'},
              {name: 'termId',
               in: 'query'},
              {name: 'nameResponsible',
               in: 'query'},
              {name: 'emailResponsible',
                in: 'query'},
              {name: 'nameParticipant',
               in: 'query'},
              {name: 'date',
               in: 'query'},
              {name: 'role',
               in: 'query'},
              {name: 'agree',
               in: 'query'}
            ]
          }
        }
      }
    }
  }
)

DCC.component(
  'harena-term-user',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
    },
    oas: {
      paths: {
        '{url-manager}/term/user': {
          'get': {
            operationId: 'users',
            parameters: [
              {name: 'url-manager',
               in: 'path'},
              {name: 'userId',
               in: 'query'},
              {name: 'termId',
               in: 'query'}
            ]
          }
        }
      }
    }
  }
)

DCC.component(
  'harena-login-event',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
    },
    oas: {
      paths: {
        '{url-manager}/auth/login_event': {
          'post': {
            operationId: 'login',
            parameters: [
              {name: 'url-manager',
               in: 'path'},
              {name: 'eventId',
               in: 'query'},
              {name: 'username',
               in: 'query'},
            ]
          }
        }
      }
    }
  }
)

})()

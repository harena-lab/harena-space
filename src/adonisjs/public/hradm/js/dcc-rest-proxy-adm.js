(function () {

DCC.component(
  'harena-users',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
    },
    oas: {
      paths: {
        '{url-manager}/admin/users': {
          'get': {
            operationId: 'users',
            parameters: [
              {name: 'url-manager',
               in: 'path'}
            ]
          }
        }
      }
    }
  }
)

DCC.component(
  'harena-create-user',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
    },
    oas: {
      paths: {
        '{url-manager}/user': {
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
               in: 'query'}
            ]
          }
        }
      }
    }
  }
)

DCC.component(
  'harena-link-user-role',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
    },
    oas: {
      paths: {
        '{url-manager}/admin/user/link/role': {
          'post': {
            operationId: 'link-user-role',
            parameters: [
              {name: 'url-manager',
               in: 'path'},
              {name: 'userId',
               in: 'query'},
              {name: 'roleId',
               in: 'query'}
            ]
          }
        }
      }
    }
  }
)

DCC.component(
  'harena-link-user-group',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
    },
    oas: {
      paths: {
        '{url-manager}/group/link/user': {
          'post': {
            operationId: 'link-user-group',
            parameters: [
              {name: 'url-manager',
               in: 'path'},
              {name: 'groupId',
               in: 'query'},
              {name: 'userId',
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
      'groupId': new URL(document.location).searchParams.get('groupid')
    },
    oas: {
      paths: {
        '{url-manager}/group/users': {
          'get': {
            operationId: 'users',
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

})()

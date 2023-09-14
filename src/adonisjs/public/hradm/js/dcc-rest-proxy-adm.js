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

DCC.component(
  'harena-hradm-roles',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api,
    },
    oas: {
      paths: {
        '{url-manager}/admin/roles': {
          'get': {
            operationId: 'roles-list',
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

//Retrieves all groups from database
DCC.component(
  'harena-admin-groups',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api,
    },
    oas: {
      paths: {
        '{url-manager}/admin/groups': {
          'get': {
            operationId: 'admin-group-list',
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
  'harena-admin-users',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api,
      'fInstitution': new URL(document.location).searchParams.get('fInstitution'),
      'fUserType': new URL(document.location).searchParams.get('fUserType'),
      'fGroup': new URL(document.location).searchParams.get('fGroup'),
      'fSearchStr': new URL(document.location).searchParams.get('fSearchStr'),
      'page': new URL(document.location).searchParams.get('page'),
      'nItems': new URL(document.location).searchParams.get('limit'),
    },
    oas: {
      paths: {
        '{url-manager}/admin/users': {
          'get': {
            operationId: 'admin-users-list',
            parameters: [
              {name: 'url-manager',
                in: 'path'},
              {name: 'fInstitution',
                in: 'query'},
              {name: 'fUserType',
                in: 'query'},
              {name: 'fGroup',
                in: 'query'},
              {name: 'fSearchStr',
                in: 'query'},
              {name: 'page',
                in: 'query'},
              {name: 'nItems',
                in: 'query'},
            ]
          }
        }
      }
    }
  }
)

DCC.component(
  'harena-admin-gen-login-token',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api,
    },
    oas: {
      paths: {
        '{url-manager}/admin/user/temp_login': {
          'put': {
            operationId: 'admin-gen-login-token',
            parameters: [
              {name: 'url-manager',
                in: 'path'},
              {name: 'userId',
                in: 'query'},

            ]
          }
        }
      }
    }
  }
),

DCC.component(
  'harena-admin-user-info',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api,
    },
    oas: {
      paths: {
        '{url-manager}/user/{userId}': {
          'get': {
            operationId: 'admin-user-info',
            parameters: [
              {name: 'url-manager',
                in: 'path'},
              {name: 'userId',
                in: 'path'},
            ]
          }
        }
      }
    }
  }
)

})()

(function () {

<<<<<<< Updated upstream
  DCC.contentComponent(
    'harena-login',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
      },
      oas: {
        paths: {
          '{url-manager}/auth/login': {
            'post': {
              operationId: 'login',
              parameters: [
                {name: 'url-manager',
                 in: 'path'},
                {name: 'email',
                 in: 'query'},
                {name: 'password',
                 in: 'query'},
              ]
            }
=======
DCC.component(
  'harena-login',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
    },
    oas: {
      paths: {
        '{url-manager}/auth/login': {
          'post': {
            operationId: 'login',
            parameters: [
              {name: 'url-manager',
               in: 'path'},
              {name: 'email',
               in: 'query'},
              {name: 'password',
               in: 'query'},
            ]
>>>>>>> Stashed changes
          }
        }
      }
    }
  )

<<<<<<< Updated upstream
  DCC.contentComponent(
    'harena-logout',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
      },
      oas: {
        paths: {
          '{url-manager}/auth/logout': {
            'post': {
              operationId: 'logout',
              parameters: [
                {name: 'url-manager',
                 in: 'path'}
              ]
            }
=======
DCC.component(
  'harena-roles',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
    },
    oas: {
      paths: {
        '{url-manager}/admin/roles': {
          'get': {
            operationId: 'roles',
            parameters: [
              {name: 'url-manager',
               in: 'path'}
            ]
>>>>>>> Stashed changes
          }
        }
      }
    }
  )

<<<<<<< Updated upstream
  DCC.contentComponent(
    'harena-roles',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
      },
      oas: {
        paths: {
          '{url-manager}/admin/roles': {
            'get': {
              operationId: 'roles',
              parameters: [
                {name: 'url-manager',
                 in: 'path'}
              ]
            }
=======
DCC.component(
  'harena-cases',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
    },
    oas: {
      paths: {
        'http://localhost:10020/api/v1/author/quest/cases?questId={questId}': {
          'get': {
            operationId: 'cases',
            parameters: [
              {name: 'url-manager',
               in: 'path'},
              {name: 'questId',
               in: 'path'}
            ]
>>>>>>> Stashed changes
          }
        }
      }
    }
  )

  DCC.contentComponent(
    'harena-cases',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
      },
      oas: {
        paths: {
          'http://localhost:10020/api/v1/author/quest/cases?questId={questId}': {
            'get': {
              operationId: 'cases',
              parameters: [
                {name: 'url-manager',
                 in: 'path'},
                {name: 'questId',
                 in: 'path'}
              ]
            }
          }
        }
      }
    }
  )
  DCC.contentComponent(
    'harena-categories',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
      },
      oas: {
        paths: {
          '{url-manager}/author/category/list': {
            'get': {
              operationId: 'categories',
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

})()

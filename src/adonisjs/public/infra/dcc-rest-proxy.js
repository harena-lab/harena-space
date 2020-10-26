(function () {

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
            }
          }
        }
      }
    }
  )

  DCC.component(
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
          }
        }
      }
    }
  )

  DCC.component(
    'harena-create-case',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
      },
      oas: {
        paths: {
          '{url-manager}/case': {
            'post': {
              operationId: 'create-case',
              parameters: [
                {name: 'url-manager',
                 in: 'path'},
                {name: 'title',
                 in: 'query'},
                {name: 'source',
                 in: 'query'},
                {name: 'description',
                 in: 'query'},
                {name: 'language',
                 in: 'query'},
                {name: 'domain',
                 in: 'query'},
                {name: 'specialty',
                 in: 'query'},
                {name: 'keywords',
                 in: 'query'},
                {name: 'creationDate',
                 in: 'query'},
                {name: 'institution',
                 in: 'query'},
                {name: 'complexity',
                 in: 'query'},
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
        'caseId': new URL(document.location).searchParams.get('id')
      },
      oas: {
        paths: {
          '{url-manager}/case/{caseId}': {
            'get': {
              operationId: 'quests',
              parameters: [
                {name: 'url-manager',
                 in: 'path'},
                {name: 'caseId',
                  in: 'path'}
              ]
            }
          }
        }
      }
    }
  )

  DCC.component(
    'harena-category-list',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
      },
      oas: {
        paths: {
          '{url-manager}/category/list': {
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

  DCC.component(
    'harena-category-cases',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api,
        'categoryId': new URL(document.location).searchParams.get('id'),
        'clearance': new URL(document.location).searchParams.get('clearance')
      },
      oas: {
        paths: {
          '{url-manager}/category/cases?categoryId={categoryId}&clearance={clearance}': {
            'get': {
              operationId: 'category-cases',
              parameters: [
                {name: 'url-manager',
                 in: 'path'},
                {name: 'categoryId',
                  in: 'path'},
                {name: 'clearance',
                  in: 'path'}
              ]
            }
          }
        }
      }
    }
  )

  DCC.component(
    'harena-quest-list',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
      },
      oas: {
        paths: {
          '{url-manager}/author/quests': {
            'get': {
              operationId: 'quests',
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
    'harena-quest-cases',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api,
        'questId': new URL(document.location).searchParams.get('id')
      },
      oas: {
        paths: {
          '{url-manager}/author/quest/cases?questId={questId}': {
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

  DCC.component(
    'harena-user-cases',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api,
        'clearance': new URL(document.location).searchParams.get('clearance')
      },
      oas: {
        paths: {
          '{url-manager}/user/cases?clearance={clearance}': {
            'get': {
              operationId: 'user-cases',
              parameters: [
                {name: 'url-manager',
                 in: 'path'},
                {name: 'clearence',
                 in: 'path'}
              ]
            }
          }
        }
      }
    }
  )

  DCC.component(
    'harena-player-quests',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
      },
      oas: {
        paths: {
          '{url-manager}/player/quests': {
            'get': {
              operationId: 'quests',
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

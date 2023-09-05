(function () {

DCC.component(
  'harena-quest-list',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
    },
    oas: {
      paths: {
        '{url-manager}/user/quests': {
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
  'harena-room-list',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
    },
    oas: {
      paths: {
        '{url-manager}/admin/room/list': {
          'get': {
            operationId: 'rooms',
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
  'harena-link-case-quest',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
    },
    oas: {
      paths: {
        '{url-manager}/quest/link/case': {
          'post': {
            operationId: 'link-case-quest',
            parameters: [
              {name: 'url-manager',
               in: 'path'},
              {name: 'questId',
               in: 'query'},
              {name: 'caseId',
               in: 'query'},
              {name: 'orderPosition',
               in: 'query'}
            ]
          }
        }
      }
    }
  }
)

DCC.component(
  'harena-link-case-room',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
    },
    oas: {
      paths: {
        '{url-manager}/admin/room/link/case': {
          'post': {
            operationId: 'link-case-room',
            parameters: [
              {name: 'url-manager',
               in: 'path'},
              {name: 'room_id',
               in: 'query'},
              {name: 'case_id',
               in: 'query'}
            ]
          }
        }
      }
    }
  }
)

})()

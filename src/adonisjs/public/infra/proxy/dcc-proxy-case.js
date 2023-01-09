(function () {

DCC.component(
  'harena-room-load-case',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
    },
    oas: {
      paths: {
        '{url-manager}/room/case': {
          'get': {
            operationId: 'case',
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

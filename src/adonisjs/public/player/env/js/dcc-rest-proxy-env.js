(function () {

DCC.component(
  'harena-share',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
    },
    oas: {
      paths: {
        '{url-manager}/case/share': {
          'post': {
            operationId: 'case-share',
            parameters: [
              {name: 'url-manager',
               in: 'path'},
              {name: 'entity',
               in: 'query'},
              {name: 'subject',
               in: 'query'},
              {name: 'clearance',
               in: 'query'},
              {name: 'table_id',
               in: 'query'}
            ]
          }
        }
      }
    }
  }
)

})()

/*
 * Bundle of Knowledge related proxies
 */

(function () {

DCC.component(
  'harena-case-annotate',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
    },
    oas: {
      paths: {
        '{url-manager}/case/annotation': {
          'post': {
            operationId: 'case-annotate',
            parameters: [
              {name: 'url-manager',
               in: 'path'},
              {name: 'case_id',
               in: 'query'},
              {name: 'property_id',
               in: 'query'},
              {name: 'range',
               in: 'query'},
              {name: 'fragment',
               in: 'query'},
              {name: 'property_value',
               in: 'query'},
              {name: 'source',
               in: 'query'}
            ]
          }
        }
      }
    }
  }
)

DCC.component(
  'harena-case-annotations',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
    },
    oas: {
      paths: {
        '{url-manager}/case/annotations': {
          'get': {
            operationId: 'case-annotations',
            parameters: [
              {name: 'url-manager',
               in: 'path'},
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
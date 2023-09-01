(function () {
    DCC.component(
        'harena-inf331-complete-lab',
        'dcc-rest',
        {
          environment: {
            'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api,
            'entity': 'group',
            'clearance': '5',
            'subject_grade':'professor',
            'subject': 'INF 331 - 2023',
            // 'subject': sessionStorage.getItem('harena-user-institution-id'),
            'table_id': new URL(document.location).searchParams.get('id'),
          },
          oas: {
            paths: {
              '{url-manager}/case/share': {
                'post': {
                  operationId: 'inf331-complete-lab',
                  parameters: [
                    {name: 'url-manager',
                      in: 'path'},
                    {name: 'clearance',
                      in: 'query'},
                    {name: 'entity',
                      in: 'query'},
                    {name: 'subject',
                      in: 'query'},
                    {name: 'subject_grade',
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
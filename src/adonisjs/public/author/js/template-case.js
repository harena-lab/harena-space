class TemplateToCase {
  async start () {
    const authorState = Basic.service.authorStateRetrieve()
    if (authorState != null && authorState.template != null) {
      document.querySelector('#template-title').innerHTML =
            'Create: ' + authorState.template.title
    }
  }

  async storeCase () {

    document.querySelector('#btn-submit-form').addEventListener('click',
      async function () {
        try {
          const _url = new URL(document.location)
          document.querySelector('#template').value = _url.searchParams.get('template').replace(/__/ig, '/')
          document.querySelector('#category').value = _url.searchParams.get('category')

          const params = new FormData(document.querySelector('#create-case-form'))
          const templateMd =
            await MessageBus.i.request(
              'data/template/' + params.get('template').replace(/\//g, '.') +
                '/get', {static: false}, null, true)
          let markdown = templateMd.message

          if (markdown != null) {
            const config = {
              method: 'POST',
              url: DCCCommonServer.managerAddressAPI + 'case',
              data: {
                title: params.get('title'),
                description: params.get('description'),
                language: params.get('language'),
                domain: params.get('domain'),
                specialty: params.get('specialty'),
                keywords: params.get('keywords'),
                source: markdown,
                original_date: params.get('creationDate'),
                complexity: params.get('complexity'),
                // institution: params.get('institution')
              },
              withCredentials: true
            }

            let _caseId
            await axios(config)
              .then(function (endpointResponse) {
                _caseId = endpointResponse.data.id
              })
              .catch(function (error) {
                console.log(error)
              })

            const linkCase = {
              method: 'POST',
              url: DCCCommonServer.managerAddressAPI + 'category/link/case',
              data: {
                categoryId: params.get('category'),
                caseId: _caseId,
                orderPosition: 0
              },
              withCredentials: true
            }
            await axios(linkCase)
              .then(function (endpointResponse) {
                window.location.href = '/author/?id=' + _caseId
              })
              .catch(function (error) {
                console.log(error)
                window.location.href = '/author/?id=' + _caseId
              })
          }
        } catch (e) {
          console.log(e)
        }
      }
    )
  }

  //Object containing key 'params'. 
  //Inside it, needs to contain 'title','description','language','domain','keywords','creationDate','complexity'
  //'category','template'
  async storeCaseNoUi (incoming) {
      let _caseId
      try {
        const _url = new URL(document.location)

        const params = incoming['params']
        const templateMd =
          await MessageBus.i.request(
            'data/template/' + params['template'].replace(/\//g, '.') +
              '/get', {static: false}, null, true)
        let markdown = templateMd.message

        if (markdown != null) {
          const config = {
            method: 'POST',
            url: DCCCommonServer.managerAddressAPI + 'case',
            data: {
              title: params['title'],
              description: params['description'],
              language: params['language'],
              domain: params['domain'],
              specialty: params['specialty'],
              keywords: params['keywords'],
              source: markdown,
              original_date: params['creationDate'],
              complexity: params['complexity'],
            },
            withCredentials: true
          }

          
          await axios(config)
            .then(function (endpointResponse) {
              _caseId = endpointResponse.data.id
            })
            .catch(function (error) {
              console.log(error)
            })

          const linkCase = {
            method: 'POST',
            url: DCCCommonServer.managerAddressAPI + 'category/link/case',
            data: {
              categoryId: params['category'],
              caseId: _caseId,
              orderPosition: 0
            },
            withCredentials: true
          }
          await axios(linkCase)
            .then(function (endpointResponse) {
              // window.location.href = '/author/?id=' + _caseId
            })
            .catch(function (error) {
              console.log(error)
              // window.location.href = '/author/?id=' + _caseId
            })
        }
        return {'data':_caseId,'message':'Case created successfully!','status':200}
      } catch (e) {
        console.log(e)
      }
    }
  }


(function () {
  TemplateToCase.s = new TemplateToCase()
})()

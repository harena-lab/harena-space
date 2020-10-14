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

          const params = new FormData(document.querySelector('form'))
          // params.set('template', _url.searchParams.get('template').replace(/__/ig, "/"))
          // params.set('quest', _url.searchParams.get('quest'))
          console.log(params.get('template'));
          // for (var pair of params.entries()) {
          //   console.log(pair[0] + ': ' + pair[1])
          // }
          const endpointUrl = DCCCommonServer.managerAddressAPI + 'case'
          // console.log(params)

          // load template
          const templateRequest = {
            method: 'GET',
            url: '/templates/' +
            params.get('template') + '.md'
          }

          let markdown = null
          await axios(templateRequest)
            .then(function (endpointResponse) {
              markdown = endpointResponse.data
            })
            .catch(function (error) {
              console.log(error)
              console.log(error.code)
            })

          if (markdown != null) {
            const config = {
              method: 'POST',
              url: endpointUrl,
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
                institution: params.get('institution')
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
                categoryId: params.get('quest'),
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
              })
          }
        } catch (e) {
          console.log(e)
        }
      }
    )
  }
}

(function () {
  TemplateToCase.s = new TemplateToCase()
})()

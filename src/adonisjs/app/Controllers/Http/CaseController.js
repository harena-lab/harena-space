/* global use */

'use strict'

const Env = use('Env')
const axios = use('axios')
const View = use('View')

View.global('currentTime', function () {
  // return ("asease")
})

class CaseController {
  create ({ view }) {
    return view.render('author.author')
  }

  async fetch ({ view }) {
    const harenaManagerUrl = Env.get('HARENA_MANAGER_URL', 'http://127.0.0.1:1020')
    const casesUrl = harenaManagerUrl + '/cases'
    axios.get(casesUrl)
      .then((response) => {
        console.log(response)
      }, (error) => {
        console.log(error)
      })
  }

  async store ({ view, request, session, response }) {
    try {
      const params = request.all()
      const endpointUrl = Env.get('HARENA_MANAGER_URL') + '/api/v1/case'

      const token = request.cookie('token')

      // load template
      const templateRequest = {
        method: 'GET',
        url: Env.get('HARENA_SPACE_URL') + '/templates/' +
        params.template + '.md',
        headers: {
          Authorization: 'Bearer ' + request.cookie('token')
        }
      }

      let markdown = null
      await axios(templateRequest)
        .then(function (endpointResponse) {
          markdown = endpointResponse.data
        })
        .catch(function (error) {
          console.log(error)
        })

      if (markdown != null) {
        const config = {
          method: 'POST',
          url: endpointUrl,
          data: {
            title: params.case_title,
            description: params.description,
            language: params.language,
            domain: params.domain,
            specialty: params.specialty,
            keywords: params.keywords,
            source: markdown,
            original_date: params.creationDate
          },
          headers: {
            Authorization: 'Bearer ' + token
          }
        }

        await axios(config)
          .then(function (endpointResponse) {
            return response.redirect('/author/?id=' + endpointResponse.data.id)
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    } catch (e) {
      console.log(e)
    }
  }

  async update ({ request, session, response }) {
    try {
      const params = request.all()
      console.log('UPDATE STARTING........')
      const endpointUrl =
      Env.get('HARENA_MANAGER_URL') + '/api/v1/case/' + params.case_id

      const token = request.cookie('token')
      const config = {
        method: 'PUT',
        url: endpointUrl,
        data: {
          title: params.case_title,
          description: params.description,
          language: params.language,
          domain: params.domain,
          specialty: params.specialty,
          keywords: params.keywords,
          originalDate: params.originalDate,
          source: params.source
        },
        headers: {
          Authorization: 'Bearer ' + token
        }
      }

      await axios(config)
        .then(function () {
          // return response.redirect('/')
        })
        .catch(function (error) {
          console.log(error)
        })
    } catch (e) {
      console.log(e)
    }
  }

  async getCase ({ view, request, response, params }) {
    try {
      const endpointUrl = Env.get('HARENA_MANAGER_URL') + '/api/v1/case/' + request.input('id')
      // "d2ad02da-b7e1-4391-9f65-4f93eeb4ca7f"
      var config = {
        method: 'get',
        url: endpointUrl,
        headers: {
          Authorization: 'Bearer ' + request.cookie('token')
        }
      }

      await axios(config)
        .then(function (endpointResponse) {
          // DCCCommonServer.setCaseObj(endpoint_response);

          // return view.render('author.author')
          const responseContent = endpointResponse.data
          const caseId = responseContent.id
          const caseTitle = responseContent.title
          const caseDescription = responseContent.description
          const caseLanguage = responseContent.language
          const caseInstitution = responseContent.institution
          const caseDomain = responseContent.domain
          const caseSpecialty = responseContent.specialty
          const caseKeywords = responseContent.keywords
          const caseOriginalDate = responseContent.original_date
          const caseSource = responseContent.source.replace(/"/gm, '\\"')

          return view.render('author.author',
            { caseId, caseTitle, caseDescription, caseLanguage, caseInstitution, caseDomain, caseSpecialty, caseKeywords, caseOriginalDate, caseSource })
        })
        .catch(function (error) {
          console.log(error)
        })
    } catch (e) {
      console.log(e)
    }
    return view.render('author.author')
  }

  async populateModal ({ params, request, view, response }) {
    try {
      // const params = request.all()

      const endpointUrl = Env.get('HARENA_MANAGER_URL') + '/api/v1/case/' + request.input('id')

      var config = {
        method: 'get',
        url: endpointUrl,
        headers: {
          Authorization: 'Bearer ' + request.cookie('token')
        }
      }

      await axios(config)
        .then(function (endpointResponse) {
          console.log(endpointResponse.data)
          // return view.render('author.author')

          return view.render('author.author')
        })
        .catch(function (error) {
          console.log(error)
        })
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = CaseController

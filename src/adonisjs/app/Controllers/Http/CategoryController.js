'use strict'

const Env = use('Env')
const axios = use('axios')
const view = use('View')

class CategoryController {
  async getCasesByCategory ({ request, response, params }) {
    try {
      // console.log('------------------------COR DA QUEST')
      // console.log(params.color)
      var responseData = []
      const endpointUrl = Env.get('HARENA_MANAGER_URL') + '/api/v1/category/cases'

      var config = {
        method: 'get',
        url: endpointUrl,
        data: {
          categoryId: params.categoryId
        },
        headers: {
          'Authorization': 'Bearer ' + request.cookie('token')
        }
      }

      await axios(config)
        .then(function (endpointResponse) {
          console.log('============ Retrieving cases for selected categories')
          console.log(endpointResponse.data)
          const busResponse = []
          for (const c in endpointResponse.data) {
            busResponse.push({
              id: endpointResponse.data[c].id,
              title: endpointResponse.data[c].title

            })
          }

          function sortAlphabetically (a, b) {
            if (a.title < b.title) {
              return -1
            }
            if (a.title > b.title) {
              return 1
            }
            return 0
          }
          responseData[0] = busResponse.sort(sortAlphabetically)

        })

        .catch(function (error) {
          console.log(error)
        })
    } catch (e) {
      console.log(e)
    }

    return view.render('author.drafts-cases', { cases: responseData[0] })

  }

  async getCategories ({ request, response }) {
    try {
      var responseData = []

      const endpointUrl = Env.get("HARENA_MANAGER_URL") + "/api/v1/category/list"

      var config = {
        method: 'get',
        url: endpointUrl,
        headers: {

          'Authorization': 'Bearer ' + request.cookie('token')
        }
      }

      await axios(config)
        .then(function (endpointResponse) {
          console.log('============ Retrieving categories')
          console.log(endpointResponse.data)
          const busResponse = []
          for (const c in endpointResponse.data) {
            busResponse.push({
              id: endpointResponse.data[c].id,
              title: endpointResponse.data[c].title,
              url: endpointResponse.data[c].url

            })
          }
          responseData[0] = busResponse
        })

        .catch(function (error) {
          console.log(error)
        })
    } catch (e) {
      console.log(e)
    }

    return view.render('author.drafts-category', { categories: responseData[0] })
  }
}

module.exports = CategoryController

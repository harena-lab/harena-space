'use strict'

const Env = use("Env")
const axios = use("axios")


class CaseController {
    async fetch ({ view }) {

        const harena_manager_url = Env.get("HARENA_MANAGER_URL", "http://127.0.0.1:1020");
        const cases_url = harena_manager_url + "/cases"        
        const cases = axios.get(cases_url)
                      .then((reponse) => {
                          console.log(reponse)
                      }, (error) => {
                          console.log(error)
                      })
    }

    async store ({request, session, reponse}) {
        try {
            request.all()

            await axios(config)
            .then(function (endpoint_response) {
                return response.redirect('/author/author.html')
                })
            .catch(function (error) {
                // console.log(error);
            });

        }
        catch (e) {
            console.log(e)
        }
    }
}

module.exports = CaseController

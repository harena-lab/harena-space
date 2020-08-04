'use strict'

const Env = use("Env")

class CaseController {
    async index ({ view }) {

        const harena_manager_url = Env.get("HARENA_MANAGER_URL", "http://127.0.0.1:1020");
        const cases_url = harena_manager_url + "/cases"        
        const cases = axios.get(cases_url)
                      .then((reponse) => {
                          console.log(reponse)
                      }, (error) => {
                          console.log(error)
                      })
    }
}

module.exports = CaseController

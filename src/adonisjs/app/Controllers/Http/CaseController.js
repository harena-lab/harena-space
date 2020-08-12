'use strict'

const Env = use("Env")
const axios = use("axios")
const View = use('View')

View.global('currentTime', function () {
    return ("asease")
  })

class CaseController {

    create({ view }){
        return view.render('author.author')
      }


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



    async store ({request, session, response}) {
        try {
            const params = request.all()
            //console.log("-------------------------------------------------------------------------------------------------------")
            //console.log(request.cookie('token'))
            const endpoint_url = Env.get("HARENA_MANAGER_URL") + "/api/v1/case"

            /*
            const template_source =
            `
            # Presentation (quiz)

            Write here the **stem** of your quiz.

            > Write here the **lead-in** of your quiz.
            + Distractor 1 <-> "Feedback for Distractor 1"
            + Distractor 1 <-> "Feedback for Distractor 1"
            + Distractor 2 <-> "Feedback for Distractor 2"
            + Distractor 3 <-> "Feedback for Distractor 3"

            * Next Case -> Case.Next
            * Menu -> Presentation

            # Feedback Note (note)

            You answered: ^Presentation.hypothesis^.

            ^parameter^

            * Return -> Presentation

            ___ Flow ___

            * Sequential:
              * _sequential_

            ___ Data ___

            * theme: simple
            * namespaces:
              * evidence: http://purl.org/versum/evidence/
            * templates:
              * categories:
                * detailed: simple/knot/description
            `
            */

            console.log("******************************************** token from Adonis");
            console.log(request.cookie('token'));
            let token = request.cookie('token')

            // load template
            let templateRequest = {
               method: "GET",
               url: Env.get("HARENA_SPACE_URL") + "/templates/" +
                    params.template + ".md",
               headers: {
                  "Authorization": "Bearer " + request.cookie("token")
               }
            };
            let markdown = null;
            await axios(templateRequest)
               .then(function (endpointResponse) {
                   console.log("================== markdown");
                   console.log(endpointResponse.data);
                   markdown = endpointResponse.data;
                })
               .catch(function (error) {
                  console.log(error);
                });

            if (markdown != null) {
               const config = {
                  method: "POST",
                  url: endpoint_url,
                  data: {
                     title: params.case_title,
                     description: params.description,
                     language: params.language,
                     domain: params.domain,
                     specialty: params.specialty,
                     keywords: params.keywords,
                     source: markdown,
                  },
                  headers: {
                     'Authorization': 'Bearer ' + token
                  }
               }
               await axios(config)
                  .then(function (endpoint_response) {
                      // return response.redirect('/author/author.html')
                      return response.redirect('/home')
                  })
                  .catch(function (error) {
                      console.log(error);
                  });
               }
        }
        catch (e) {
            console.log(e)
        }
        // return response.redirect('/author')
    }


    async update ({request, session, response}) {
        try {
            const params = request.all();
            console.log("-------------------------------------------------------------------------------------------------------");
            console.log("=== params");
            console.log(params);

            //console.log("-------------------------------------------------------------------------------------------------------")
            //console.log(request.cookie('token'))
            const endpoint_url =
               Env.get("HARENA_MANAGER_URL") + "/api/v1/case/" + params.case_id;

            // console.log(request.cookie('token'))
            let token = request.cookie('token')
            const config = {
                method: "PUT",
                url: endpoint_url,
                data: {
                    title: params.case_title,
                    description: params.description,
                    language: params.language,
                    domain: params.domain,
                    specialty: params.specialty,
                    keywords: params.keywords,
                    source: params.source
                },
                headers: {
                   'Authorization': 'Bearer ' + token
                }
            }

            await axios(config)
            .then(function (endpoint_response) {
                // return response.redirect('/author/author.html')
                          //return response.redirect('/')

                })
            .catch(function (error) {
                console.log(error);
            });

        }
        catch (e) {
            console.log(e)
        }
    }

  async populate_modal({ params, request, view, response }) {
    console.log(request.input('id'))
    try{
      // const params = request.all()

      const endpoint_url = Env.get("HARENA_MANAGER_URL") + "/api/v1/case/" + request.input('id')

      var config = {
        method: 'get',
        url: endpoint_url,
        headers: {
          'Authorization': 'Bearer ' + request.cookie('token')
        }
      };


      await axios(config)
        .then(function (endpoint_response) {
            console.log(endpoint_response.data)
          //return view.render('author.author')


          return view.render('author.author')
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch(e){
      console.log(e)
    }
  }
}

module.exports = CaseController

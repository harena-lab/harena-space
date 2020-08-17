'use strict'

const Env = use("Env")
const axios = use("axios")
const View = use('View')

View.global('currentTime', function () {
  //return ("asease")
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



  async store ({view, request, session, response}) {
    
    try {
      const params = request.all()
      //console.log("-------------------------------------------------------------------------------------------------------")
      //console.log(request.cookie('token'))
      const endpoint_url = Env.get("HARENA_MANAGER_URL") + "/api/v1/case"

      console.log("******************************************** token from Adonis");
      console.log(request.cookie('token'));
      console.log(params)
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
            original_date: params.creationDate
          },
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }

        await axios(config)
        .then(function (endpoint_response) {
          return response.redirect('/author/?id='+ endpoint_response.data.id)
          //return response.redirect('/home')
        })
        .catch(function (error) {
          console.log(error);
        });
        
      }
      
    }
    catch (e) {
      console.log(e)
    }


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
          originalDate: params.originalDate,
          source: params.source
        },
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }

      await axios(config)
      .then(function (endpoint_response) {

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

  async getCase({view, request, response, params}){
    try{
      //  const params = request.all();
       console.log(params.id)
       const endpoint_url = Env.get("HARENA_MANAGER_URL") + "/api/v1/case/" + params.id
          // "d2ad02da-b7e1-4391-9f65-4f93eeb4ca7f"

       var config = {
         method: 'get',
         url: endpoint_url,
         headers: {
           'Authorization': 'Bearer ' + request.cookie('token')
         }
       };


       await axios(config)
         .then(function (endpoint_response) {

            // DCCCommonServer.setCaseObj(endpoint_response);

             console.log('=====GET selected case:'+endpoint_response.status)
           //return view.render('author.author')
           let responseContent = endpoint_response.data
           let caseId = responseContent.id
           let caseTitle = responseContent.title
           let caseDescription = responseContent.description
           let caseLanguage = responseContent.language
           let caseInstitution = responseContent.institution
           let caseDomain = responseContent.domain
           let caseSpecialty = responseContent.specialty
           let caseKeywords = responseContent.keywords
           let caseOriginalDate = responseContent.original_date
           let caseSource = responseContent.source.replace(/"/gm, '\\"')
           console.log('THIS IS CASE SOURCE ====================');
           console.log(caseSource);
           return view.render('author.author',
              {caseId, caseTitle, caseDescription, caseLanguage, caseInstitution, caseDomain, caseSpecialty, caseKeywords, caseOriginalDate, caseSource})
         })
         .catch(function (error) {
           console.log(error);
         });
     } catch(e){
       console.log(e)
     }
     return view.render('author.author');
  }

  async populate_modal({ params, request, view, response }) {
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

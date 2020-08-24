'use strict'

const Env = use("Env")
const axios = use("axios")
const view = use('View')

class QuestController {


	async getCasesByQuest({ request, response }) {
		try{
      		const params = request.all()

	      	let endpoint_url = Env.get("HARENA_MANAGER_URL") + "/api/v1/quest/cases" 

		    var config = {
		      method: 'get',
		      url: endpoint_url,
		      data: {
		          questId: params.questId
		          // questId: 'f89c9a67-d6a9-453b-afeb-cfbb079c2a25'
		      },
		      headers: {
		        'Authorization': 'Bearer ' + request.cookie('token')
		      }
		    };


      		await axios(config)
      			.then(function (endpoint_response) {
        			console.log(endpoint_response.data)
          			return response.redirect('/player/home')
      			})
		    	.catch(function (error) {
		        	console.log(error);
		      	});
	    } catch(e){
	      console.log(e)
	    }
  	}
}

module.exports = QuestController

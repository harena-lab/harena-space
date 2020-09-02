'use strict'

const Env = use("Env")
const axios = use("axios")
const view = use('View')

class QuestController {


	async getCasesByQuest({ request, response }) {
		try{
			const params = request.all()
			var responseData = [];
			let endpoint_url = Env.get("HARENA_MANAGER_URL") + "/api/v1/quest/cases"

			var config = {
				method: 'get',
				url: endpoint_url,
				data: {
					questId: params.id
				},
				headers: {
					'Authorization': 'Bearer ' + request.cookie('token')
				}
			};


			await axios(config)
			.then(function (endpoint_response) {
				console.log('============ Retrieving cases for selected quests');
				console.log(endpoint_response.data);
				const busResponse = []
				for (const c in endpoint_response.data) {
					busResponse.push({
						id: endpoint_response.data[c].id,
						title: endpoint_response.data[c].title,

					})

				}
				responseData[0] = busResponse;
			})

			.catch(function (error) {
				console.log(error);
			});
		} catch(e){
			console.log(e)
		}

		return view.render('player.player-cases', { cases: responseData[0],  });

	}
}

module.exports = QuestController

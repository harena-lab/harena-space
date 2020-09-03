'use strict'

const Env = use("Env")
const axios = use("axios")
const view = use('View')

class QuestController {

	async getCasesByQuestAuthor({ request, response }) {
		try{
			const params = request.all()
			console.log('------------------------COR DA QUEST');
			console.log(params.color);
			var responseData = [];
			let endpoint_url = Env.get("HARENA_MANAGER_URL") + "/api/v1/author/quest/cases"

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

		return view.render('author.drafts-cases', { cases: responseData[0]});

	}

	async getCasesByQuest({ request, response }) {
		try{
			const params = request.all()
			console.log('------------------------COR DA QUEST');
			console.log(params.color);
			var responseData = [];
			let endpoint_url = Env.get("HARENA_MANAGER_URL") + "/api/v1/author/quest/cases"

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

		return view.render('player.player-cases', { cases: responseData[0], color: request.input('color')  });

	}
	async getQuestsAuthor({ request, response }) {
		try{
			var responseData = [];
			let endpoint_url = Env.get("HARENA_MANAGER_URL") + "/api/v1/author/quests"

			var config = {
				method: 'get',
				url: endpoint_url,
				headers: {
					'Authorization': 'Bearer ' + request.cookie('token')
				}
			};


			await axios(config)
			.then(function (endpoint_response) {
				console.log('============ Retrieving quests');
				console.log(endpoint_response.data);
				const busResponse = []
				for (const c in endpoint_response.data) {
					busResponse.push({
						id: endpoint_response.data[c].id,
						title: endpoint_response.data[c].title,
						color: endpoint_response.data[c].color,
						url: endpoint_response.data[c].url,

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

		return view.render('author.drafts-quest', { quests: responseData[0]});

	}

	async getQuests({ request, response }) {
		try{
			var responseData = [];
			let endpoint_url = Env.get("HARENA_MANAGER_URL") + "/api/v1/author/quests"

			var config = {
				method: 'get',
				url: endpoint_url,
				headers: {
					'Authorization': 'Bearer ' + request.cookie('token')
				}
			};


			await axios(config)
			.then(function (endpoint_response) {
				console.log('============ Retrieving quests');
				console.log(endpoint_response.data);
				const busResponse = []
				for (const c in endpoint_response.data) {
					busResponse.push({
						id: endpoint_response.data[c].id,
						title: endpoint_response.data[c].title,
						color: endpoint_response.data[c].color,
						url: endpoint_response.data[c].url,

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
		const pageTitle = 'Welcome Player';
		return view.render('player.welcome', { quests: responseData[0], pageTitle});

	}
}

module.exports = QuestController

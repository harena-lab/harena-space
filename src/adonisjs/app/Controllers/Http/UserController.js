'use strict'

const Env = use('Env')
const axios = require('axios');
const { validate } = use('Validator')

class UserController {
	create(view){

	}

	async signup ({ request, session, response }) {
		try{
			const params = request.all()

			const messages = {
			  'username.required': 'Please choose a username for your account',
	          'email.required': 'You must provide an email address.',
      		  'email.email': 'You must provide a valid email address.',
  	          'password.required': 'You must provide a password',
			  'password_confirmation.same': 'Passwords mismatch'
			}

			const validation = await validate(params, {
		      username: 'required',
		      email: 'required|email',
		      password: 'required',
		      password_confirmation: 'required_if:password|same:password',
		    }, messages)

	     // * If validation fails, early returns with validation message.
		     
		    if (validation.fails()) {
		      session
		        .withErrors(validation.messages())
		        .flashExcept(['password'])

		      return response.redirect('back')
		    }

			const endpoint_url = Env.get("HARENA_MANAGER_URL") + "/api/v1/user"   

			var config = {
			  method: 'post',
			  url: endpoint_url,
			  data: {
			  	username: params.username,
				email: params.email,
				password: params.password,
				login: params.login
			  }
			};


			await axios(config)
		    .then(function (endpoint_response) {
		  		return response.redirect('/login')
			})
			.catch(function (error) {
		  		console.log(error);
			});
		} catch (e){
			console.log(e)
		}
    }
}

module.exports = UserController

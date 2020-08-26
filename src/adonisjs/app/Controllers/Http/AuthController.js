'use strict'

const Logger = use('Logger')

const Env = use('Env')
const axios = use('axios');
var FormData = use('form-data');

const { validate } = use('Validator')

const User = use('App/Models/User');

class AuthController {

  create({ view, session }){
    return view.render('registration.login', { pageTitle: 'Log in' })
  }



  async login({ view, request, session, response, auth }) {
	try{
	  const params = request.all()

	  const messages = {
		  'email.required': 'Missing email',
  	      'password.required': 'Missing password',
	  }

	  const validation = await validate(params, {
	    email: 'required',
		password: 'required',
	  }, messages)

	  // * If validation fails, early returns with validation message
	  if (validation.fails()) {
	    session
		  .withErrors(validation.messages())
		  .flashExcept(['password'])

		  return response.redirect('back')
	  }

	  let endpoint_url = Env.get("HARENA_MANAGER_URL") + "/api/v1/auth/login"

	  var config = {
	    method: 'post',
	    url: endpoint_url,
	    data: {
	  	  email: params.email,
	  	  password: params.password,
	    }
	  };

  	  await axios(config)
 	  	.then(async function (endpoint_response) {

          let response_user = endpoint_response.data
	 	  	
		  await auth.loginViaId(response_user.id) 
     	  response.cookie('token', response_user.token)
    
 	  	  return response.route('index')
	  	})
	    .catch(function (error) {
		  console.log(error);
	  	});
	} catch (e){
		console.log(e)
	}
  }



  async logout({ session, auth, response, request }){
  	try{
	    const endpoint_url = Env.get("HARENA_MANAGER_URL") + "/api/v1/auth/logout"

	    var config = {
	 	  method: 'post',
		  url: endpoint_url,
		  headers: {
	          Authorization: 'Bearer ' + request.cookie('token')
	      }
		};

	  	await axios(config)
		  .then(async function (endpoint_response) {
		  	await auth.logout()
	 	    return response.route('index')
		  })
	      .catch(function (error) {
		    console.log(error);
		  });
	}catch (e){
		console.log(e)
	}
  }



}

module.exports = AuthController

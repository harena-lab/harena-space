'use strict'

const Env = use('Env')
const axios = require('axios');
const { validate } = use('Validator')

class AuthController {

  create({ view }){
    return view.render('registration.login', { pageTitle: 'Log in' })
  }

  async login({ view, request, session, response, auth }) {
  	console.log(1)
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

	  // * If validation fails, early returns with validation message.
	  if (validation.fails()) {
	    session
		  .withErrors(validation.messages())
		  .flashExcept(['password'])

		  return response.redirect('back')
	  }

	  const endpoint_url = Env.get("HARENA_MANAGER_URL") + "/api/v2/auth/login"

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

		  let user = endpoint_response.data
		  console.log("-----------------------------------------------------------------------------------------------------------")
 	  	  console.log(user.token)
 	  	  //let token = await auth.generate(user)

 	  	  //console.log(token.token)
 	  	  //request.cookie("token", token.token)
 	  	  console.log('login feito')
			 //const data = { user : 'hello world' }
			 response.cookie('token', user.token)
			 //yield response.sendView('index', data)
		  return view.render('index', { user: user.toJSON() })
 	  	//   return response.redirect('/space')
	  	})
	    .catch(function (error) {
		  console.log(error);
	  	});
	} catch (e){
		console.log(e)
	}
  }
}

module.exports = AuthController

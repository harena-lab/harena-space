'use strict'

const Logger = use('Logger')

const Env = use('Env')
const axios = use('axios');
var FormData = use('form-data');

const { validate } = use('Validator')

const User = use('App/Models/User');

class AuthController {

  create({ view, session }){
  	console.log('ejijeiej')
		console.log(session.all())

    return view.render('registration.login', { pageTitle: 'Log in' })
  }



  async login({ view, request, session, response, auth }) {
	console.log('here')
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

	  let endpoint_url = Env.get("HARENA_MANAGER_URL") + "/api/v2/auth/login"

	  let bodyFormData = new FormData();
	  bodyFormData.append('email', params.email);
	  bodyFormData.append('password', params.password);
// console.log(bodyFormData.getHeaders())

	  var config = {
	    method: 'post',
	    url: endpoint_url,
	    // headers: {
	    // 	data.getHeaders()
	    // },
	    // data: bodyFormData
	    data: {
	  	  email: params.email,
	  	  password: params.password,
	    }
	  };
// session.clear()
  console.log('aqui')
  	  await axios(config)
  	  // console.log('retorno')
 	  	.then(async function (endpoint_response) {
 	  		  // console.log(session.all())

		  	let response_user = endpoint_response.data
		  	console.log("-----------------------------------------------------------------------------------------------------------")
	 	  	
	 	  	// let user = new User()
	 	  	// user.id = response_user.id
	 	  	// user.email = response_user.email
			
			// session.put('adonis-auth', response_user.adonisAuth)
			
			// console.log(session.all())
			  // await auth.attempt(params.email,params.password) 
		  await auth.loginViaId(response_user.id) 
 	  		  // console.log(session.all())

     	  response.cookie('token', response_user.token)
          console.log("cookies-----------------------------------------------------------------------------------------------------------")
  		  console.log(response_user)

		  // console.log(response_user.token)
		  // console.log(response.cookies())

		  // console.log(response.cookie('token'))
		  // console.log(response.plainCookie('token'))

		  //yield response.sendView('index', data)
		  //return view.render('index', { user: user.toJSON() })

    
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
  	console.log('aquiiiiiiiiiiiiiiiiiiii')
  	// console.log(request.cookies())
  	try{
  		// console.log('aqui')
  	//   	console.log(request.cookies())

  	// console.log(request.cookie('adonis-session'))
  	//   	console.log(request.cookie('adonis-session-values'))

    const endpoint_url = Env.get("HARENA_MANAGER_URL") + "/api/v2/auth/logout"
// console.log(session)

    var config = {
 	  method: 'post',
	  url: endpoint_url,
	  headers: {
          // Authorization: 'Bearer ' + request.cookie('token')

          // "Cookie": "Bearer " + request.cookie("token")
          // "Cookie": "adonis-session=" + request.cookie("adonis-session") +
          //      		"; XSRF-TOKEN="+ request.cookie('XSRF-TOKEN') +
          // 			"; adonis-session-values=" + request.cookie('adonis-session-values') 
      }
	};

	axios.defaults.withCredentials = true
console.log(request.cookies())
    await auth.logout()

  	await axios(config)
	  .then(async function (endpoint_response) {
	  	console.log('200 ok')
	  	        await auth.logout()

 	    return response.route('index')

	  })
      .catch(function (error) {
	  	console.log('401 unauthorized')
	    console.log(error);
	  });
  	}catch (e){
  		// console.log(e)
  	}
  	
  }
}

module.exports = AuthController

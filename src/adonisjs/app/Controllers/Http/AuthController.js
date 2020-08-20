/* global use */

'use strict'

const Logger = use('Logger')

const Env = use('Env')
const axios = require('axios');
const { validate } = use('Validator')

const User = use('App/Models/User');

class AuthController {

  create({ view }){
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

	  // * If validation fails, early returns with validation message.
	  if (validation.fails()) {
	    session
		  .withErrors(validation.messages())
		  .flashExcept(['password'])

		  return response.redirect('back')
	  }

	  const endpoint_url = Env.get("HARENA_MANAGER_URL") + "/api/v1/auth/login"

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
Logger.info('response is %s', endpoint_response)
		  let response_user = endpoint_response.data
		  console.log("-----------------------------------------------------------------------------------------------------------")
 	  // 	  console.log(user.token)
 	  let user = new User()
 	  user.id = response_user.id
 	  user.email = response_user.email
console.log(user)
		  await auth.login(user) 

     	  // response.cookie('token', user.token)
		  
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
  	try{
  		// console.log('aqui')
  	//   	console.log(request.cookies())

  	// console.log(request.cookie('adonis-session'))
  	//   	console.log(request.cookie('adonis-session-values'))

    const endpoint_url = Env.get("HARENA_MANAGER_URL") + "/api/v1/auth/logout"

    var config = {
 	  method: 'post',
	  url: endpoint_url,
	  headers: {
          // "Cookie": "Bearer " + request.cookie("token")
          // "Cookie": "adonis-session=" + request.plainCookie("adonis-session") +
               			// ";XSRF-TOKEN="+ request.plainCookie('XSRF-TOKEN') +


          			// ";adonis-session-values=" + request.plainCookie('adonis-session-values') 
      }
	};
// console.log(config)


// 	const instance = await axios.create({
//   withCredentials: true
// })

// await instance.post(endpoint_url)

// await axios.get(endpoint_url)	
	// axios.defaults.withCredentials = true


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

'use strict'

const Logger = use('Logger')

const Env = use('Env')
const axios = use('axios');
var FormData = use('form-data');

const { validate } = use('Validator')

const User = use('App/Models/User');

class AuthController {

  create({ view }){
    return view.render('registration.login', { pageTitle: 'Log in' })
  }



  async login({ view, request, session, response, auth }) {
	// console.log(session.all())
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

	  let endpoint_url = Env.get("HARENA_MANAGER_URL") + "/api/v1/auth/login"

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

  	  await axios(config)
 	  	.then(async function (endpoint_response) {
 	  		  console.log(session.all())

		  let response_user = endpoint_response.data
		  console.log("-----------------------------------------------------------------------------------------------------------")
 	  	let user = new User()
 	  	user.id = response_user.id
 	  	user.email = response_user.email
		console.log(response_user)
		session.put('adonis-auth', response_user)
		console.log(session.all())
		  // await auth.attempt(params.email,params.password) 
		  // await auth.loginViaId(user.id) 
 	  		  // console.log(session.all())

     	  // response.cookie('token', user.token)
		  
		  //yield response.sendView('index', data)
		  //return view.render('index', { user: user.toJSON() })

    
 	  	  return response.route('index')
	  	})
	    .catch(function (error) {
		  // console.log(error);
	  	});

		endpoint_url = Env.get("HARENA_MANAGER_URL") + "/api/v1/auth/logout"

		config = {
		 	  method: 'post',
			  url: endpoint_url,
			  data: new FormData()	
			};

		await axios(config)
	  	  .then(async function (endpoint_response) {
	  	        // await auth.logout()

  			  return response.route('index')
		  })
	      .catch(function (error) {
		    // console.log(error);
		  });
	} catch (e){
		console.log(e)
	}
  }



  async logout({ session, auth, response, request }){
  	console.log(session.all())
  	try{
  		// console.log('aqui')
  	//   	console.log(request.cookies())

  	// console.log(request.cookie('adonis-session'))
  	//   	console.log(request.cookie('adonis-session-values'))

    const endpoint_url = Env.get("HARENA_MANAGER_URL") + "/api/v1/auth/logout"
console.log(session)

    var config = {
 	  method: 'post',
	  url: endpoint_url,
	  // headers: {
          // "Cookie": "Bearer " + request.cookie("token")
          "Cookie": "adonis-session=" + request.plainCookie("adonis-session") +
               			"; XSRF-TOKEN="+ request.plainCookie('XSRF-TOKEN') +
          			"; adonis-session-values=" + request.plainCookie('adonis-session-values') 
      // }
	};
// console.log(config)


// 	const instance = await axios.create({
//   withCredentials: true
// })

// await instance.post(endpoint_url)

// await axios.get(endpoint_url)	
	axios.defaults.withCredentials = true

        await auth.logout()
 	    // return response.route('index')

  	await axios(config)
	  .then(async function (endpoint_response) {
	  	        // await auth.logout()

 	    return response.route('index')

	  })
      .catch(function (error) {
	  	
	    // console.log(error);
	  });
  	}catch (e){
  		// console.log(e)
  	}
  	
  }
}

module.exports = AuthController

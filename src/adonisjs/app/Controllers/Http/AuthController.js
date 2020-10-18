/* global use */
'use strict'

// const Logger = use('Logger')

const Env = use('Env')
const axios = use('axios')

// var FormData = use('form-data')

const { validate } = use('Validator')

// const User = use('App/Models/User')


class AuthController {
  create ({ view }) {
    return view.render('registration.login', { pageTitle: 'Log in' })
  }

  async login ({ view, request, response }) {


    try {
      const params = request.all()

      const messages = {
        'email.required': 'Missing email',
        'password.required': 'Missing password'
      }

      const validation = await validate(params, {
        email: 'required',
        password: 'required'
      }, messages)

      // * If validation fails, early returns with validation message
      // if (validation.fails()) {
      //   session
      //     .withErrors(validation.messages())
      //     .flashExcept(['password'])
      //
      //   return response.redirect('back')
      // }

      // const endpointUrl = Env.get('HARENA_MANAGER_URL') + '/api/v1/auth/login'
      const endpointUrl = Env.get('HARENA_MANAGER_URL') + '/api/v2/auth/login'

      var config = {
        method: 'post',
        url: endpointUrl,
        withCredentials: true,
        data: {
          email: params.email,
          password: params.password
        }
      }

      await axios(config)
        .then(async function (endpointResponse) {
          const responseUser = endpointResponse.data
          // session.put('username', responseUser.username)
          // await auth.loginViaId(responseUser.id)
          // console.log(endpointResponse)
          // console.log('jar')
          // console.log(cookieJar)
          // responseUser.cookie('adonis-remember-token', )
          console.log(responseUser)
          request.cookie('adonis-remember-token')
          console.log('You are just dumb ==========================================================================')
          console.log(request.cookie('adonis-remember-token'))
// response.cookie('token', responseUser.token)
          // const endpointUrl2 = Env.get('HARENA_MANAGER_URL') + '/api/v1/case/04ef4c85-1823-4955-81a5-2da6e30ca7a1'
          //
          // var config2 = {
          //   method: 'get',
          //   url: endpointUrl2,
          //   withCredentials: true,
          //       jar: cookieJar, // tough.CookieJar or boolean
          // }
          //
          // await axios(config2)
          //   .then(async function (endpointResponse2) {
          //     console.log(endpointResponse2)
          //   }).catch(function (error) {
          //     // console.log(error)
          //   })
          //
          // // response.cookie('token', responseUser.token)
          //
          // return response.route('index')
        })
        .catch(function (error) {
          console.log(error)
        })
    } catch (e) {
      console.log(e)
    }
  }

  async logout ({ response, request }) {
    try {
      const endpointUrl = Env.get('HARENA_MANAGER_URL') + '/api/v2/auth/logout'

      var config = {
        method: 'post',
        url: endpointUrl,
        withCredentials: true
      }

      await axios(config)
        .then(async function (endpointResponse) {
          response.clearCookie('adonis-remember-token')
          response.clearCookie('adonis-session')
          return response.route('index')
        })
        .catch(function (error) {
          console.log(error)
        })
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = AuthController

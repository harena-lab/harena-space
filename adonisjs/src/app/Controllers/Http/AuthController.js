'use strict'

const axios = require('axios')

const Env   = use("Env");

class AuthController {
    create ({ view }) {
        /**
         * Render the view 'sessions.create'.
         *
         * ref: http://adonisjs.com/docs/4.0/views
         */
        return view.render('login.login')
    }


    async login({ request, auth, response }) {
        let { email, password } = request.all();

        console.log({ email, password } )

        axios.post("http://172.17.0.1:10020/api/v1/user/login", { email, password })
        .then((res) => {
            console.log('acertou')
            console.log(res)
            // console.log(`statusCode: ${res.statusCode}`)
            // return response.redirect('/')
            // return res
        })
        .catch((error) => {
            console.log('falhou')

            console.error(error.message)
            return response.status(error.status).redirect('login')
        })

        // return response.redirect('/')
    }
}

module.exports = AuthController

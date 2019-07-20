'use strict'

const axios = require('axios')

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

        console.log({ email, password } );
        console.log();

        URL = 'harena-manager://harena-manager:10020/api/v1/user/login'

        axios.post(URL, { email, password })
        .then((res) => {
            console.log('acertou')
            console.log(response);
            console.log(res.status + ' - ' + response.statusText);
            // console.log(response.statusText);
            // console.log(response.headers);
            // console.log(response.config);
            // console.log(`statusCode: ${res.statusCode}`)
            // return response.redirect('/author')
            return
        })
        .catch((error) => {
            console.log('falhou')

            console.error(error.message)
            return
        })

        return response.redirect('/')
    }
}

module.exports = AuthController

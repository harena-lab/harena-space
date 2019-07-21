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


    async login({ request, auth, response, session }) {
        let { email, password } = request.all();

        console.log({ email, password } );
        console.log();

        URL = 'harena-manager://harena-manager:10020/api/v1/user/login'

        await axios.post(URL, { email, password })
        .then((res) => {



            console.log(res.data);
            console.log(res.status + ' - ' + res.statusText);
            // console.log(response.statusText);
            // console.log(response.headers);
            // console.log(response.config);
            // console.log(`statusCode: ${res.statusCode}`)
            // return response.redirect('/author')
            return response.redirect("/")
        })
        .catch((error) => {
            session.flashExcept(['password'])
            session.flash({ error: 'We cannot find any account with these credentials.' })

            console.error(error.message)
            return response.redirect("/login")
        })
    }
}

module.exports = AuthController

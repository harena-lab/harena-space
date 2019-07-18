'use strict'

const axios = require('axios')

class AuthController {
    async login({ request, auth, response }) {
        let { email, password } = request.all();

        console.log(request.all())
        
        axios.get('HARENA_MANAGER_URL')
        .then((res) => {
            console.log('acertou')
            // console.log(`statusCode: ${res.statusCode}`)
            // return response.redirect('/')
            // return res
        })
        .catch((error) => {
            console.log('falhou')

            console.error(error)
        })
    }
}

module.exports = AuthController

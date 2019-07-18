'use strict'

const axios = require('axios')

class AuthController {
    async login({ request, auth, response }) {
        let { email, password } = request.all();

        console.log(request.all())
        
        axios.get('https://localhost:10020/')
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

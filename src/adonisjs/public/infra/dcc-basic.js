(function () {
  DCC.component(
    'submit-login',
    'dcc-submit',
    {
      pre: function (message, form, schema) {
        if (form.checkValidity() === false) {
          for ( i = 0; i < form.elements.length; i++){
            if(form[i].required && form[i].validity.valid){
              form[i].classList.add('is-valid')
              form[i].classList.remove('is-invalid')
            }else{
              form[i].classList.add('is-invalid')
              form[i].classList.remove('is-valid')
            }
          }
          // console.log('form invalid')
          return false
        }
        // console.log('form valid')
        for ( i = 0; i < form.elements.length; i++){
            // form[i].classList.add('is-valid')
            form[i].classList.remove('is-invalid')
        }
        // form.classList.add('was-validated')
        return true

      },
      pos: function (response) {
        // console.log(response['harena-login']['response'])
        if(response['harena-login']['response'] === 'Login successful'){
          // console.log('login successful');
          if(document.querySelector('#login-message-alert')){
            document.querySelector('#btn-submit-login').firstElementChild.innerHTML = 'Logging...'
            document.querySelector('#login-message-alert').innerHTML = response['harena-login']['response']
            document.querySelector('#login-message-alert').classList.add('alert-success')
            document.querySelector('#login-message-alert').classList.remove('alert-danger')

          }

           setTimeout(function(){
             window.location.href = '/'
           }, 2500)
        }else if (response['harena-login']['response'] === 'Email or password incorrect'){
          // console.log('login failed, password or email incorrect');
          if(document.querySelector('#login-message-alert')){
            document.querySelector('#login-message-alert').innerHTML = response['harena-login']['response']
            document.querySelector('#login-message-alert').classList.add('alert-danger')
            document.querySelector('#login-message-alert').classList.remove('alert-success')

            document.querySelector('#email').classList.add('is-invalid')
            document.querySelector('#password').classList.add('is-invalid')

          }
        }
      }
    }
  )
  DCC.component(
    'submit-logout',
    'dcc-submit',
    {
      pos: function (response) {
        // console.log(response)
        window.location.href = '/'
      }
    }
  )

  DCC.component(
    'submit-change-password',
    'dcc-submit',
    {
      pos: async function (response) {
        console.log(response['harena-change-password'])
        const responseContainer = document.querySelector('#updatePasswordResponse')
        responseContainer.innerHTML = response['harena-change-password']
        if(response['harena-change-password'] === 'Password changed successfully.'){
          console.log('if')
          responseContainer.classList.remove('text-danger')
          responseContainer.classList.add('text-success')
          const promise = new Promise((resolve, reject) => {
            setTimeout(() => resolve(window.location.href = '/'), 1000)
          })
        }else {
          console.log('else')
          responseContainer.classList.remove('text-success')
          responseContainer.classList.add('text-danger')
        }
      }
    }
  )
})()

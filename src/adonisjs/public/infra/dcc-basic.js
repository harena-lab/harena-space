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
             if(new URL(document.location).searchParams.get('redirected')
             && new URL(document.location).searchParams.get('redirected') != 'null'){
               var redirectTo = sessionStorage.getItem('redirectBack')
               sessionStorage.removeItem('redirectBack')
               window.location.href = redirectTo
             }else{
               sessionStorage.removeItem('redirectBack')
               window.location.href = '/'
             }

           }, 2000)
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
        // console.log(response['harena-change-password'])
        const responseContainer = document.querySelector('#updatePasswordResponse')
        responseContainer.innerHTML = response['harena-change-password']
        if(response['harena-change-password'] === 'Password changed successfully.'){
          // console.log('if')
          responseContainer.classList.remove('text-danger')
          responseContainer.classList.add('text-success')
          const promise = new Promise((resolve, reject) => {
            setTimeout(() => resolve(window.location.href = '/'), 1000)
          })
        }else {
          // console.log('else')
          responseContainer.classList.remove('text-success')
          responseContainer.classList.add('text-danger')
        }
      }
    }
  )

  DCC.component(
    'submit-case-property',
    'dcc-submit',
    {
      pos: async function (response) {
        // console.log('============ pos dcc-submit prop')
        // console.log(response)
        let propValue = null
        if(response['harena-case-property']['case_property']){
          propValue = response['harena-case-property']['case_property']['value']
        }else{
          propValue = response['harena-case-property']['value']
        }
        LayoutController.instance.feedbackButtonCaseState(propValue)
      }
    }
  )

  DCC.component(
    'submit-filter',
    'dcc-submit',
    {
      pre: function (message, form, schema) {
        // console.log('============ pre submit-filter')
        // console.log(message['value'])
        // console.log('============ form')
        // console.log(form)
        var url = new URL(document.location)
        for(_info in message['value']){
            url.searchParams.set(_info,message['value'][_info])
        }
        document.location = url
        return true

      },
      pos: function (response) {

      }
    }
  )

  DCC.component(
    'submit-share',
    'dcc-submit',
    {
      pre: function (message, form, schema) {
        $('#notice-modal').modal('show')
        var txt = document.querySelector('#modal-notice-txt')
        var modalBody = document.querySelector('#modal-notice-body')
        txt.innerHTML = 'Sharing cases...'

        modalBody.classList.remove('bg-danger')
        modalBody.classList.remove('bg-success')
        txt.classList.remove('text-white')
        modalBody.classList.add('bg-white')
        txt.classList.add('text-secondary')

        return true
      },
      pos: async function (response) {

        // console.log(response['harena-share-cases'].message)
        var txt = document.querySelector('#modal-notice-txt')
        var modalBody = document.querySelector('#modal-notice-body')

        txt.innerHTML = response['harena-share-cases'].message
        if(response['harena-share-cases'].message.includes('Error')){
          modalBody.classList.remove('bg-success')
          modalBody.classList.remove('bg-white')
          txt.classList.remove('text-secondary')
          modalBody.classList.add('bg-danger')
          txt.classList.add('text-white')
        }else if(response['harena-share-cases'].message.includes("Cannot read property 'split'")){
          txt.innerHTML = 'Error. Please select at least one case to share.'

          modalBody.classList.remove('bg-success')
          modalBody.classList.remove('bg-white')
          txt.classList.remove('text-secondary')
          modalBody.classList.add('bg-danger')
          txt.classList.add('text-white')
        }else{
          modalBody.classList.remove('bg-danger')
          modalBody.classList.remove('bg-white')
          txt.classList.remove('text-secondary')
          modalBody.classList.add('bg-success')
          txt.classList.add('text-white')
        }

        setTimeout(function(){
          $('#notice-modal').modal('hide')
        }, 7000)

      }
    }
  )

  DCC.component(
    'submit-prognosis-lvl',
    'dcc-submit',
    {
      pre: function (message, form, schema) {
        if(document.querySelector('#current-lvl') && localStorage.getItem('prognosis-current-lvl')!= null){
          let currentLvl = localStorage.getItem('prognosis-current-lvl')
          message.value.propertyTitle = 'prognosis-current-lvl'
          message.value.propertyValue = currentLvl
          return true
        }else if(document.querySelector('#next-lvl') && localStorage.getItem('prognosis-current-lvl')!= null){
          if(localStorage.getItem('prognosis-current-lvl') == parseInt(document.querySelector('#next-lvl').value)){
            let nextLvl = parseInt(document.querySelector('#next-lvl').value) + 1
            if(nextLvl>10)
              nextLvl = 10
            message.value.propertyTitle = 'prognosis-current-lvl'
            message.value.propertyValue = nextLvl
            return true
          }
          return false


        }else{
          console.log('============ error in prognosis lvl update in manager')
          return false
        }

      },
      pos: async function (response) {
        if(document.querySelector('dcc-submit[bind="submit-prognosis-lvl"]'))
          document.querySelector('dcc-submit[bind="submit-prognosis-lvl"]').remove()
      }
    }
  )

  DCC.component(
    'submit-prognosis-lvl-result',
    'dcc-submit',
    {
      pre: function (message, form, schema) {
        if(form.checkValidity()){
          currentLvl = localStorage.getItem('prognosis-current-lvl')
          console.log(document.querySelector('#saps-survival'))
          message.value.propertyTitle = `prognosis-lvl-${currentLvl}-result`
          message.value.propertyValue = document.querySelector('#saps-survival').value
          return true
        }else{
          return false
        }
      },
      pos: async function (response) {

      }
    }
  )

  DCC.component(
    'submit-prognosis-lvl-txt',
    'dcc-submit',
    {
      pre: function (message, form, schema) {
        if(document.querySelector('#current-lvl') && localStorage.getItem('prognosis-current-lvl')!= null
        && document.querySelector('#pacient-overview-wrapper > h5')){

          const currentLvl = localStorage.getItem('prognosis-current-lvl')
          const pacientOverview = document.querySelector('#pacient-abstract').value
          message.value.propertyTitle = `prognosis-lvl-${currentLvl}-pacient`
          message.value.propertyValue = pacientOverview
          return true
        }else{
          return false
        }
      },
      pos: async function (response) {
        if(document.querySelector(`dcc-submit[bind="submit-prognosis-lvl-txt"][connect$="/post"]`)){
          document.querySelector(`dcc-submit[bind="submit-prognosis-lvl-txt"][connect$="/post"]`).remove()
          const submitDcc = document.querySelector(`dcc-submit[bind="submit-prognosis-lvl-txt"][connect$="/put"]`)
          submitDcc._computeTrigger()
        }
      }
    }
  )

  DCC.component(
    'submit-prognosis-lvl-guess',
    'dcc-submit',
    {
      pre: function (message, form, schema) {
        if(new URL(document.location).searchParams.get('playerCalc')
        && new URL(document.location).searchParams.get('calc')){

          const currentLvl = localStorage.getItem('prognosis-current-lvl')
          const playerCalc = new URL(document.location).searchParams.get('playerCalc')
          const sapsCalc = new URL(document.location).searchParams.get('calc')
          const prognDiff = (parseFloat(playerCalc) - parseFloat(sapsCalc))

          message.value.propertyTitle = `prognosis-lvl-${currentLvl}-best-guess`
          message.value.propertyValue = prognDiff
          return true
        }else{
          return false
        }
      },
      pos: async function (response) {
        const playerCalc = new URL(document.location).searchParams.get('playerCalc')
        const sapsCalc = new URL(document.location).searchParams.get('calc')
        const prognDiff = (parseFloat(playerCalc) - parseFloat(sapsCalc))
        if(document.querySelector(`dcc-submit[bind="submit-prognosis-lvl-guess"][connect$="/post"]`)){
          document.querySelector(`dcc-submit[bind="submit-prognosis-lvl-guess"][connect$="/post"]`).remove()
          if(Math.abs(response['harena-user-property'].userProperty.value) > Math.abs(prognDiff)){
            const submitDcc = document.querySelector(`dcc-submit[bind="submit-prognosis-lvl-guess"][connect$="/put"]`)
            submitDcc._computeTrigger()
          }
        }
      }
    }
  )

  DCC.component(
    'submit-prognosis-lvl-progn',
    'dcc-submit',
    {
      pre: function (message, form, schema) {
        if(new URL(document.location).searchParams.get('calc')){

          const currentLvl = localStorage.getItem('prognosis-current-lvl')
          const sapsCalc = new URL(document.location).searchParams.get('calc')

          message.value.propertyTitle = `prognosis-lvl-${currentLvl}-best-progn`
          message.value.propertyValue = parseFloat(sapsCalc)
          return true
        }else{
          return false
        }
      },
      pos: async function (response) {
        const sapsCalc = new URL(document.location).searchParams.get('calc')
        if(document.querySelector(`dcc-submit[bind="submit-prognosis-lvl-progn"][connect$="/post"]`)){
          document.querySelector(`dcc-submit[bind="submit-prognosis-lvl-progn"][connect$="/post"]`).remove()
          if(response['harena-user-property'].userProperty.value < parseFloat(sapsCalc)){
            const submitDcc = document.querySelector(`dcc-submit[bind="submit-prognosis-lvl-progn"][connect$="/put"]`)
            submitDcc._computeTrigger()
          }
        }
      }
    }
  )

  DCC.component(
    'submit-prognosis-highest-lvl',
    'dcc-submit',
    {
      pre: function (message, form, schema) {
        let currentLvl
        let highestLvl
        if(localStorage.getItem('prognosis-current-lvl') && localStorage.getItem('prognosis-highest-lvl')){
          if(document.querySelector('#next-lvl')){
            if(document.querySelector('#next-lvl').value == localStorage.getItem('prognosis-highest-lvl')){
              highestLvl = parseInt(document.querySelector('#next-lvl').value) + 1
            }else{
              highestLvl = parseInt(document.querySelector('#next-lvl').value)
            }
          }else{
            if(parseInt(localStorage.getItem('prognosis-current-lvl'))
            >= parseInt(localStorage.getItem('prognosis-highest-lvl'))){
              currentLvl = parseInt(localStorage.getItem('prognosis-current-lvl'))
              highestLvl = currentLvl
            }
          }

          message.value.propertyTitle = `prognosis-highest-lvl`
          message.value.propertyValue = highestLvl
          return true
        }else{
          return false
        }
      },
      pos: async function (response) {
        const currentLvl = parseInt(localStorage.getItem('prognosis-current-lvl'))
        if(document.querySelector(`dcc-submit[bind="submit-prognosis-highest-lvl"][connect$="/post"]`)){
          document.querySelector(`dcc-submit[bind="submit-prognosis-highest-lvl"][connect$="/post"]`).remove()
          if(parseInt(response[Object.keys(response)[0]].userProperty.value) < currentLvl){
            const submitDcc = document.querySelector(`dcc-submit[bind="submit-prognosis-highest-lvl"][connect$="/put"]`)
            submitDcc._computeTrigger()
          }
        }
      }
    }
  )

  DCC.component(
    'submit-prognosis-perfect-lvl',
    'dcc-submit',
    {
      pre: function (message, form, schema) {
        const currentLvl = localStorage.getItem('prognosis-current-lvl')
        const perfectScore = document.querySelector('#pacient-perfect')
        if((currentLvl) && (perfectScore && perfectScore.value != '')){
          message.value.propertyTitle = `prognosis-lvl-${currentLvl}-perfect`
          message.value.propertyValue = perfectScore.value
          return true
        }else{
          return false
        }
      },
      pos: async function (response) {
        const currentLvl = parseInt(localStorage.getItem('prognosis-current-lvl'))
        const perfectScore = document.querySelector('#pacient-perfect')
        if(document.querySelector(`dcc-submit[bind="submit-prognosis-perfect-lvl"][connect$="/post"]`)){
          document.querySelector(`dcc-submit[bind="submit-prognosis-perfect-lvl"][connect$="/post"]`).remove()
          if(parseInt(response[Object.keys(response)[0]].userProperty.value) != parseInt(perfectScore.value)){
            const submitDcc = document.querySelector(`dcc-submit[bind="submit-prognosis-perfect-lvl"][connect$="/put"]`)
            submitDcc._computeTrigger()
          }
        }
      }
    }
  )
})()

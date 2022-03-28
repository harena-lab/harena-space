(function () {
  DCC.component(
    'submit-login-event',
    'dcc-submit',
    {
      pre: function (message, form, schema) {
        const messageAlert = document.querySelector('#login-message-alert')
        message.value.eventId = new URL(document.location).searchParams.get('eventid')
        if (message.value.eventId == null && messageAlert != null) {
          messageAlert.innerHTML = 'Evento não definido'
          messageAlert.classList.add('alert-danger')
          messageAlert.classList.remove('alert-success')
        }
        if (form.checkValidity() === false) {
          for ( i = 0; i < form.elements.length; i++){
            if(form[i].required && form[i].validity.valid) {
              form[i].classList.add('is-valid')
              form[i].classList.remove('is-invalid')
            } else {
              form[i].classList.add('is-invalid')
              form[i].classList.remove('is-valid')
            }
          }
          return false
        }
        for ( i = 0; i < form.elements.length; i++)
            form[i].classList.remove('is-invalid')
        return true
      },
      pos: function (response) {
        const messageAlert = document.querySelector('#login-message-alert')
        if(response['harena-login-event']['response'] === 'Login successful') {
          if (messageAlert != null) {
            document.querySelector('#btn-submit-login').firstElementChild.innerHTML = 'Logging...'
            messageAlert.innerHTML = response['harena-login-event']['response']
            messageAlert.classList.add('alert-success')
            messageAlert.classList.remove('alert-danger')
          }
          setTimeout(function(){
             if(new URL(document.location).searchParams.get('redirected')){
               let redirectTo = sessionStorage.getItem('redirectBack')
               if(redirectTo == null || redirectTo == '')
                redirectTo = '/index-mc.html'
               sessionStorage.removeItem('redirectBack')
               window.location.href = redirectTo
             }else{
               sessionStorage.removeItem('redirectBack')
               window.location.href = '/index-mc.html'
             }

          }, 2000)
        } else {
          if (messageAlert != null) {
            messageAlert.innerHTML = response['harena-login-event']['response']
            messageAlert.classList.add('alert-danger')
            messageAlert.classList.remove('alert-success')
            document.querySelector('#username').classList.add('is-invalid')
          }
        }
      }
    }
  )
  /*
  DCC.component(
    'submit-login',
    'dcc-submit',
    {
      pre: function (message, form, schema) {
        if (message.value.login != null)
          message.value.email = message.value.login + '@museu.unicamp.br'
        // console.log('============ logging')
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
             if(new URL(document.location).searchParams.get('redirected')){
               let redirectTo = sessionStorage.getItem('redirectBack')
               if(redirectTo == null || redirectTo == '')
                redirectTo = '/index-mc.html'
               sessionStorage.removeItem('redirectBack')
               window.location.href = redirectTo
             }else{
               sessionStorage.removeItem('redirectBack')
               window.location.href = '/index-mc.html'
             }

           }, 2000)
        }else if (response['harena-login']['response'] === 'Email or password incorrect'){
          // console.log('login failed, password or email incorrect');
          if(document.querySelector('#login-message-alert')){
            document.querySelector('#login-message-alert').innerHTML = response['harena-login']['response']
            document.querySelector('#login-message-alert').classList.add('alert-danger')
            document.querySelector('#login-message-alert').classList.remove('alert-success')

            document.querySelector('#login').classList.add('is-invalid')
            document.querySelector('#password').classList.add('is-invalid')

          }
        }
      }
    }
  )
  */
  DCC.component(
    'submit-logout',
    'dcc-submit',
    {
      pre: async function (message, form, schema) {
        if(MessageBus.progn && MessageBus.progn.hasSubscriber('user/#')){
          // console.log('============ if logout')
          MessageBus.progn.publish(`user/logout/${sessionStorage.getItem('harena-user-id')}`)
          // console.log(await MessageBus.progn.waitMessage('system/logout/ready'))
          // console.log('============ true')
          return true
        }else{
          // console.log('============ else logout')
          return true
        }
      },
      pos: function (response) {
        // console.log(response)
        window.location.href = '/index-mc.html'
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
            setTimeout(() => resolve(window.location.href = '/index-mc.html'), 1000)
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
        var localStorageItem
        if(new URL(document.location).pathname.includes('/learn')){
          localStorageItem = 'prognosis-current-lvl'
        }else if(new URL(document.location).pathname.includes('/challenge/1')) {
          localStorageItem = 'prognosis-challenge1-current-lvl'
        }else if(new URL(document.location).pathname.includes('/challenge/2')) {
          localStorageItem = 'prognosis-challenge2-current-lvl'
        }
        // console.log('============ tak')
        // console.log(localStorageItem)
        if(document.querySelector('#current-lvl') && localStorage.getItem(localStorageItem)!= null){
          let currentLvl = localStorage.getItem(localStorageItem)
          message.value.propertyTitle = localStorageItem
          message.value.propertyValue = currentLvl
          return true
        }else if(document.querySelector('#next-lvl') && localStorage.getItem(localStorageItem)!= null){
          if(localStorage.getItem(localStorageItem) == parseInt(document.querySelector('#next-lvl').value)){
            let nextLvl = parseInt(document.querySelector('#next-lvl').value) + 1
            if(nextLvl>10)
              nextLvl = 10
            message.value.propertyTitle = localStorageItem
            message.value.propertyValue = nextLvl
            return true
          }
          return false


        }else{
          // console.log('============ error in prognosis lvl update in manager')
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
        if(new URL(document.location).pathname.includes('/learn')){
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
        }else if(new URL(document.location).pathname.includes('/challenge/1')) {
          if(document.querySelector('#current-lvl') && localStorage.getItem('prognosis-challenge1-current-lvl')!= null
          && document.querySelector('#pacient-overview-wrapper > h5')){

            const currentLvl = localStorage.getItem('prognosis-challenge1-current-lvl')
            const pacientOverview = document.querySelector('#pacient-abstract').value
            message.value.propertyTitle = `prognosis-challenge1-lvl-${currentLvl}-pacient`
            message.value.propertyValue = pacientOverview
            return true
          }else{
            return false
          }
        }else if(new URL(document.location).pathname.includes('/challenge/2')) {
          if(document.querySelector('#current-lvl') && localStorage.getItem('prognosis-challenge1-current-lvl')!= null
          && document.querySelector('#pacient-overview-wrapper > h5')){

            const currentLvl = localStorage.getItem('prognosis-challenge1-current-lvl')
            const pacientOverview = document.querySelector('#pacient-abstract').value
            message.value.propertyTitle = `prognosis-challenge2-lvl-${currentLvl}-pacient`
            message.value.propertyValue = pacientOverview
            return true
          }else{
            return false
          }
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

          let currentLvl = localStorage.getItem('prognosis-current-lvl')
          let playerCalc = new URL(document.location).searchParams.get('playerCalc')
          let sapsCalc = new URL(document.location).searchParams.get('calc')
          let prognDiff = (parseFloat(playerCalc) - parseFloat(sapsCalc))

          message.value.propertyTitle = `prognosis-lvl-${currentLvl}-best-guess`
          message.value.propertyValue = prognDiff
          return true
        }else if(new URL(document.location).pathname.includes('challenge/1')){
          let currentLvl = localStorage.getItem('prognosis-challenge1-current-lvl')
          let playerCalc = document.querySelector('#player-prognosis-guess').dataset.value
          let sapsCalc = document.querySelector('#prognosis-survival-pacient').dataset.value
          let prognDiff = (parseFloat(playerCalc) - parseFloat(sapsCalc))

          message.value.propertyTitle = `prognosis-challenge1-lvl-${currentLvl}-best-guess`
          message.value.propertyValue = prognDiff
          return true
        }/*else if(new URL(document.location).pathname.includes('challenge/2')){
          let currentLvl = localStorage.getItem('prognosis-challenge1-current-lvl')
          let playerCalc = document.querySelector('#player-prognosis-guess').dataset.value
          let sapsCalc = document.querySelector('#prognosis-survival-pacient').dataset.value
          let prognDiff = (parseFloat(playerCalc) - parseFloat(sapsCalc))

          message.value.propertyTitle = `prognosis-challenge2-lvl-${currentLvl}-best-guess`
          message.value.propertyValue = prognDiff
        }*/
        else{
          return false
        }
      },
      pos: async function (response) {
        let playerCalc
        let sapsCalc
        let prognDiff
        if(new URL(document.location).pathname.includes('challenge')){
          playerCalc = document.querySelector('#player-prognosis-guess').dataset.value
          sapsCalc = document.querySelector('#prognosis-survival-pacient').dataset.value
          prognDiff = (parseFloat(playerCalc) - parseFloat(sapsCalc))
        }else{
          playerCalc = new URL(document.location).searchParams.get('playerCalc')
          sapsCalc = new URL(document.location).searchParams.get('calc')
          prognDiff = (parseFloat(playerCalc) - parseFloat(sapsCalc))
        }

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
        }else if(new URL(document.location).pathname.includes('challenge/2')){
          const currentLvl = localStorage.getItem('prognosis-challenge2-current-lvl')
          const sapsCalc = document.querySelector('#prognosis-survival-pacient').dataset.value

          message.value.propertyTitle = `prognosis-challenge2-lvl-${currentLvl}-best-progn`
          message.value.propertyValue = parseFloat(sapsCalc)
          return true
        }else{
          return false
        }
      },
      pos: async function (response) {
        let sapsCalc
        if(new URL(document.location).searchParams.get('calc'))
          sapsCalc = new URL(document.location).searchParams.get('calc')
        else
         sapsCalc = document.querySelector('#prognosis-survival-pacient').dataset.value
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
        var localStorageCurrent
        var localStorageHighest
        if(new URL(document.location).pathname.includes('/learn')){
          localStorageCurrent = 'prognosis-current-lvl'
          localStorageHighest = 'prognosis-highest-lvl'
        }else if(new URL(document.location).pathname.includes('/challenge/1')) {
          localStorageCurrent = 'prognosis-challenge1-current-lvl'
          localStorageHighest = 'prognosis-challenge1-highest-lvl'
        }else if(new URL(document.location).pathname.includes('/challenge/2')) {
          localStorageCurrent = 'prognosis-challenge2-current-lvl'
          localStorageHighest = 'prognosis-challenge2-highest-lvl'
        }
        var currentLvl
        var highestLvl
        var nextLvl = document.querySelector('#next-lvl')
        if(localStorage.getItem(localStorageCurrent) && localStorage.getItem(localStorageHighest)){
          if(nextLvl){
            if(nextLvl.value == ''){
              nextLvl.value = parseInt(localStorage.getItem(localStorageCurrent))+1 || 2
            }
            if(nextLvl.value == localStorage.getItem(localStorageHighest)
            && parseInt(nextLvl.value) != 10){
              if(parseInt(nextLvl.value) < 10){
                highestLvl = parseInt(nextLvl.value) + 1
              }else if(parseInt(nextLvl.value) > 10){
                highestLvl = 10
              }
            }else{
              highestLvl = parseInt(nextLvl.value)
            }
          }else{
            if(parseInt(localStorage.getItem(localStorageCurrent))
            >= parseInt(localStorage.getItem(localStorageHighest))){
              if(parseInt(localStorage.getItem(localStorageCurrent)) <=10) {
                currentLvl = parseInt(localStorage.getItem(localStorageCurrent))
                highestLvl = currentLvl
              }else{
                localStorage.setItem(localStorageCurrent, 10)
                localStorage.setItem(localStorageHighest, 10)
                currentLvl = parseInt(localStorage.getItem(localStorageCurrent))
                highestLvl = currentLvl
              }
            }else if (parseInt(localStorage.getItem(localStorageHighest)) > 10){
              highestLvl = 10
            }
          }
          if(new URL(document.location).pathname.includes('challenge')){
            if ((parseInt(localStorage.getItem(localStorageHighest)) >= parseInt(localStorage.getItem(localStorageCurrent)))
                && (parseInt(localStorage.getItem(localStorageHighest))>=document.querySelector('#highest-lvl').value)) {
              highestLvl = localStorage.getItem(localStorageHighest)
              message.value.propertyTitle = `${localStorageHighest}`
              message.value.propertyValue = highestLvl
              return true
            }else{
              return false
            }
          }else{
            message.value.propertyTitle = `${localStorageHighest}`
            message.value.propertyValue = highestLvl
            return true
          }
        }else{
          return false
        }
      },
      pos: async function (response) {
        var currentLvl
        var highestLvl
        if(new URL(document.location).pathname.includes('/learn')){
          currentLvl = 'prognosis-current-lvl'
          highestLvl = 'prognosis-highest-lvl'
        }else if(new URL(document.location).pathname.includes('/challenge/1')) {
          currentLvl = 'prognosis-challenge1-current-lvl'
          highestLvl = 'prognosis-challenge1-highest-lvl'
        }else if(new URL(document.location).pathname.includes('/challenge/2')) {
          currentLvl = 'prognosis-challenge2-current-lvl'
          highestLvl = 'prognosis-challenge2-highest-lvl'
        }
        localStorage.setItem(highestLvl, parseInt(response[Object.keys(response)[0]].userProperty.value))
        if(document.querySelector(`dcc-submit[bind="submit-prognosis-highest-lvl"][connect$="/post"]`)){
          document.querySelector(`dcc-submit[bind="submit-prognosis-highest-lvl"][connect$="/post"]`).remove()
          if(parseInt(response[Object.keys(response)[0]].userProperty.value) < currentLvl
          || parseInt(response[Object.keys(response)[0]].userProperty.value)>10){
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
          if(parseFloat(response[Object.keys(response)[0]].userProperty.value) != parseFloat(perfectScore.value)){
            const submitDcc = document.querySelector(`dcc-submit[bind="submit-prognosis-perfect-lvl"][connect$="/put"]`)
            submitDcc._computeTrigger()
          }
        }
      }
    }
  )

  DCC.component(
    'submit-prognosis-lvl-range',
    'dcc-submit',
    {
      pre: function (message, form, schema) {
        if(new URL(document.location).pathname.includes('challenge/2')){
          const currentLvl = localStorage.getItem('prognosis-challenge2-current-lvl')
          const range = document.querySelector('#prognosis-range').dataset.value

          message.value.propertyTitle = `prognosis-challenge2-lvl-${currentLvl}-range`
          message.value.propertyValue = range
          return true
        }else{
          return false
        }
      },
      pos: async function (response) {
        const range = document.querySelector('#prognosis-range').dataset.value
        if(document.querySelector(`dcc-submit[bind="submit-prognosis-lvl-range"][connect$="/post"]`)){
          document.querySelector(`dcc-submit[bind="submit-prognosis-lvl-range"][connect$="/post"]`).remove()
          if(response['harena-user-property'].userProperty.value != range){
            const submitDcc = document.querySelector(`dcc-submit[bind="submit-prognosis-lvl-range"][connect$="/put"]`)
            submitDcc._computeTrigger()
          }
        }
      }
    }
  )

  DCC.component(
    'submit-prognosis-avatar-player',
    'dcc-submit',
    {
      pre: function (message, form, schema) {
        if(PrognosisAvatar.i._avatarActive){
          const avatarId = PrognosisAvatar.i._avatarActive
          message.value.propertyTitle = `prognosis-avatar-id`
          message.value.propertyValue = avatarId
          return true
        }else{
          return false
        }
      },
      pos: async function (response) {
      }
    }
  )
})()

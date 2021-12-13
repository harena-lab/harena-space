class UserSignup {
  start () {
    this._showTerm = this._showTerm.bind(this)
    MessageBus.i.subscribe('/user/term', this._showTerm)
    this._signup = this._signup.bind(this)
    MessageBus.i.subscribe('/user/signup', this._signup)
  }

  _showTerm () {
    console.log('=== show term')
    document.querySelector('#name_participant').value = document.querySelector('#username').value
    const now = new Date()
    document.querySelector('#date_agree').value = now.getDate() + '/' + (now.getMonth()+1) + '/' + now.getFullYear()
    document.querySelector('#term-form').style.display = 'initial'
  }

  async _signup (topic, message) {
    const parameters = (message && message.value) ? message.value : null
    console.log('===== user parameters')
    console.log(parameters)
    const feed = document.querySelector('#feedback-message')
    feed.innerHTML = ''
    if (parameters == null)
      feed.innerHTML = 'Erro de processamento, entre novamente na página a partir do link'
    else if (parameters.username.length == 0)
      feed.innerHTML = 'Nome do usuário é obrigatório.'
    else if (parameters.email.length == 0)
      feed.innerHTML = 'O e-mail do usuário ou do responsável do usuário é obrigatório.'
    else if (parameters.password.length == 0)
      feed.innerHTML = 'A senha é obrigatória.'
    else {
      if (parameters.agree && parameters.agree.length > 0 && parameters.agree == 'agree') {
        if (parameters.name_responsible.length == 0)
          feed.innerHTML = 'Como você concordou com o termo, precisa informar o nome do responsável no termo.'
        else if (parameters.name_participant == 0)
          feed.innerHTML = 'Como você concordou com o termo, precisa repetir o nome do participante no termo.'
        else if (parameters.date_agree == 0)
          feed.innerHTML = 'Como você concordou com o termo, precisa informar a data.'
        else if (parameters.email_responsible == 0)
          feed.innerHTML = 'Como você concordou com o termo, precisa informar/repetir o email do responsável.'
      }
      if (feed.innerHTML.length == 0) {
        console.log('========== creating user ==========')
        const userJson = {
          username: parameters.username,
          email: parameters.email,
          password: parameters.password,
          login: parameters.email.replace('@', '_').replace('.', '_'),
          institution: parameters.institution,
          grade: parameters.grade,
          eventId: new URL(document.location).searchParams.get('event')
        }
        let user = await MessageBus.i.request('user/create/post', userJson)
        console.log(user.message)
        if (user.message.error) {
          console.log('--- error')
          console.log(user.message)
          if (user.message.error.includes('409'))
            feed.innerHTML =
              'O nome ou e-mail no seu cadastro já foi cadastrado anteriormente. ' +
              'Por enquanto, o sistema não aceita dois cadastros com o mesmo nome ou email. ' +
              'Se você é responsável por mais de uma criança e está usando o seu e-mail, ' +
              'coloque um (2) logo após o e-mail. A mesma estratégia pode ser usada no nome.'
          else
            feed.innerHTML ='Houve algum erro no cadastro.'
        } else if (parameters.agree && parameters.agree.length > 0 && parameters.agree == 'agree') {
          feed.style.color = 'blue'
          feed.innerHTML = 'Usuário cadastrado com sucesso.'
          const termJson = {
            userId: user.message.id,
            termId: parameters.term,
            nameResponsible: parameters.name_responsible,
            emailResponsible: parameters.email_responsible,
            nameParticipant: parameters.name_participant,
            date: parameters.date_agree,
            role: parameters.role,
            agree: '1'
          }
          console.log('=== term json')
          console.log(termJson)
          let term = await MessageBus.i.request('user/term/post', termJson)
          console.log('=== term add')
          console.log(term)
        }
      }
        /*
        else {
          console.log(user.message.username)
          console.log(user.message.id)
          let role = await MessageBus.i.request('link/role/post',
            {
              userId: user.message.id,
              roleId: parameters.role
            }
          )
          if (role.message.error) {
            console.log('--- error')
            console.log(role.message.error)
          } else {
            console.log('--- link role success')
            let group = await MessageBus.i.request('link/group/post',
              {
                userId: user.message.id,
                groupId: parameters.group
              }
            )
            if (group.message.error) {
              console.log('--- error')
              console.log(group.message.error)
            } else
              console.log('--- link group success')
          }
        }
      */
    }
  }
}

(function () {
  UserSignup.i = new UserSignup()
})()

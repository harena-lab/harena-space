class UserSignup {
  start () {
    this._expandTerm = this._expandTerm.bind(this)
    MessageBus.i.subscribe('/user/term/expand', this._expandTerm)
    this._retractTerm = this._retractTerm.bind(this)
    MessageBus.i.subscribe('/user/term/retract', this._retractTerm)
    this._signup = this._signup.bind(this)
    MessageBus.i.subscribe('/user/signup', this._signup)
    const now = new Date()
    document.querySelector('#date_agree').value =
      now.getDate() + '/' + (now.getMonth()+1) + '/' + now.getFullYear()
  }

  _expandTerm () {
    document.querySelector('#name_participant').value = document.querySelector('#username').value
    document.querySelector('#name_responsible').value = document.querySelector('#respname').value
    document.querySelector('#email_responsible').value = document.querySelector('#email').value
    document.querySelector('#term-part1').style.display = 'initial'
    document.querySelector('#term-part2').style.display = 'initial'
    document.querySelector('#button-expand').style.display = 'none'
  }

  _retractTerm () {
    document.querySelector('#term-part1').style.display = 'none'
    document.querySelector('#term-part2').style.display = 'none'
    document.querySelector('#button-expand').style.display = 'initial'
  }

  _showFeedback (message, color) {
    const feed1 = document.querySelector('#feedback-message-1')
    const feed2 = document.querySelector('#feedback-message-2')
    if (color != null) {
      feed1.style.color = 'blue'
      feed2.style.color = 'blue'
    }
    feed1.innerHTML = message
    feed2.innerHTML = message
  }

  async _signup (topic, message) {
    const parameters = (message && message.value) ? message.value : null
    console.log('===== user parameters')
    console.log(parameters)

    this._showFeedback('')
    if (parameters == null)
      this._showFeedback('Erro de processamento, entre novamente na página a partir do link')
    else if (parameters.login.length == 0)
      this._showFeedback('Login do usuário é obrigatório.')
    else if (parameters.username.trim().length == 0)
      this._showFeedback('Nome do usuário é obrigatório.')
    else if (parameters.respname.length == 0)
      this._showFeedback('Nome do responsável é obrigatório.')
    else if (parameters.email.length == 0)
      this._showFeedback('O e-mail do responsável do usuário é obrigatório.')
    else if (parameters.password.length == 0)
      this._showFeedback('A senha é obrigatória.')
    else {
      /*
      if (parameters.agree && parameters.agree.length > 0 && parameters.agree == 'agree') {
        if (parameters.name_responsible.length == 0)
          this._showFeedback('Como você concordou com o termo, precisa informar o nome do responsável no termo.')
        else if (parameters.name_participant == 0)
          this._showFeedback('Como você concordou com o termo, precisa repetir o nome do participante no termo.')
        else if (parameters.date_agree == 0)
          this._showFeedback('Como você concordou com o termo, precisa informar a data.')
        else if (parameters.email_responsible == 0)
          this._showFeedback('Como você concordou com o termo, precisa informar/repetir o email do responsável.')
      }
      */
      // if (feed.innerHTML.length == 0) {
      console.log('========== creating user ==========')
      const login = parameters.login.replace(/ /g, '_')
      const userJson = {
        username: parameters.username,
        email: login + '@museu.unicamp.br',
        password: parameters.password,
        login: login,
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
          this._showFeedback('Já existe um usuário com este login. Por favor, escolha outro login.')
        else
          this._showFeedback('Houve algum erro no cadastro.')
      } else {
        const agree = (parameters.agree && parameters.agree.length > 0 && parameters.agree == 'agree')
        const termJson = {
          userId: user.message.id,
          termId: parameters.term,
          nameResponsible: parameters.respname,
          emailResponsible: parameters.email,
          nameParticipant: parameters.username,
          date: parameters.date_agree,
          role: parameters.role,
          agree: (agree) ? '1' : '0'
        }
        console.log('=== term json')
        console.log(termJson)
        let term = await MessageBus.i.request('user/term/post', termJson)
        console.log('=== term add')
        console.log(term)
        document.querySelector('#complete-form').style.display = 'none'
        if (agree)
          this._showFeedback('Usuário cadastrado com sucesso. Ainda há uma etapa extra a ser cumprida. Você receberá um e-mail para confirmar que é o responsável. Em seguida, o participante também receberá um link para confirmar a sua concordância com a pesquisa.', 'blue')
        else
          this._showFeedback('Usuário cadastrado com sucesso.', 'blue')
        // }
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

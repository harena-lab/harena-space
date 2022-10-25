class UserSignup {
  start () {
    this._expandTerm = this._expandTerm.bind(this)
    MessageBus.i.subscribe('/user/term/expand', this._expandTerm)
    this._retractTerm = this._retractTerm.bind(this)
    MessageBus.i.subscribe('/user/term/retract', this._retractTerm)
    this._signup = this._signup.bind(this)
    MessageBus.i.subscribe('/user/signup', this._signup)
    this.update = this.update.bind(this)

    const now = new Date()
    const sdate = now.getDate() + '/' + (now.getMonth()+1) + '/' + now.getFullYear()
    document.querySelector('#date_agree_1').value = sdate
    document.querySelector('#date_agree_2').innerHTML = sdate
  }

  startOpenTCLE () {
    this._signupTCLE = this._signupTCLE.bind(this)
    MessageBus.i.subscribe('/user/signup', this._signupTCLE)

    const now = new Date()
    const sdate = now.getDate() + '/' + (now.getMonth()+1) + '/' + now.getFullYear()
    document.querySelector('#date_agree_1').value = sdate
  }

  update () {
    if(document.querySelector('#username'))
      document.querySelector('#name_participant').innerHTML = document.querySelector('#username').value
    if(document.querySelector('#respname'))
      document.querySelector('#name_responsible').innerHTML = document.querySelector('#respname').value
    if (document.querySelector('#email'))
      document.querySelector('#email_responsible').innerHTML = document.querySelector('#email').value
    document.querySelector('#answer_agree').innerHTML =
      (document.querySelector('#agree_radio').checked)
        ? 'Concordo em participar da pesquisa'
        : (document.querySelector('#not_agree_radio').checked)
          ? 'Não desejo participar da pesquisa'
          : ''
  }

  _expandTerm () {
    this.update()
    document.querySelector('#term-part').style.display = 'initial'
    document.querySelector('#button-expand').style.display = 'none'
  }

  _retractTerm () {
    document.querySelector('#term-part').style.display = 'none'
    document.querySelector('#button-expand').style.display = 'initial'
  }

  _showFeedback (message, color) {
    const feed1 = document.querySelector('#feedback-message-1')
    const feed2 = document.querySelector('#feedback-message-2')
    if (color != null) {
      feed1.style.color = color || 'blue'
      feed2.style.color = color || 'blue'
    }
    feed1.innerHTML = message
    feed2.innerHTML = message
  }

  async _signup (topic, message) {
    const parameters = (message && message.value) ? message.value : null
    console.log('===== user parameters')
    console.log(parameters)

    this._showFeedback('')
    if(parameters.respname){
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
          this._showFeedback('Houve algum erro no cadastro. Contate o suporte: contact@harena.org')
      } else {
        const agree = (parameters.agree && parameters.agree.length > 0 && parameters.agree == 'agree')
        const termJson = {
          userId: user.message.id,
          termId: parameters.term,
          nameResponsible: parameters.respname,
          emailResponsible: parameters.email,
          nameParticipant: parameters.username,
          date: parameters.date_agree_1,
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
          this._showFeedback(
            'Usuário cadastrado com sucesso.<br>' +
            '<span style="color:purple"><b>Importante: </b>Ainda há duas etapas extras a serem cumpridas. Você receberá um e-mail para confirmar que é o responsável. Em seguida, o participante também receberá um link para confirmar a sua concordância com a pesquisa.</span>', 'blue')
        else
          this._showFeedback('Usuário cadastrado com sucesso.', 'blue')
      }
    }
  }else {
    let login = parameters.login.replace(/ /g, '_')
    let userJson = {
      username: parameters.username,
      email: login + '@email.com',
      password: parameters.password,
      login: login,
      institution: parameters.institution,
      grade: parameters.grade,
      eventId: new URL(document.location).searchParams.get('event')
    }
    let user = await MessageBus.i.request('user/create/post', userJson)
    if (user.message.error) {
      console.log('--- error')
      console.log(user.message)
      if (user.message.error.includes('409'))
        this._showFeedback('Já existe um usuário com este login. Por favor, escolha outro login.')
      else
        this._showFeedback('Houve algum erro no cadastro.')
    }else {
      const agree = (parameters.agree && parameters.agree.length > 0 && parameters.agree == 'agree')
      const termJson = {
        userId: user.message.id,
        termId: parameters.term,
        nameParticipant: parameters.username,
        nameResponsible: null,
        emailResponsible: null,
        date: parameters.date_agree_1,
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
        this._showFeedback('Usuário cadastrado com sucesso.<br>', 'blue')
      else
        this._showFeedback('Usuário cadastrado com sucesso.', 'blue')
    }
  }
  }

  async _signupTCLE (topic, message) {
    const parameters = (message && message.value) ? message.value : null
    console.log('===== user parameters')
    console.log(parameters)

    this._showFeedback('')
    if (parameters == null)
      this._showFeedback('Erro de processamento, entre novamente na página a partir do link')
    else if (parameters.username.trim().length == 0)
      this._showFeedback('Nome do participante é obrigatório.')
    else if (parameters.email.length == 0)
      this._showFeedback('O e-mail do participante é obrigatório.')
    else if (parameters.agree == null || parameters.agree.length == 0)
      this._showFeedback('Você precisa responder se concorda participar da pesquisa.')
    else {
      console.log('========== creating user ==========')
      // const login = parameters.login.replace(/ /g, '_')
      const login = parameters.email.split('@')[0]
      const userJson = {
        username: parameters.username,
        email: parameters.email,
        password: new URL(document.location).searchParams.get('pwd'),
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
          this._showFeedback('Já existe um usuário com este email. Por favor, escolha outro email.')
        else
          this._showFeedback('Houve algum erro no cadastro.')
      } else {
        const agree = (parameters.agree == 'agree')
        const termJson = {
          userId: user.message.id,
          termId: parameters.term,
          nameResponsible: '',
          emailResponsible: parameters.email,
          nameParticipant: parameters.username,
          date: parameters.date_agree_1,
          role: parameters.role,
          agree: (agree) ? '1' : '0'
        }
        console.log('=== term json')
        console.log(termJson)
        let term = await MessageBus.i.request('user/term/post', termJson)
        console.log('=== term add')
        console.log(term)
        document.querySelector('#complete-form').style.display = 'none'
        this._showFeedback(`Usuário cadastrado com sucesso!<br> Por favor mude a sua senha após o primeiro login.<br> <i style="color:darkred">Sua senha temporária é: ${userJson['password']}</i>`, 'darkblue')
      }
    }
  }
}

(function () {
  UserSignup.i = new UserSignup()
})()

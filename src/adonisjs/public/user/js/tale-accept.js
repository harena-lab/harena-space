class UserTale {
  async start () {
    this._userId = new URL(document.location).searchParams.get('user')
    this._termId = 'museu_harena_2021'
    const userTermJson = {
      userId: this._userId,
      termId: this._termId
    }
    let userTerm = await MessageBus.i.request('user/term/get', userTermJson)
    console.log(userTerm.message)
    if (userTerm.message.error) {
      console.log('--- error')
      console.log(userTerm.message)
      if (user.message.error.includes('409'))
        this._showFeedback('Já existe um usuário com este login. Por favor, escolha outro login.')
      else
        this._showFeedback('Houve algum erro no cadastro.')
    } else {
      this._userTerm = userTerm.message[0]
      document.querySelector('#username_1').innerHTML = this._userTerm.name_participant
      document.querySelector('#username_2').innerHTML = this._userTerm.name_participant
      document.querySelector('#respname_1').innerHTML = this._userTerm.name_responsible
    }

    this._expandTermA = this._expandTermA.bind(this)
    MessageBus.i.subscribe('/user/term/expand/a', this._expandTermA)
    this._expandTermB = this._expandTermB.bind(this)
    MessageBus.i.subscribe('/user/term/expand/b', this._expandTermB)
    this._retractTerm = this._retractTerm.bind(this)
    MessageBus.i.subscribe('/user/term/retract', this._retractTerm)
    this._agreement = this._agreement.bind(this)
    MessageBus.i.subscribe('/user/agreement', this._agreement)
    this.update = this.update.bind(this)

    const now = new Date()
    const sdate = now.getDate() + '/' + (now.getMonth()+1) + '/' + now.getFullYear()
    document.querySelector('#date_agree_1').value = sdate
    document.querySelector('#date_agree_2').innerHTML = sdate
  }

  update () {
    document.querySelector('#answer_agree').innerHTML =
      (document.querySelector('#agree_radio').checked)
        ? 'Concordo em participar da pesquisa'
        : (document.querySelector('#not_agree_radio').checked)
          ? 'Não desejo participar da pesquisa'
          : ''
  }

  _expandTermA () {
    document.querySelector('#term-part-a').style.display = 'initial'
    document.querySelector('#term-part-both').style.display = 'initial'
    document.querySelector('#button-expand-a').style.display = 'none'
    document.querySelector('#button-expand-b').style.display = 'none'
  }

  _expandTermB () {
    document.querySelector('#term-part-b').style.display = 'initial'
    document.querySelector('#term-part-both').style.display = 'initial'
    document.querySelector('#button-expand-a').style.display = 'none'
    document.querySelector('#button-expand-b').style.display = 'none'
  }

  _retractTerm () {
    document.querySelector('#term-part-a').style.display = 'none'
    document.querySelector('#term-part-b').style.display = 'none'
    document.querySelector('#term-part-both').style.display = 'none'
    document.querySelector('#button-expand-a').style.display = 'initial'
    document.querySelector('#button-expand-b').style.display = 'initial'
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

  async _agreement (topic, message) {
    const parameters = (message && message.value) ? message.value : null
    console.log('===== user parameters')
    console.log(parameters)

    const agree = (parameters.agree && parameters.agree.length > 0 && parameters.agree == 'agree')
    const termJson = {
      userId: this._userId,
      termId: this._termId,
      nameResponsible: this._userTerm.name_responsible,
      emailResponsible: this._userTerm.email_responsible,
      nameParticipant: this._userTerm.name_participant,
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
      this._showFeedback('Termo aceito com sucesso.', 'blue')
    else
      this._showFeedback('O termo não foi aceito pelo participante.', 'blue')
  }
}

(function () {
  UserTale.i = new UserTale()
})()

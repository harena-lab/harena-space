class UserSignup {
  // TALE, TCLE (responsible), TCLE (age >= 18) of the Museum
  startOpenMuseum () {
    this._expandTerm = this._expandTerm.bind(this)
    MessageBus.i.subscribe('/user/term/expand', this._expandTerm)
    this._retractTerm = this._retractTerm.bind(this)
    MessageBus.i.subscribe('/user/term/retract', this._retractTerm)
    this._signupMuseum = this._signupMuseum.bind(this)
    MessageBus.i.subscribe('/user/signup', this._signupMuseum)
    this.update = this.update.bind(this)

    const now = new Date()
    const sdate = now.getDate() + '/' + (now.getMonth()+1) + '/' + now.getFullYear()
    document.querySelector('#date_agree_1').value = sdate
    document.querySelector('#date_agree_2').innerHTML = sdate
  }

  // TCLE of the Zombie Venom for 18+ years old
  startAdultMuseum () {
    this._experimentStartAdultMuseum = this._experimentStartAdultMuseum.bind(this)
    MessageBus.i.subscribe('control/experiment/start', this._experimentStartAdultMuseum)

    this.finalMessage =
`<div style="color:black"><p>Bem-vindo(a)! Você foi convidado(a) a participar de um estudo científico sobre resolução de casos! Agradeço muito por isso.</p>
<p>Nas próximas telas, você participará do desafio.</p>
<p><dcc-button topic="control/experiment/start" xstyle="out" label="Iniciar"></dcc-button></p></div>`
    this._startPrognosisISC()
  }

  // TCLE of the Software Engineering for 18+ years old
  startAdultSWE () {
    MessageBus.i.subscribe('control/experiment/start', this._experimentStartSWE.bind(this))

    this.finalMessage =
`<div style="color:black"><p>Bem-vindo(a)! Você foi convidado(a) a participar de um estudo científico no ambiente Harena.</p>
<p>Nas próximas telas, você será conduzido a um ambiente de resolução de laboratórios.</p>
<p><dcc-button topic="control/experiment/start" xstyle="out" label="Iniciar"></dcc-button></p></div>`
    this._startPrognosisISC()
  }

  // TCLE of the Jacinto for 18+ years old
  startAdultJacinto () {
    MessageBus.i.subscribe('control/experiment/start', this._experimentStartJacinto.bind(this))

    this.finalMessage =
`<div style="color:black"><p>Bem-vindo(a)! Você foi convidado(a) a participar de um estudo científico no ambiente Harena.</p>
<p>Nas próximas telas, você será conduzido a um ambiente de resolução de desafios.</p>
<p><dcc-button topic="control/experiment/start" xstyle="out" label="Iniciar"></dcc-button></p></div>`
    this._startPrognosisISC()
  }

  // TCLE of the Prognosis Game
  startPrognosis () {
    this.finalMessage =
`Usuário cadastrado com sucesso!<br>
 Por favor mude a sua senha após o primeiro login.<br>
 <i style="color:darkred">Sua senha temporária é: {password}</i>`
    this._startPrognosisISC()
  }

  // TCLE of the Experiment Illness Script Components (ISC)
  startISC () {
    this._experimentStartISC = this._experimentStartISC.bind(this)
    MessageBus.i.subscribe('control/experiment/start', this._experimentStartISC)

    this.finalMessage =
`<div style="color:black"><p>Bem-vindo(a)! Você foi convidado(a) a participar de um estudo científico sobre raciocínio clínico e aceitou! Agradeço muito por isso.</p>
<p>Nas próximas telas, você responderá algumas perguntas de perfil. Posteriormente, serão apresentadas duas questões em que você terá um tempo de 5 minutos de resposta cada.</p>
<p><dcc-button topic="control/experiment/start" xstyle="out" label="Iniciar"></dcc-button></p></div>`
// `<div style="color:black"><p>Bem-vindo(a)! Você foi convidado(a) a participar de um estudo científico sobre raciocínio clínico e aceitou! Agradeço muito por isso.</p>
// <p>Nas próximas telas, você resolverá alguns casos clínicos. Existem casos em diversos cenários de prática, desde ambulatório até pronto-socorro. Sua tarefa é ler cada caso e escrever qual é o diagnóstico. Você deverá escrever algum diagnóstico para conseguir passar para a próxima tela. É importante que você se empenhe bastante em acertar.
// Depois dos casos, você responderá a duas perguntas abertas.</p>
// <p><dcc-button topic="control/experiment/start" xstyle="out" label="Iniciar"></dcc-button></p></div>`
    this._startPrognosisISC()
  }

  _startPrognosisISC () {
    this._signupPrognosisISC = this._signupPrognosisISC.bind(this)
    MessageBus.i.subscribe('/user/signup', this._signupPrognosisISC)

    const now = new Date()
    const sdate = now.getDate() + '/' + (now.getMonth()+1) + '/' + now.getFullYear()
    document.querySelector('#date_agree_1').value = sdate
  }

  _startPodcast () {
    this._signupPodcast = this._signupPodcast.bind(this)
    MessageBus.i.subscribe('/user/signup', this._signupPodcast)
  }

  update () {
    if(document.querySelector('#username') && document.querySelector('#name_participant'))
      document.querySelector('#name_participant').innerHTML = document.querySelector('#username').value
    if(document.querySelector('#respname') && document.querySelector('#name_responsible'))
      document.querySelector('#name_responsible').innerHTML = document.querySelector('#respname').value
    if (document.querySelector('#email') && document.querySelector('#email_responsible'))
      document.querySelector('#email_responsible').innerHTML = document.querySelector('#email').value
    if (document.querySelector('#answer_agree'))
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

  async _signupMuseum (topic, message) {
    const parameters = (message && message.value) ? message.value : null
    console.log('===== user parameters')
    console.log(parameters)

    this._showFeedback('')
    // children responsible
    if(parameters.respname != null) {
      if (parameters == null)
        this._showFeedback('Erro de processamento, entre novamente na página a partir do link')
      else if (parameters.username.trim().length == 0)
        this._showFeedback('Nome do participante é obrigatório.')
      else if (parameters.respname.length == 0)
        this._showFeedback('Nome do responsável é obrigatório.')
      else if (parameters.email.length == 0)
        this._showFeedback('O e-mail do responsável é obrigatório.')
      else if (parameters.agree == null || parameters.agree.length == 0)
        this._showFeedback('Você precisa informar se concorda ou não em participar da pesquisa.')
      else {
        console.log('========== creating user ==========')
        const now = Date.now()
        const login = (parameters.login && parameters.login.length > 0)
          ? parameters.login.replace(/ /g, '_')
          : parameters.username.toLowerCase().replace(/ /g, '_') + '_' + now
        const password = (parameters.password && parameters.password.length > 0)
          ? parameters.password : login
        const userJson = {
          username: parameters.username,
          email: login + '@museu.unicamp.br',
          password: password,
          login: login,
          institution: parameters.institution,
          grade: parameters.grade,
          property_ids: 'harena:responsible_name,harena:responsible_email',
          property_values: '"' + parameters.respname + '","' +
                           parameters.email + '"',
          eventId: new URL(document.location).searchParams.get('event')
        }
        let user = await MessageBus.i.request('user/create/post', userJson)
        console.log(user.message)
        if (user.message.error) {
          const err = user.message.error
          if (err.type && err.type == 'unauthorized')
            this._showFeedback(
              'Você precisa de uma autorização para se cadastrar.')
          else
            this._showFeedback(
              'Houve algum erro no cadastro. Contate o suporte: ' +
              'museu@unicamp.br indicando a mensagem de erro: "' +
              ((user.message.error.message)
                ? user.message.error.message : '') + '".'
            )
        } else {
          const termJson = {
            userId: user.message.id,
            termId: parameters.term,
            nameResponsible: parameters.respname,
            emailResponsible: parameters.email,
            nameParticipant: parameters.username,
            date: parameters.date_agree_1,
            role: parameters.role,
            agree: (parameters.agree == 'agree') ? '1' : '0'
          }
          console.log('=== term json')
          console.log(termJson)
          let term = await MessageBus.i.request('user/term/post', termJson)
          console.log('=== term add')
          console.log(term)
          document.querySelector('#complete-form').style.display = 'none'
          if (parameters.agree == 'agree')
            this._showFeedback(
              'Usuário cadastrado com sucesso!<br>' +
              '<img src="images/envelope.svg" width="100px"><br>' +
              '<div style="color:purple"><b>Importante: </b>Você receberá um e-mail para confirmar que é o responsável. É fundamental que você responda.</div>', 'blue')
          else
            this._showFeedback('Usuário cadastrado com sucesso.', 'blue')
        }
      }
    } else {
      console.log('=== user login')
      console.log(parameters.login)
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
      } else {
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

  async _signupPrognosisISC (topic, message) {
    const parameters = (message && message.value) ? message.value : null
    console.log('===== user parameters')
    console.log(parameters)

    const eventId = new URL(document.location).searchParams.get('event')
    const password = new URL(document.location).searchParams.get('pwd')

    this._showFeedback('')
    if (parameters == null)
      this._showFeedback('Erro de processamento, entre novamente na página a partir do link')
    else if (eventId == null || password == null ||
             eventId.length == 0 || password.length == 0)
      this._showFeedback('Link de cadastro incompleto.')
    else if (parameters.username.trim().length == 0)
      this._showFeedback('Nome do participante é obrigatório.')
    else if (parameters.agree == null || parameters.agree.length == 0)
      this._showFeedback('Você precisa responder se concorda participar da pesquisa.')
    else if (parameters.interview == null || parameters.interview.length == 0)
      this._showFeedback('Você precisa informar se concorda ou não em participar da entrevista.')
    else {
      let ticket = await MessageBus.i.request('ticket/create/post')
      if (!ticket.message.id) {
        this._showFeedback('Error creating ticket.')
        ticket = ''
      } else {
        ticket = ticket.message.id
        console.log('=== ticket')
        console.log(ticket)
      }
      const participant = parameters.username.trim().replace(/ /g, '_').toLowerCase()
      const login = `${participant}_${ticket}`
      const email = `${login}@email.com`
      console.log('========== creating user ==========')
      const userJson = {
        username: parameters.username,
        email: email,
        password: password,
        login: login,
        institution: parameters.institution,
        grade: parameters.grade,
        eventId: eventId
      }
      this.current = {
        username: userJson.username,
        eventId: userJson.eventId
      }
      let user = await MessageBus.i.request('user/create/post', userJson)
      console.log(user.message)
      if (user.message.error) {
        console.log('--- error')
        console.log(user.message)
        const err = user.message.error
        if (err.type && err.type == 'duplicated')
          this._showFeedback('Já existe um usuário com este email. Por favor, escolha outro email.')
        else if (err.type && err.type == 'unauthorized')
          this._showFeedback(
            'Você precisa de uma autorização para se cadastrar.')
        else
          this._showFeedback(
            'Houve algum erro no cadastro. Contate o suporte: ' +
            'indicando a mensagem de erro: "' +
            ((user.message.error.message)
              ? user.message.error.message : '') + '".'
          )
      } else {
        const termJson = {
          userId: user.message.id,
          termId: parameters.term,
          nameResponsible: '',
          emailResponsible: email,
          nameParticipant: participant,
          date: parameters.date_agree_1,
          role: parameters.role,
          agree: ((parameters.agree == 'agree') ? 1 : 0) + ((parameters.interview == 'agree') ? 10 : 0)
        }
        console.log('=== term json')
        console.log(termJson)
        let term = await MessageBus.i.request('user/term/post', termJson)
        console.log('=== term add')
        console.log(term)
        document.querySelector('#complete-form').style.display = 'none'
        this._showFeedback(
          this.finalMessage.replace('{password}', userJson['password']),
          'darkblue')
      }
    }
  }

  async _signupPodcast (topic, message) {
    const parameters = (message && message.value) ? message.value : null
    console.log('===== user parameters')
    console.log(parameters)

    const eventId = new URL(document.location).searchParams.get('event')
    const password = new URL(document.location).searchParams.get('pwd')
    const language = new URL(document.location).searchParams.get('lang')

    this._showFeedback('')
    if (parameters == null)
      this._showFeedback('Processing error, please re-enter the page from the link.')
    else if (eventId == null || password == null ||
             eventId.length === 0 || password.length === 0 ||
             language == null || language.length === 0)
      this._showFeedback('Incomplete registration link.')
    else if (parameters.id_participant.trim().length === 0)
      this._showFeedback('Personal code is mandatory.')
    else {
      let ticket = await MessageBus.i.request('ticket/create/post')
      if (!ticket.message.id)
        this._showFeedback('Error creating ticket.')
      else {
        ticket = ticket.message.id
        console.log('=== ticket')
        console.log(ticket)

        console.log('========== creating user ==========')
        const participant = parameters.id_participant.trim()
        const login = `${participant}_${ticket}`
        const email = `${login}@email.com`
        const userJson = {
          username: participant,
          email: email,
          password: password,
          login: login,
          institution: parameters.institution,
          grade: parameters.grade,
          eventId: eventId
        }
        this.current = {
          username: participant,
          eventId: userJson.eventId,
          ticket: ticket,
          language: language
        }
        const user = await MessageBus.i.request('user/create/post', userJson)
        console.log(user.message)
        if (user.message.error) {
          console.log('--- error')
          console.log(user.message)
          const err = user.message.error
          if (err.type && err.type === 'duplicated')
            this._showFeedback(`Duplicated id ${login}.`)
          else if (err.type && err.type === 'unauthorized')
            this._showFeedback(
              'You need authorization to register.')
          else
            this._showFeedback(
              'There was an error in your registration. Contact support: ' +
              'error message - "' +
              ((user.message.error.message)
                ? user.message.error.message : '') + '".'
            )
        } else {
          const agree = true
          const now = new Date()
          const termJson = {
            userId: user.message.id,
            termId: parameters.term,
            nameResponsible: '',
            emailResponsible: email,
            nameParticipant: participant,
            date: `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()}`,
            role: parameters.role,
            agree: (agree) ? '1' : '0'
          }
          console.log('=== term json')
          console.log(termJson)
          const term = await MessageBus.i.request('user/term/post', termJson)
          console.log('=== term add')
          console.log(term)
          document.querySelector('#complete-form').style.display = 'none'
          // this._showFeedback(
          //   this.finalMessage.replace('{password}', userJson['password']),
          //   'darkblue')

          const userLogin = {
            username: this.current.username,
            eventId: this.current.eventId
          }
          const userL = await MessageBus.i.request('user/login/post', userLogin)

          const address = { // remote
            'nl': {
              0: 'e7451e3b-507e-472e-a092-4a2e1d56483d',
              1: '9d86ae9a-d582-4f03-bce8-ac73250047cf'
            },
            'en': {
              0: 'c087573d-0490-445d-ae5f-7d7f953aeaa8',
              1: '341986cd-4781-4027-8360-1112bfd07cf0'
            }
          }
          const caseRoom = '7d04fe0f-039a-4da7-af97-612d71f6182d' // remote

          /*
          const address = { // local
            'nl': {
              0: '14a3f09b-773b-49d9-808c-69b714c24251',
              1: 'cf9e88f2-08b3-4376-8872-88f1fde12ce1'
            },
            'en': {
              0: 'fa56b36e-d22b-403c-a841-7ef2cae5e0bc',
              1: 'd10263f3-e97c-4033-b7e4-087eeaab3e90'
            }
          }
          const caseRoom = '1252bde2-c370-4268-950d-d05c889d34e6' // local
          */

          const selectedAddress = address[this.current.language][Number.parseInt(this.current.ticket) % 2]
          window.location.href = `/player/case/?id=${selectedAddress}&room=${caseRoom}`
        }
      }
    }
  }

  // experiment version
  async _experimentStartISC () {
    const userLogin = {
      username: this.current.username,
      eventId: this.current.eventId
    }
    let user = await MessageBus.i.request('user/login/post', userLogin)
    // window.location.href = "/player/case/?id=41813d6c-70c7-4bda-9683-1dd39ba3c990&room=c6b241ee-e6e5-4921-9cc8-ed6ffd62e85d"
    // window.location.href = "/player/case/?id=46d46199-a32d-42ed-b49a-578c47c3e7bb&room=5ff12575-0d4c-41f6-ac6a-e94ee1eb7cbc"
    window.location.href = "/player/case/?id=cc2ba189-3a9a-465b-8011-579cbf1bf42c&room=5ff12575-0d4c-41f6-ac6a-e94ee1eb7cbc"
  }

  async _experimentStartAdultMuseum () {
    const userLogin = {
      username: this.current.username,
      eventId: this.current.eventId
    }
    let user = await MessageBus.i.request('user/login/post', userLogin)
    // window.location.href = "/player/case/?id=8b969606-ad6b-4772-a8e8-f15ae8033e0e&room=f2ef57a5-7c71-4fd9-9fd5-69448020c981"
    // window.location.href = "/player/case/?id=164e49f9-fee2-49dc-aa16-53bf7cf3ea97&room=2dcc1f39-85e6-4cfe-9539-58145f6cc98b"
    // window.location.href = '/player/env/teacher.html'
    window.location.href = 'https://jacinto.harena.org/player/case/?id=ed7675f4-0fde-4c55-bbfb-e37c1f7dcdd9&list=plain'
  }

  async _experimentStartSWE () {
    const userLogin = {
      username: this.current.username,
      eventId: this.current.eventId
    }
    let user = await MessageBus.i.request('user/login/post', userLogin)
    window.location.href = '/author/env/inf331_2023'
  }

  async _experimentStartJacinto () {
    const userLogin = {
      username: this.current.username,
      eventId: this.current.eventId
    }
    let user = await MessageBus.i.request('user/login/post', userLogin)
    window.location.href = '/player/env/index-jacinto.html'
  }
}

(function () {
  UserSignup.i = new UserSignup()
})()

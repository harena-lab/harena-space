class LayoutController {
  constructor () {
    this._case = null
    this._user = null
    this.busMessages()
    //Prognosis specific experiment
    this.prognosisAvatar = this.prognosisAvatar.bind(this)
    MessageBus.i.subscribe('control/html/ready', this.prognosisAvatar)
    // this.startController()
  }

  set case (newValue) {
    this._case = newValue
  }

  get case () {
    return this._case
  }

  set user (newValue) {
    this._user = newValue
  }

  get user () {
    return this._user
  }

  async startController(){
    if(document.readyState == 'loading'){
      await MessageBus.i.waitMessage('control/html/ready')
    }

    if(new URL(document.location).pathname == '/'){
      this.dynamicMainPage()
    }

    if(new URL(document.location).pathname == '/author/'){
      this.dynamicAuthor()
    }
    if(new URL(document.location).pathname == '/author/home/'){
      this.dynamicMenu()
    }else if(new URL(document.location).pathname == '/author/drafts/feedback/'){
      this.dynamicCaseListFeedback()
    }
    if(document.querySelector('#share-modal')){
      this.dynamicShareCaseElements = this.dynamicShareCaseElements.bind(this)
      this.dynamicShareCaseModal = this.dynamicShareCaseModal.bind(this)
      // this.authorizeCommentSection = this.authorizeCommentSection.bind(this)
      MessageBus.i.subscribe('control/dhtml/ready', this.dynamicShareCaseElements)
      MessageBus.i.subscribe('control/dhtml/ready', this.dynamicShareCaseModal)
      // MessageBus.i.subscribe('control/dhtml/ready', this.authorizeCommentSection)
      MessageBus.i.publish('control/dhtml/status/request', {id: 'dhtml-subject'})
      MessageBus.i.publish('control/dhtml/status/request', {id: 'harena-dhtml-cases'})
      MessageBus.i.publish('control/dhtml/status/request', {id: 'dhtml-case'})
      // MessageBus.i.publish('control/dhtml/status/request', {id: 'dhtml-case-comments'})
    }

  }

  async busMessages(){
    // console.log('======= starting conditional-layout')
    LayoutController.user = await MessageBus.i.waitMessage('user/login/+')
    if(new URL(document.location).pathname == '/author/'){
      LayoutController.case = await MessageBus.i.waitMessage('service/response/get/harena-case')
    }
    // console.log('============ starting controller dynamic')
    this.startController()

  }
  async prognosisAvatar (){
    if(new URL(document.location).pathname.includes('/prognosis')
    && !new URL(document.location).pathname.includes('/prognosis/creation')
    && !new URL(document.location).pathname.includes('/prognosis/calculator')){
      if(!PrognosisAvatar.i._avatarSet)
       PrognosisAvatar.i._avatarSet = await PrognosisAvatar.i.avatarSet()
      if (PrognosisAvatar.i._avatarSet != false) {
        PrognosisAvatar.i.changeMenuAvatar (PrognosisAvatar.i._avatarSet, document.querySelector('#logoutDropdownBtn'))
      }
    }
  }
  /////////  @@WORK IN PROGRESS NOT IMPLEMENTED//
  async authorizeCommentSection() {
    // var dhtmlReady = querySelector('#dhtml-case-comments')
    console.log('============')
    // console.log(dhtmlReady._ready)
    // if(dhtmlReady._ready){
    console.log('============ authorizeCommentSection')
    var userGrade = LayoutController.user
    if(userGrade !== 'professor'
    && userGrade !== 'admin'
    && userGrade !== 'coordinator'){
      var disabledFieldSet = document.createElement('fieldset')
      disabledFieldSet.setAttribute('disabled','true')
      var commentsBlock = document.querySelector('#comments-block')
      commentsBlock.setAttribute('data-toggle','tooltip')
      commentsBlock.setAttribute('data-placement','top')
      commentsBlock.setAttribute('title','Comments are "view-only" for students.')
      document.querySelector('#elements-block').insertBefore(disabledFieldSet,commentsBlock)
      disabledFieldSet.appendChild(commentsBlock)
      document.querySelector('#btn-save-comments').remove()
    }
    if(LayoutController.case.message.feedback == 0 || !LayoutController.case.message.feedback){
      document.querySelector("dcc-dhtml#dhtml-case-comments input[name='login']")
    }
    // }

  }

  async dynamicAuthor (){

    if(LayoutController.case.message.category_id === 'pocus-training'
    && (LayoutController.user.message.institution === 'hcpa' || LayoutController.user.message.institution === 'unisinos')){
      const toolbarDiv = document.querySelector('#div-toolbar-rightside')
      toolbarDiv.innerHTML =
      `<div class="home-author-sub-text align-self-center" style="color:#808080">FEEDBACK:</div>
      <dcc-rest id="harena-ask-feedback" bind="harena-ask-feedback"
      subscribe="service/request/post"></dcc-rest>
      <dcc-rest id="harena-case-property" bind="harena-case-property" subscribe="service/request/post"></dcc-rest>
      <form id="form-case-property">
      <input type="hidden" id="property_value" name="property_value" value="">
      <input type="hidden" id="property_title" name="property_title" value="feedback">

      </form>`
      // ------------------------------------------------------------------------------- //



      const dccSubmitProp = document.createElement('dcc-submit')
      const userGrade = LayoutController.user.message.grade
      const formProp = document.querySelector('#form-case-property')
      const inputPropertyValue = document.querySelector('#property_value')


      if(userGrade === 'student'){

        dccSubmitProp.setAttribute('id','dcc-submit-feedback')
        dccSubmitProp.setAttribute('bind','submit-case-property')
        dccSubmitProp.setAttribute('xstyle','btn btn-secondary m-1')
        dccSubmitProp.setAttribute('label', "Send to Professor")
        dccSubmitProp.setAttribute('topic','service/request/post')
        // dccSubmitProp.setAttribute('connect','submit:harena-case-property:service/request/post')
        dccSubmitProp.setAttribute('data-toggle','tooltip')
        dccSubmitProp.setAttribute('data-placement','top')
        dccSubmitProp.setAttribute('title',"Send case for professor's feedback")
        await formProp.appendChild(dccSubmitProp)

        inputPropertyValue.value = '0'

      }else if(userGrade === 'professor' || userGrade === 'coordinator'){
        dccSubmitProp.setAttribute('id','dcc-submit-feedback')
        dccSubmitProp.setAttribute('bind','submit-case-property')
        dccSubmitProp.setAttribute('xstyle','btn btn-secondary m-1')
        dccSubmitProp.setAttribute('label','Set Feedback Complete')
        dccSubmitProp.setAttribute('topic','service/request/put')
        dccSubmitProp.setAttribute('connect','submit:harena-case-property:service/request/put')
        dccSubmitProp.setAttribute('data-toggle','tooltip')
        dccSubmitProp.setAttribute('data-placement','top')
        dccSubmitProp.setAttribute('title',"Sets feedback as finished (for your student's knowlegde)")

        await formProp.appendChild(dccSubmitProp)

        inputPropertyValue.value = '1'
      }

      this.feedbackButtonCaseState()

      if(new URL(document.location).searchParams.get('fdbk')){
        setTimeout(function(){
          // document.querySelector('#button-comments-nav').click()
          // MessageBus.i.publish('control/properties/expand')
          MessageBus.i.publish('control/comments/expand')
          // MessageBus.i.publish('control/comments/editor')
        }, 500)
      }

    }

  }

  async dynamicMenu (){

    if((LayoutController.user.message.institution === 'hcpa' || LayoutController.user.message.institution === 'unisinos')
    && document.querySelector('#home-btn-container')){
      const btnContainer = document.querySelector('#home-btn-container')
      const btnFeedback = document.createElement('template')
      btnFeedback.innerHTML =
        `<a id="home-btn-feedback" href="/author/drafts/feedback?clearance=4&prop=feedback" class="d-flex flex-column align-items-center
         justify-content-center home-author-box-content home-author-case-box" style="height:50%; font-size: 30px;">
          Feedbacks
          <div class="home-author-sub-text">
            Feedback case list.
          </div>
        </a>`
        if(!document.querySelector('#home-btn-feedback')){
          btnContainer.appendChild(btnFeedback.content.cloneNode(true))
        }
    }
  }

  async dynamicCaseListFeedback (){
    // console.log('============ starting dynamic list')
    if(LayoutController.user.message.grade === 'professor'
    || LayoutController.user.message.grade === 'coordinator'){
      document.querySelector('#txt-draft-presentation').innerHTML = "Students's cases with feedback request"
      //Selects all divs that start the attribute 'id' with 'e'
      const caseButtons = document.querySelectorAll('div.author-panel-button[id^="e"]')

      for (let d in caseButtons){

        if(caseButtons[d].nodeName === 'DIV'){

          caseButtons[d].innerHTML = 'EDIT FEEDBACK'
        }

      }
    }
  }

  async feedbackButtonCaseState (propValue){
    const userGrade = LayoutController.user.message.grade
    const btnFeedback = document.querySelector('#dcc-submit-feedback')
    if(propValue){
      LayoutController.case.message.property.feedback = propValue
    }
    if(userGrade === 'student'){

      //Verifies property 'feedback' to disable button and change layout
      if(LayoutController.case.message.property.feedback){
        if(LayoutController.case.message.property.feedback == 0){

          btnFeedback.firstElementChild.innerHTML = 'Sent'
        }else {
          btnFeedback.firstElementChild.innerHTML = 'Recieved'
        }

        btnFeedback.firstElementChild.classList.add('disabled')
        btnFeedback.style.pointerEvents = 'none'
        document.querySelector('#dcc-submit-feedback').removeAttribute('topic')
        document.querySelector('#dcc-submit-feedback').removeAttribute('connect')
        try {
          document.querySelector('#property_value').remove()
          document.querySelector('#property_title').remove()
          document.querySelector('#harena-case-property').remove()
          document.querySelector('#harena-ask-feedback').remove()
        } catch (e) {
          console.log(e)
        }
      }
      btnFeedback.addEventListener("click", function(event) {
          btnFeedback.firstElementChild.innerHTML = 'Sent'
          btnFeedback.firstElementChild.classList.add('disabled')
          btnFeedback.style.pointerEvents = 'none'
          document.querySelector('#dcc-submit-feedback').removeAttribute('topic')
          document.querySelector('#dcc-submit-feedback').removeAttribute('connect')
          document.querySelector('#harena-case-property').remove()
          document.querySelector('#harena-ask-feedback').remove()
      })

    }else if(userGrade === 'professor' || userGrade === 'coordinator'){
      if(document.querySelector('#harena-ask-feedback'))
        document.querySelector('#harena-ask-feedback').remove()

      let casePropertyRest = document.querySelector('#harena-case-property')
      let caseDccSubmit = document.querySelector('#dcc-submit-feedback')

      if(LayoutController.case.message.property.feedback){
        btnFeedback.firstElementChild.innerHTML = 'Notify as Complete'

        if(LayoutController.case.message.property.feedback == 1){
          casePropertyRest.remove()
          btnFeedback.firstElementChild.innerHTML = 'Notified as Complete'
          btnFeedback.firstElementChild.classList.add('disabled')
          btnFeedback.style.pointerEvents = 'none'
          caseDccSubmit.removeAttribute('topic')
          caseDccSubmit.removeAttribute('connect')
          try {
            document.querySelector('#property_value').remove()
            document.querySelector('#property_title').remove()
          } catch (e) {
            console.log(e)
          }

        }
        btnFeedback.addEventListener("click", function(event) {
            btnFeedback.firstElementChild.innerHTML = 'Notified as Complete'
          })
      }
    }
  }

  async dynamicShareCaseModal (){

    const dhtmlInstitutions = document.querySelector('#dhtml-subject')
    if(dhtmlInstitutions._ready){
      // console.log('============ entered dynamic modal')
      const selEntity = document.querySelector('#entity')
      const wrapperSelEntity = document.querySelector('#wrapper-entity')
      const selSubject = document.querySelector('#wrapper-subject .sel-institution')
      const inputSubject = document.querySelector('#wrapper-input-subject')
      const wrapperSelSubject = document.querySelector('#wrapper-subject')
      const selSubjectGrade = document.querySelector('#subject_grade')
      const wrapperSelSubjectGrade = document.querySelector('#wrapper-subject_grade')

      const listenerFnEntity = function () {
        switch (selEntity.value) {
          case 'user':
            wrapperSelSubject.hidden = false
            wrapperSelSubjectGrade.disabled = true
            wrapperSelSubjectGrade.hidden = true

            selSubject.disabled = true
            selSubject.hidden = true
            selSubject.id = 'select-subject'
            selSubject.name = 'select-subject'

            inputSubject.firstElementChild.disabled = false
            inputSubject.firstElementChild.hidden = false
            inputSubject.firstElementChild.id = 'subject'
            inputSubject.firstElementChild.name = 'subject'

            selSubjectGrade.value = ""

            document.querySelector('label[for="subject"]').innerHTML = 'User email:'


            break
          case 'institution':
            wrapperSelSubject.hidden = false
            wrapperSelSubjectGrade.disabled = false
            wrapperSelSubjectGrade.hidden = false

            selSubject.disabled = false
            selSubject.hidden = false
            selSubject.id = 'subject'
            selSubject.name = 'subject'

            inputSubject.firstElementChild.disabled = true
            inputSubject.firstElementChild.hidden = true
            inputSubject.firstElementChild.id = 'input-subject'
            inputSubject.firstElementChild.name = 'input-subject'

            document.querySelector('label[for="subject"]').innerHTML = 'In:'

            break
          case 'group':
            wrapperSelSubject.hidden = false
            wrapperSelSubjectGrade.disabled = true
            wrapperSelSubjectGrade.hidden = true

            selSubject.disabled = true
            selSubject.hidden = true
            selSubject.id = 'select-subject'
            selSubject.name = 'select-subject'

            inputSubject.firstElementChild.disabled = false
            inputSubject.firstElementChild.hidden = false
            inputSubject.firstElementChild.id = 'subject'
            inputSubject.firstElementChild.name = 'subject'

            selSubjectGrade.value = ""

            document.querySelector('label[for="subject"]').innerHTML = 'Group name:'

            break
        }
      }

      document.querySelector('.share-cases-element.btn').removeEventListener('click', listenerFnEntity)
      document.querySelector('.share-cases-element.btn').addEventListener('click', listenerFnEntity)
      selEntity.removeEventListener('change', listenerFnEntity)
      selEntity.addEventListener('change', listenerFnEntity)
    }

  }

  async dynamicShareCaseElements(topic, message){
    const userGrade = LayoutController.user.message.grade

    // console.log('============ dynamicShareCaseElements')
    // console.log('============ message from bus')
    // console.log(message)
    if(message != null && message.id != null && (message.id == "harena-dhtml-cases" || message.id == "dhtml-case" || message.id == "harena-dhtml-cases")){
      // console.log('============ im ready')
      // console.log('============ user grade')
      // console.log(userGrade)
      if(userGrade === 'professor' || userGrade === 'coordinator' || userGrade === 'admin'){
        // console.log('============ user grade is acceptable')
        const shareCaseEssentials =  document.querySelectorAll('.share-cases-element')
        for (let e in shareCaseEssentials){
          if(shareCaseEssentials[e].nodeName)
          shareCaseEssentials[e].hidden = false
        }
      }
    }
  }

  async dynamicMainPage(){
    if((LayoutController.user.message.institution === 'progntrial' || LayoutController.user.message.institution === 'progn') && document.querySelector('.home-play-container')){
      const btnContainer = document.querySelector('.home-play-container')
      const btnAuthor = btnContainer.querySelector('#author-btn')
      const btnPlayer = btnContainer.querySelector('#player-btn')
      btnAuthor.remove()
      btnPlayer.textContent = 'Jogar Roda da Fortuna'
      btnPlayer.setAttribute('onclick',`location.href='/prognosis'`)
      btnPlayer.classList.remove('col-4','ml-4')
    }
  }

}
(function () {
  LayoutController.instance = new LayoutController()

})()

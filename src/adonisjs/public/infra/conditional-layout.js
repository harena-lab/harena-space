class LayoutController {
  constructor () {
    this._case = null
    this._user = null
    this.busMessages()
    this.startController()
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
    await MessageBus.ext.waitMessage('control/case/ready')

    this.dynamicAuthor()
  }

  async busMessages(){
    LayoutController.user = await MessageBus.int.waitMessage('data/user/info')
    LayoutController.case = await MessageBus.ext.waitMessage('service/response/get/harena-case')

  }

  async dynamicAuthor (){

    if(LayoutController.case.message.category_id === 'pocus-training'
    && LayoutController.user.message.institution === 'hcpa'){
      const toolbarDiv = document.querySelector('#div-toolbar-rightside')
      toolbarDiv.innerHTML =
      `<dcc-rest id="harena-ask-feedback" bind="harena-ask-feedback"
      subscribe="share/request/post:retrieve"></dcc-rest>
      <dcc-rest id="harena-case-property" bind="harena-case-property"
      subscribe="share/request/post:retrieve"></dcc-rest>
      <form>
      <input type="hidden" id="property_value" name="property_value" value="">
      <input type="hidden" id="property_title" name="property_title" value="feedback">
      <button type="button" class="btn btn-secondary m-1" id="btn-submit-feedback"
      data-toggle="tooltip" data-placement="top" title="">Feedback</button>
      <dcc-submit id="dcc-submit-feedback" bind="submit-case-property" label="Ready for Feedback" location="btn-submit-feedback"
      xstyle="out" topic="share/request/post"></dcc-submit>

      </form>`
      // ------------------------------------------------------------------------------- //

      const userGrade = LayoutController.user.message.grade
      const btnFeedback = document.querySelector('#btn-submit-feedback')
      const inputPropertyValue = document.querySelector('#property_value')

      if(userGrade === 'aluno'){
        btnFeedback.innerHTML = 'Ready for Feedback'
        btnFeedback.title = "Send case for professor's feedback"
        inputPropertyValue.value = '0'

      }else if(userGrade === 'professor' || userGrade === 'coordinator'){
        btnFeedback.innerHTML = 'Set Feedback Complete'
        btnFeedback.title = "Sets feedback as finished (for your student's knowlegde)"
        inputPropertyValue.value = '1'
      }
      this.feedbackButtonCaseState()


    }

  }

  async feedbackButtonCaseState (){

    const userGrade = LayoutController.user.message.grade
    const btnFeedback = document.querySelector('#btn-submit-feedback')

    if(userGrade === 'aluno'){

      //Verifies property 'feedback' to disable button and change layout
      if(LayoutController.case.message.property.feedback){
        console.log('============')
        if(LayoutController.case.message.property.feedback == 0){

          btnFeedback.innerHTML = 'Waiting Feedback'
        }else {
          btnFeedback.innerHTML = 'Feedback Recieved'
        }

        btnFeedback.setAttribute('disabled','disabled')
        btnFeedback.style.pointerEvents = 'none'
        btnFeedback.setAttribute('disabled','disabled')
        document.querySelector('#dcc-submit-feedback').setAttribute('topic','')
        document.querySelector('#property_value').remove()
        document.querySelector('#property_title').remove()
        document.querySelector('#harena-case-property').remove()
        document.querySelector('#harena-ask-feedback').remove()

      }

    }else if(userGrade === 'professor' || userGrade === 'coordinator'){
      document.querySelector('#harena-ask-feedback').remove()
      let casePropertyRest = document.querySelector('#harena-case-property')
      let caseDccSubmit = document.querySelector('#dcc-submit-feedback')
      // caseDccSubmit.setAttribute('topic','share/request/put')
      // casePropertyRest.setAttribute('subscribe','share/request/put:retrieve')

      if(LayoutController.case.message.property.feedback){
        btnFeedback.innerHTML = 'Set Feedback Complete'

        if(LayoutController.case.message.property.feedback == 1){
          btnFeedback.innerHTML = 'Feedback Sent'
          btnFeedback.setAttribute('disabled','disabled')
          btnFeedback.style.pointerEvents = 'none'
          btnFeedback.setAttribute('disabled','disabled')
          caseDccSubmit.setAttribute('topic','')
          document.querySelector('#property_value').remove()
          document.querySelector('#property_title').remove()
          casePropertyRest.remove()
        }
      }
    }

    btnFeedback.addEventListener("click", function(event) {

    })
  }

}
(function () {
  LayoutController.instance = new LayoutController()
})()

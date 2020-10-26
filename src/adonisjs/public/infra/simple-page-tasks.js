class PageController {
  constructor () {
    this.loadingPage = this.loadingPage.bind(this)
    window.addEventListener("load", function(event) {
      const template = document.createElement('template')
      template.innerHTML = PageController.loadingBox
      document.querySelector('body').appendChild(template.content.cloneNode(true))
      document.querySelector('main').classList.add('invisible')
    })
    MessageBus.ext.subscribe('control/dhtml/ready', this.loadingPage)
    MessageBus.ext.subscribe('control/case/ready', this.loadingPage)
  }

  loadingPage(){
    // console.log('page load complete')
    document.querySelector('main').classList.remove('invisible')
    document.querySelector('#loading-page-container').remove()
  }
}
(function () {
  PageController.instance = new PageController()

  PageController.loadingBox =
  `<div id="loading-page-container" class="d-flex flex-column justify-content-center align-items-center" style="position:absolute; top:50%; left:50%;">
    <div class="spinner-border align-self-center" role="status" aria-hidden="true"></div>
    <strong class="align-self-center">Loading...</strong>
   </div>`
})()

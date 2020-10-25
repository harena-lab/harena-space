class PageController {
  constructor () {
    this.loadingPage = this.loadingPage.bind(this)
    MessageBus.ext.subscribe('control/case/ready', this.loadingPage)
  }

  loadingPage(){
    console.log('page load complete')
    document.querySelector('main').classList.remove('invisible')
    document.querySelector('#loading-page-container').remove()
  }
}
(function () {
  PageController.instance = new PageController()
})()

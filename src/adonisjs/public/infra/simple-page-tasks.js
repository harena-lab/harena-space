class PageController {
  constructor () {

    PageController.scriptsComplete = false
    this.removeLoadingIcon = this.removeLoadingIcon.bind(this)
    window.addEventListener("load", function(event) {
      if (!PageController.scriptsComplete && document.querySelector('main')) {
        const template = document.createElement('template')
        template.innerHTML = PageController.loadingBox
        document.querySelector('body').appendChild(template.content.cloneNode(true))
        document.querySelector('main').classList.add('invisible')
      }

      // console.log(PageController.scriptsComplete)
    })
    MessageBus.ext.subscribe('control/dhtml/ready', this.removeLoadingIcon)
    MessageBus.ext.subscribe('control/case/ready', this.removeLoadingIcon)
  }

  async removeLoadingIcon(){
    if(document.querySelector('#loading-page-container')){
      document.querySelector('main').classList.remove('invisible')
      document.querySelector('#loading-page-container').remove()
    }
    try {
      document.querySelector('main').classList.remove('invisible')
    } catch (e) {
      console.log('Error while trying to remove class "invisible" of "main" element');
      console.log(e)
    }
    PageController.scriptsComplete = true
    // console.log(PageController.scriptsComplete)
  }

  controlDropdownMenu(){
    $(document).on('click', '.dropdown-menu', function (e) {
      e.stopPropagation();
    });

  }
}
(function () {
  PageController.instance = new PageController()
  PageController.instance.controlDropdownMenu()
  PageController.loadingBox =
  `<div id="loading-page-container" class="d-flex flex-column justify-content-center align-items-center" style="position:absolute; top:50%; left:50%;">
    <div class="spinner-border align-self-center" role="status" aria-hidden="true"></div>
    <strong class="align-self-center">Loading...</strong>
   </div>`
})()

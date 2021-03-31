class PageController {
  constructor () {

    PageController.scriptsComplete = false
    this.removeLoadingIcon = this.removeLoadingIcon.bind(this)
    this.pageReady = this.pageReady.bind(this)

    window.addEventListener("load", function(event) {
      if (!PageController.scriptsComplete && document.querySelector('main')) {
        const template = document.createElement('template')
        template.innerHTML = PageController.loadingBox
        document.querySelector('body').appendChild(template.content.cloneNode(true))
        document.querySelector('main').classList.add('invisible')
      }

      // console.log(PageController.scriptsComplete)
    })
    MessageBus.int.subscribe('control/dhtml/ready', this.removeLoadingIcon)
    MessageBus.ext.subscribe('control/case/ready', this.removeLoadingIcon)
    MessageBus.ext.subscribe('control/validate/ready', this.removeLoadingIcon)

    MessageBus.int.subscribe('control/html/ready', this.pageReady)
  }
  async pageReady(){
    PageController.instance.pageButtons(parseInt(localStorage.getItem('page')))
  }
  async removeLoadingIcon(){
    if(document.querySelector('#loading-page-container')){
      setTimeout(function(){
        document.querySelector('main').classList.remove('invisible')
        if(document.querySelector('#loading-page-container'))
          document.querySelector('#loading-page-container').remove()
        MessageBus.int.publish('control/html/ready')
      }, 500)
    }
    try {
      setTimeout(function(){
        document.querySelector('main').classList.remove('invisible')
      }, 3000)

    } catch (e) {
      console.log('Error while trying to remove class "invisible" of "main" element');
      console.log(e)
    }
    PageController.instance.appropriateBreadcrumb()
    PageController.scriptsComplete = true
    // console.log(PageController.scriptsComplete)
  }

  controlDropdownMenu(){
    $(document).on('click', '.dropdown-menu', function (e) {
      e.stopPropagation();
    });

  }

  async harenaVersionFootNote(){
    if(!sessionStorage.getItem('harena-version')){
      const config = {
        url: 'https://api.github.com/repos/harena-lab/harena-space/releases/latest',
      }
      await axios(config)
      .then(function (endpointResponse) {
        sessionStorage.setItem('harena-version', endpointResponse.data.tag_name)
        console.log(endpointResponse.data.tag_name)

      })
      .catch(function (error) {
        console.log(error)
      })
    }
    window.addEventListener("load", function(event) {
      if(document.querySelector('#version-footnote'))
      document.querySelector('#version-footnote')
      .innerHTML = 'Harena Version - ' + sessionStorage.getItem('harena-version')
    })
  }

  async appropriateBreadcrumb(){
    let url = new URL(window.location)
    if(url.pathname == '/player/case/'){
      if(url.searchParams.get('preview')){
        const breadcrumbGroup = document.querySelector('#breadcrumb-group')
        for (let c = 0; c < breadcrumbGroup.childElementCount;){
          console.log('============')
          console.log('child count updated')
          console.log(breadcrumbGroup.childElementCount)

          console.log('current child')
          console.log(c)
          console.log(breadcrumbGroup.children[c])
          console.log('============')
          if(!breadcrumbGroup.children[c].id){
            console.log('not found id..deleting element')
            console.log(breadcrumbGroup.children[c])
            breadcrumbGroup.removeChild(breadcrumbGroup.children[c])
            c = 0
            console.log('returning index to ' + c)
          }else {
            console.log('found id')
            console.log(breadcrumbGroup.children[c])
            c++
          }
        }
        document.querySelector('#case-list-breadcrumb').firstElementChild.innerHTML = 'Return'
      }else if(url.searchParams.get('list') == 'all'){
        document.querySelector('#case-list-breadcrumb').firstElementChild.href = '/player/home/?clearance=1'
      }else{
        document.querySelector('#case-list-breadcrumb').firstElementChild.href =
        '/player/home/category/cases/?id='+ url.searchParams.get('list') +'&clearance=1'
      }
    }
  }
////////////////////////////////////////////////////////////////////////////////

async pageButtons(p){
  var state = {
    'nPages': 18,
    'page': p,
    'window': 4,
  }
  var pages = 18
  var wrapper = document.getElementById('pagination-wrapper')
  wrapper.innerHTML = (``)
  var maxLeft = (state.page - Math.floor(state.window / 2))
  var maxRight = (state.page + Math.floor(state.window / 2))

  if (maxLeft < 1) {
    maxLeft = 1
    maxRight = state.window
  }

  if (maxRight > pages) {
    maxLeft = pages - (state.window - 1)

    if (maxLeft < 1){
      maxLeft = 1
    }
    maxRight = pages
  }


  for (var page = maxLeft; page <= maxRight; page++) {
    if(page === state.page){
      wrapper.innerHTML += `<button value=${page} class="page page-btn btn btn-sm btn-secondary disabled">${page}</button>`
    }else{
      wrapper.innerHTML += `<button value=${page} class="page page-btn btn btn-sm btn-secondary">${page}</button>`
    }

  }

  if (state.page != 1) {
    wrapper.innerHTML = `<button value=${1} class="page page-btn btn btn-sm btn-secondary">&#171; First</button>` + wrapper.innerHTML
  }

  if (state.page != pages) {
    wrapper.innerHTML += `<button value=${pages} class="page page-btn btn btn-sm btn-secondary">Last &#187;</button>`
  }

  $('.page').on('click', function() {
    localStorage.setItem('page', Number($(this).val()))
    PageController.instance.pageButtons(Number($(this).val()))
    document.querySelector('#page').value = Number($(this).val())
    console.log('==================================================')
    console.log(document.querySelector('#page').value)
    MessageBus.ext.publish('cases/request/get')
  })
}
////////////////////////////////////////////////////////////////////////////////
}
(function () {
  PageController.instance = new PageController()
  PageController.instance.controlDropdownMenu()
  PageController.instance.harenaVersionFootNote()
  PageController.loadingBox =
  `<div id="loading-page-container" class="d-flex flex-column justify-content-center align-items-center" style="position:absolute; top:50%; left:50%;">
  <div class="spinner-border align-self-center" role="status" aria-hidden="true"></div>
  <strong class="align-self-center">Loading...</strong>
  </div>`
})()

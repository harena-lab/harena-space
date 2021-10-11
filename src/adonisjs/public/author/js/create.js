class TemplateManager {
  async start () {
    const authorState = Basic.service.authorStateRetrieve()

    const params = window.location.search.substr(1)
    this._mode = null
    if (params != null && params.length > 0) {
      this._mode = params.match(/mode=([\w-]+)/i)
      this._mode = (this._mode == null) ? null : this._mode[1]
    }

    this._boxesPanel = document.querySelector('#template-boxes')
    this._templateSelect()
  }

  async _templateSelect () {
    const templateList = await MessageBus.i.request('data/template/*/list',
      { scope: 'case' }, null, true)

    const tl = templateList.message
    for (const t in tl) {
      if (tl[t].environment != 'development' || (this._mode != null && this._mode == 'advanced')) {
        const tid = tl[t].id.replace(/\//ig, '__')
        const template = document.createElement('template')
        const imageIcon = Basic.service.imageResolver(tl[t].icon)
        template.innerHTML = TemplateManager.templateBox
          .replace('[id]', tid)
          .replace('[icon]', imageIcon)
          .replace('[title]', tl[t].name)
          .replace('[description]', tl[t].description)
        this._boxesPanel.appendChild(template.content.cloneNode(true))
        const box = this._boxesPanel.querySelector('#' + tid)
        box.addEventListener('click',
          function () {
            const tid = this.id.replace(/__/ig, '/')
            Basic.service.authorPropertyStore('template',
              {
                id: tid,
                icon: imageIcon,
                title: tl[t].name,
                description: tl[t].description
              })
            window.location.href = '/author/create/case?template=' + this.id + '&category=' + tl[t].questId
          }
        )
      }
    }
    MessageBus.i.publish('control/dhtml/ready')
  }
}

(function () {
  TemplateManager.instance = new TemplateManager()

  TemplateManager.templateBox =
`            <div class="d-flex h-75 flex-column create-template-author-container">
              <div class="h-75">
                <div class="h-50 draft-case-image text-center">
                   <img src="[icon]" class="home-author-image">
                </div>
                <div class="draft-case-title text-center">[title]</div>
                <div class="draft-author-description text-center">[description]</div>
              </div>

               <div class="d-flex">
                <div id="[id]" class="flex-column create-author-panel-button">NEW</div>
               </div>
            </div>`
})()

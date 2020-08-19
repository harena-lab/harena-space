class TemplateManager {
  async start () {
    const authorState = Basic.service.authorStateRetrieve()

    this._boxesPanel = document.querySelector('#template-boxes')
    this._templateSelect()
  }

  async _templateSelect () {
    const templateList = await MessageBus.ext.request('data/template/*/list',
      { scope: 'case' })

    const tl = templateList.message
    for (const t in tl) {
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
          window.location.href = 'choose-template?template=' + this.id
        }
      )
    }
  }
}

(function () {
  TemplateManager.instance = new TemplateManager()

  TemplateManager.templateBox =
`<div class="d-flex h-100 flex-column draft-author-case-container">
   <div class="draft-case-image w-100 h-50">
      <img src="[icon]" class="home-author-image">
   </div>
   <div class="draft-case-title">[title]</div>
   <div class="draft-author-description">[description]</div>
   <div class="d-flex"><div id="[id]" class="author-panel-button">NEW</div></div>
</div>`
})()

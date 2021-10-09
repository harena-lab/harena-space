class QuestManager {
  async start () {
    // let mode = window.location.search.substr(1)
    // if (mode != null && mode.length > 0) {
    //   const md = mode.match(/mode=([\w-]+)/i)
    //   mode = (md == null) ? null : md[1]
    // } else { mode = null }
    // const advanced =
    //      !!((mode != null && mode.toLowerCase() == 'advanced'))
    //
    // this.deleteCase = this.deleteCase.bind(this)
    // MessageBus.i.subscribe('control/case/delete', this.deleteCase)
    //
    // if (advanced) {
    //   this.downloadCase = this.downloadCase.bind(this)
    //   MessageBus.i.subscribe('control/case/download', this.downloadCase)
    // }

    // const authorState = Basic.service.authorStateRetrieve();

    this._boxesPanel = document.querySelector('#case-boxes')
    // this._draftSelect(authorState.userid, advanced);
    this._draftSelect()
  }

  async _draftSelect () {
    // {user: userid});

    const cl = cases.message
    for (const c in cl) {
      const template = document.createElement('template')

      template.innerHTML = html
        .replace(/\[id\]/ig, cl[c].id)
      // .replace("[icon]", cl[c].icon)
        .replace('[title]', cl[c].title)
      // .replace("[description]", cl[c].description);
      this._boxesPanel.appendChild(template.content.cloneNode(true))
      const editButton = this._boxesPanel.querySelector('#e' + cl[c].id)
      editButton.addEventListener('click',
        function () {
          Basic.service.authorPropertyStore('caseId', this.id.substring(1))
          // window.location.href = "http://0.0.0.0:10010/author/author.html";
          window.location.href =
                  'author?id=' + this.id.substring(1)
        }
      )
    }
  }
}
// <div class="draft-case-image w-100 h-50"></div>

(function () {
  QuestManager.instance = new QuestManager()

  QuestManager.caseBox =
`<div id="b[id]" class="row draft-author-case-container">
  <div class="col draft-case-title">[title]</div>
  <div class="d-flex justify-content-end">
    <div id="e[id]" class="col author-panel-button">VIEW</div>
  </div>
</div>`
})()

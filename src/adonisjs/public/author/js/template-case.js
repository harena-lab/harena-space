class TemplateToCase {
  async start () {
    const authorState = Basic.service.authorStateRetrieve()

    if (authorState != null && authorState.template != null) {
      document.querySelector('#template-title').innerHTML =
            'Create: ' + authorState.template.title
    }
  }
}

(function () {
  TemplateToCase.s = new TemplateToCase()
})()

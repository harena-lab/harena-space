function _harenaCustomUploadAdapterPlugin( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
        return new HarenaUploadAdapter(loader, Basic.service.currentCaseId, DCCCommonServer.token);
    };
}

class Annotator {
  constructor () {
   	Basic.service.rootPath = '../../../'

    Translator.instance.authoringRender = true

    this._annotationAction = this._annotationAction.bind(this)
    MessageBus.i.subscribe('annotation/button/#', this._annotationAction)

    this._richToMarkdown = this._richToMarkdown.bind(this)
    MessageBus.i.subscribe('control/tomark/text', this._richToMarkdown)
    this._markdownToRich = this._markdownToRich.bind(this)
    MessageBus.i.subscribe('control/torich/text', this._markdownToRich)
  }

  async start () {
    let cs = await MessageBus.i.request('case/source/get',
      {
        caseId: new URL(document.location).searchParams.get('caseid')
      }
    )
    const compiled =
         await Translator.instance.compileMarkdown(
           cs.message.id, cs.message.source)
    console.log('=== case source')
    console.log(this._compiledCase)

    let html = ''
    for (const knot in compiled.knots) {
      const mkHTML = await Translator.instance.generateHTML(compiled.knots[knot])
      html += mkHTML
    }

    const annot = []

    document.querySelector('#editor-space').innerHTML = html
    this._buildEditor()
  }

  _buildEditor () {
    const presentation = document.querySelector('#editor-space')
    DecoupledEditor.create(presentation,
      {
        toolbar: {
          items: ['annotatePatho', 'annotateEpi',  'annotateEti', 'annotateCli',
                  'annotateLab',   'annotateDiff', 'annotateThera', '-', 'annotateEncap',
                  'annotateJar',   'annotateWrong'],
          shouldNotGroupWhenFull: true
        }
      } )
      .then( editor => {
        const toolbarContainer = document.querySelector('#editor-toolbar')
        toolbarContainer.appendChild(editor.ui.view.toolbar.element)

        window.editor = editor;
        this._editor = editor;

        editor.model.document.on( 'change:data', () => {
          this._textChanged = true
        } );
      } )
      .catch( error => {
        console.error( 'There was a problem initializing the editor.', error );
    } );
  }

  _annotationAction (topic, message) {
    let doc = this._editor.getData()
    doc = doc.replace(/<\/?p>/g, '')
    console.log('=== getData')
    console.log(doc)
    let pi = doc.indexOf(Annotator.tags.start)
    const annotations = []
    while (pi != -1) {
      const pf = doc.indexOf('>', pi)
      const ei = doc.indexOf(Annotator.tags.end, pf)
      const an = {start: pi,
                  end: ei - pf - 1,
                  fragment: doc.substring(pf + 1, ei)}
      let meta = doc.substring(pi + Annotator.tags.start.length, pf).split('=""')
      console.log(an)
      console.log(meta)

      for (const m of meta) {
        if (m.trim().length > 0)
          annotations.push(Object.assign({property: m.trim()}, an))
      }

      doc = doc.substring(ei + Annotator.tags.end.length)
      pi = doc.indexOf(Annotator.tags.start)
    }
    console.log('=== annotations')
    console.log(annotations)
    this._updateSummary(annotations)
  }

  _updateSummary (annotations) {
    let html = '<table>'
    let last = ''
    for (const an of annotations) {
      html += '<tr><td>' +
        ((an.fragment != last) ? an.fragment : '') + '</td>' +
        '<td>' + an.property + '</td>'
      last = an.fragment
    }
    document.querySelector('#details').innerHTML = html
  }

  _richToMarkdown() {
    const md = RichEditor.i.richToMarkdown(this._editor.getData())
    document.querySelector('#conversion-results').value = md
  }

  async _markdownToRich() {
    const compiled = await Translator.instance.compileMarkdown(
      'test', document.querySelector('#conversion-results').value)
    let html = ''
    for (const knot in compiled.knots) {
      const mkHTML = await Translator.instance.generateHTML(compiled.knots[knot])
      html += mkHTML
    }
    this._editor.setData(html)
  }
}

(function () {
  Annotator.i = new Annotator()

  Annotator.tags = {
    start: '<annotation',
    end:   '</annotation>'
  }
})()

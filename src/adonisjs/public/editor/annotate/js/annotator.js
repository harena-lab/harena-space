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
                  'annotateJar',   'annotateWrong', 'annotateTypo'],
          shouldNotGroupWhenFull: true
        }
      } )
      .then( editor => {
        const toolbarContainer = document.querySelector('#editor-toolbar')
        toolbarContainer.appendChild(editor.ui.view.toolbar.element)

        if (CKEditorInspector != undefined)
          CKEditorInspector.attach(editor)

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
    const anGroup = {}
    while (pi != -1) {
      const pf = doc.indexOf('>', pi)
      let ei = doc.indexOf(Annotator.tags.end, pf)

      // check if there is an annotation inside another annotation
      let shift = 0
      const inside = doc.indexOf(Annotator.tags.start, pf)
      if (inside > -1 && inside < ei) {
        ei = doc.indexOf(Annotator.tags.end, ei + Annotator.tags.end.length + 1)
        shift = doc.indexOf('>', inside) - inside + 1 +
                Annotator.tags.end.length + 2
      }

      const an = {start: pi,
                  end: ei - pf - 1 - shift,
                  fragment: doc.substring(pf + 1, ei)
                              .replace(/<annot[^>]*>/g, '')
                              .replace(/<\/annot[\d]>/g, '')}

      const meta = doc.substring(pi + Annotator.tags.start.length + 1, pf)
        .matchAll(/([\w-]+)="([^"]*)"/g)
      console.log('=== match')
      const categories = []
      let group = 0
      for (const m of meta) {
        if (m[2].length == 0)
          categories.push(m[1])
        else if (m[1] == 'group') {
          group = m[2]
        }
        console.log(m)
      }

      let slot = {fragments: [], categories: categories}
      if (group == 0 || anGroup[group] == null)
        annotations.push(slot)
      if (group != 0) {
        if (anGroup[group])
          slot = anGroup[group]
        else {
          slot.group = group
          anGroup[group] = slot
        }
      }
      slot.fragments.push(an)

      /*
      let meta = doc.substring(pi + Annotator.tags.start.length + 1, pf)
                    .split('=""')

      for (const m of meta) {
        const mt = m.trim()
        // if (mt == 'group')
        //   an.group =
        if (m.trim().length > 0 &&
            !m.trim().startsWith("range") && !m.trim().startsWith("group"))
          an.meta.push(m.trim())
          // annotations.push(Object.assign({property: m.trim()}, an))
      }
      */

      doc = doc.substring(0, pi) +
            doc.substring(pf + 1, ei) +
            doc.substring(ei + Annotator.tags.end.length + 2)
      console.log('=== doc after')
      console.log(doc)
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
      html += '<tr><td>'
      let sep = ''
      for (const f of an.fragments) {
        html += sep + f.fragment
        sep = ' + '
      }
      html += '</td><td><table>'
      for (const c of an.categories) {
        html += '<tr><td>' + c + '</tr></td>'
      }
      html += '</td></tr></table>'
    }
    html += '</table>'
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
    start: '<annot',
    end:   '</annot'
  }
})()

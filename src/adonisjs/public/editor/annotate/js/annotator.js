function _harenaCustomUploadAdapterPlugin( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
        return new HarenaUploadAdapter(loader, Basic.service.currentCaseId, DCCCommonServer.token);
    };
}

class Annotator {
  constructor () {
   	Basic.service.rootPath = '../../../'
    Translator.instance.authoringRender = true

    this._document = ''

    this._annotationAction = this._annotationAction.bind(this)
    MessageBus.i.subscribe('annotation/button/#', this._annotationAction)

    this._gradeSave = this._gradeSave.bind(this)
    MessageBus.i.subscribe('control/grade/save', this._gradeSave)

    this._annotationsSave = this._annotationsSave.bind(this)
    MessageBus.i.subscribe('control/annotations/save', this._annotationsSave)
  }

  async start () {
    this._message = document.querySelector('#status-message')

    const caseId = new URL(document.location).searchParams.get('caseid')

    const cs = await MessageBus.i.request('case/source/get', {caseId: caseId})

    if (cs != null && cs.message != null) {
      this._case = cs.message

      const compiled =
           await Translator.instance.compileMarkdown(
             this._case.id, this._case.source)

      let html = ''
      for (const knot in compiled.knots) {
        const mkHTML =
          await Translator.instance.generateHTML(compiled.knots[knot])
        html += mkHTML
      }

      this._document = html
      document.querySelector('#editor-space').innerHTML = html

      const caseAnn =
        await MessageBus.i.request('case/annotations/get', {case_id: caseId})

      if (caseAnn != null && caseAnn.message != null) {
        const ca = caseAnn.message
        let cOrg = null
        let cScore = null
        for (const c of ca) {
          switch (c.property_id) {
            case Annotator.category.organization: cOrg = c.property_value; break
            case Annotator.category.score: cScore = c.property_value; break
          }
        }
        if (cOrg != null && cScore != null)
          this._showAnnotations(cOrg, cScore)
      }

      this._buildEditor()
    } else
      this._message.innerHTML = 'document not found'
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

        // <INSPECTOR>
        // if (CKEditorInspector != undefined)
        //   CKEditorInspector.attach(editor)

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
    // console.log('=== getData')
    // console.log(doc)
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
      // console.log('=== match')
      const categories = []
      let group = 0
      for (const m of meta) {
        if (m[2].length == 0)
          categories.push(m[1])
        else if (m[1] == 'group') {
          group = m[2]
        }
        // console.log(m)
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

      doc = doc.substring(0, pi) +
            doc.substring(pf + 1, ei) +
            doc.substring(ei + Annotator.tags.end.length + 2)
      // console.log('=== doc after')
      // console.log(doc)
      pi = doc.indexOf(Annotator.tags.start)
    }
    this._annotations = annotations
    this._updateSummary()
  }

  _updateSummary () {
    let html = '<table>'
    let last = ''
    for (const an of this._annotations) {
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

  async _gradeSave () {
    const organization = document.querySelector('#organization').value
    const score = document.querySelector('#score').value

    if (organization == 'c')
      this._message.innerHTML = 'select the organization'
    else if (score == 'c')
      this._message.innerHTML = 'select the score'
    else {
      const ann = {
        case_id: this._case.id,
        property_id: Annotator.category.organization,
        range: 'complete',
        property_value: organization,
        source: 1
      }
      let result = await MessageBus.i.request('case/annotation/post', ann)
      if (result.message.error)
        this._message.innerHTML = 'error saving organization'
      else {
        ann.property_id = Annotator.category.score
        ann.property_value = score
        result = await MessageBus.i.request('case/annotation/post', ann)
        if (result.message.error)
          this._message.innerHTML = 'error saving score'
        else {
          this._message.style = 'color:blue'
          this._message.innerHTML = 'organization/score submitted'
          this._showAnnotations(organization, score)
        }
      }
    }
  }

  async _annotationsSave () {
    const amsg = {
      case_id: this._case.id,
      source: 1
    }
    for (const an of this._annotations) {
      amsg.range = ''
      amsg.fragment = ''
      let sepR = ''
      let sepF = ''
      for (const f of an.fragments) {
        amsg.range += sepR + f.start + ',' + f.end
        sepR = ';'
        amsg.fragment += sepF + f.fragment
        sepF = ' '
      }
      let success = true
      for (const c of an.categories) {
        amsg.property_id = 'isc:' + c
        console.log('=== annotation')
        console.log(amsg)
        const result = await MessageBus.i.request('case/annotation/post', amsg)
        if (result.message.error) {
          this._message.innerHTML = 'error saving annotations'
          success = false
          break
        }
      }
      if (success) {
        this._message.style = 'color:blue'
        this._message.innerHTML = 'annotations saved'
      }
    }
  }

  _showAnnotations (organization, score) {
    document.querySelector('#organization-field').innerHTML =
      ': ' + organization
    document.querySelector('#score-field').innerHTML = ': ' + score
    document.querySelector('#submit-button').style.display = 'none'
  }
}

(function () {
  Annotator.i = new Annotator()

  Annotator.tags = {
    start: '<annot',
    end:   '</annot'
  }

  // isc: Illness Script Components
  Annotator.category = {
    organization: 'isc:organization',
    score: 'isc:score'
  }
})()

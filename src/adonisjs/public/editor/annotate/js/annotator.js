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
    this._ksave = {}
    this._kmemory = {}
    this._countMemory = 0

    this._annotationAction = this._annotationAction.bind(this)
    MessageBus.i.subscribe('annotation/button/#', this._annotationAction)

    this._gradeSave = this._gradeSave.bind(this)
    MessageBus.i.subscribe('control/grade/save', this._gradeSave)

    this._annotationsSave = this._annotationsSave.bind(this)
    MessageBus.i.subscribe('control/annotations/save', this._annotationsSave)

    this._memoryRemove = this._memoryRemove.bind(this)
    MessageBus.i.subscribe('control/memory/remove', this._memoryRemove)
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

      html = html.replace(/<[^>]+>/gm,'')
                 .replace(/<\/[^>]+>/gm, '')
                 .replace(/^[\r\n][\r\n]?/, '')

      this._document = html

      const caseAnn =
        await MessageBus.i.request('case/annotations/get', {case_id: caseId})

      if (caseAnn != null && caseAnn.message != null) {
        this._convertAnnotations(caseAnn.message)
        if (this._organization != null && this._score != null)
          this._showGrades()
        this._markAnnotations()
        this._updateSummary()
      }

      document.querySelector('#editor-space').innerHTML = this._document
      this._buildEditor()
    } else
      this._message.innerHTML = 'document not found'
  }

  _buildEditor () {
    const presentation = document.querySelector('#editor-space')
    DecoupledEditor.create(presentation,
      {
        toolbar: {
          items: ['annotatePatho', 'annotateEpi',  'annotateEti', 'annotateHist',
                  'annotatePhys', 'annotateCompl',   'annotateDiff',
                  'annotateThera', '-', 'annotateSimple', 'annotateEncap',
                  'annotateJar', 'annotateRight', 'annotateWrong', 'annotateTypo'],
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

  _convertAnnotations (caseAnn) {
    const annotations = []
    const ifrag = {}
    for (const c of caseAnn) {
      switch (c.property_id) {
        case Annotator.category.organization:
          this._organization = c.property_value; break
        case Annotator.category.score:
          this._score = c.property_value; break
        default:
          let slot
          const ifr = c.fragment + '_' + c.range
          let mem = 0
          if (ifrag[ifr])
            slot = ifrag[ifr]
          else {
            let frag = c.fragment
            const fs = c.range.split(';')
            const fragments = []
            for (const f of fs) {
              const se = f.split(',')
              const start = parseInt(se[0])
              const size = parseInt(se[1])
              const fp = {
                start: start,
                size:  size,
                fragment: frag.substr(0, size)
              }
              fragments.push(fp)
              this._kmemory[this._kmemoryPrefix(fp)] =
                (c.property_value[mem] == 'm')
              mem++
              frag = frag.substr(size + 1)
            }
            slot = {fragments: fragments, categories: []}
            annotations.push(slot)
            ifrag[ifr] = slot
          }
          const cat = c.property_id.substring(4)
          slot.categories.push(cat)
          this._ksave[this._ksavePrefix(slot) + cat] = true
      }
    }
    this._annotations = annotations
  }

  _markAnnotations () {
    const ranges = []
    for (const a of this._annotations) {
      for (const r of a.fragments)
        ranges.push({fragment: r, annot: a})
    }
    ranges.sort((a, b) => a.fragment.start - b.fragment.start)
    let last = 0
    const doc = this._document
    let doca = ''
    let close = []
    let level = 1
    let group = 0
    for (const r of ranges) {
      const next = r.fragment.start
      if (close.length > 0 && close[0] < next) {
        while (close.length > 0) {
          level--
          const pos = close.shift()
          doca += doc.substring(last, pos) + '</annot' + level + '>'
          last = pos
        }
      }
      doca += doc.substring(last, next) +
                '<annot' + level + ' range="' +
                r.fragment.start + ',' + r.fragment.size + '"'
      for (const c of r.annot.categories)
        doca += ' ' + c
      if (r.annot.fragments.length > 1) {
        if (r.annot.group == null) {
          group++
          r.annot.group = group
        }
        doca += ' group="' + r.annot.group + '"'
      }
      doca += '>'
      last = next
      close.unshift(next + r.fragment.size)
      level++
    }
    while (close.length > 0) {
      level--
      const pos = close.shift()
      doca += doc.substring(last, pos) + '</annot' + level + '>'
      last = pos
    }
    doca += doc.substring(last)
    this._document = doca
  }

  _annotationAction (topic, message) {
    let doc = this._editor.getData()
    doc = doc.replace(/<\/?p>/g, '')
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

      const fragment = doc.substring(pf + 1, ei)
                        .replace(/<annot[^>]*>/g, '')
                        .replace(/<\/annot[\d]>/g, '')
      const fragTrim = fragment.trim()

      const an = {start: pi + fragment.indexOf(fragTrim),
                  size: fragTrim.length,
                  fragment: fragTrim}

      const kf = this._kmemoryPrefix(an)
      if (this._kmemory[kf] == null)
        this._kmemory[kf] = true

      const meta = doc.substring(pi + Annotator.tags.start.length + 1, pf)
        .matchAll(/([\w-]+)="([^"]*)"/g)
      const categories = []
      let group = 0
      const prefix = an.start + '_' + an.size + '_' + an.fragment + '_'
      for (const m of meta) {
        if (m[2].length == 0) {
          let saved = false
          categories.push(m[1])
        } else if (m[1] == 'group')
          group = m[2]
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
      pi = doc.indexOf(Annotator.tags.start)
    }

    for (const an of annotations) {
      const prefix = this._ksavePrefix(an)
      for (const c of an.categories)
        if (this._ksave[prefix + c] == null)
          this._ksave[prefix + c] = false
    }

    this._annotations = annotations
    this._updateSummary()
  }

  _updateSummary () {
    let html = '<table>'
    let last = ''
    let ip = 0
    this._inputMemory = []
    for (const an of this._annotations) {
      html += '<tr><td><table>'
      for (const f of an.fragments) {
        html += '<tr><td>' + f.fragment + '</td><td>' +
                ((this._kmemory[this._kmemoryPrefix(f)])
                  ? '<span style="color:blue">M</span>'
                  : '<span style="color:purple">#</span>') + '</td><td>' +
                '<input type="checkbox" id="mem' + ip + '" name="mem' + ip + '">' +
                '</td></tr>'
        ip++
        this._inputMemory.push(this._kmemoryPrefix(f))
      }
      this._countMemory = ip
      html += '</table></td><td><table>'
      const prefix = this._ksavePrefix(an)
      for (const c of an.categories) {
        html += '<tr><td>' + c + '</td><td>' +
                ((this._ksave[prefix + c])
                  ? '<span style="color:green">saved</span>'
                  : '<span style="color:red">unsaved</span>') +
                '</td></tr>'
      }
      html += '</td></tr></table>'
    }
    html += '</table>'
    document.querySelector('#details').innerHTML = html
  }

  _memoryRemove () {
    console.log('=== memory')
    console.log(this._kmemory)
    for (let i = 0; i < this._countMemory; i++)
      if (document.querySelector('#mem' + i).checked) {
        console.log('=== escolhido')
        console.log(this._inputMemory[i])
        this._kmemory[this._inputMemory[i]] = false
      }
    this._updateSummary()
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
          this._organization = organization
          this._score = score
          this._showGrades()
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
      amsg.property_value = ''
      let sepR = ''
      let sepF = ''
      for (const f of an.fragments) {
        amsg.range += sepR + f.start + ',' + f.size
        sepR = ';'
        amsg.fragment += sepF + f.fragment
        sepF = ' '
        amsg.property_value +=
          (this._kmemory[this._kmemoryPrefix(f)]) ? 'm' : '-'
      }
      let success = true
      const prefix = this._ksavePrefix(an)
      for (const c of an.categories) {
        if (!this._ksave[prefix + c]) {
          amsg.property_id = 'isc:' + c
          const result =
            await MessageBus.i.request('case/annotation/post', amsg)
          if (result.message.error) {
            this._message.innerHTML = 'error saving annotations'
            success = false
            break
          }
          this._ksave[prefix + c] = true

          for (const f of an.fragments) {
            if (this._kmemory[this._kmemoryPrefix(f)]) {
              const rquest =
                await MessageBus.i.request('quest/annotation/post',
                  {quest_id: })
            }
          }
        }
      }
      if (success) {
        this._message.style = 'color:blue'
        this._message.innerHTML = 'annotations saved'
        this._updateSummary()
      }
    }
  }

  _showGrades () {
    document.querySelector('#organization-field').innerHTML =
      ': ' + this._organization
    document.querySelector('#score-field').innerHTML = ': ' + this._score
    document.querySelector('#submit-button').style.display = 'none'
  }

  _ksavePrefix (annotation) {
    const f = annotation.fragments
    return f[0].start + '_' + f[0].size + '_' +
           f.map(x => x.fragment).join(' ') + '_'
  }

  _kmemoryPrefix (frag) {
    return frag.start + '_' + frag.size + '_' + frag.fragment
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

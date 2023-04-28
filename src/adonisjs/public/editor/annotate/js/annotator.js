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
    this._ksaved = {}
    this._ksource = {}
    this._kmemory = {}
    this._countMemory = 0

    this._annotationAction = this._annotationAction.bind(this)
    MessageBus.i.subscribe('annotation/button/#', this._annotationAction)

    this._annotationSequence = this._annotationSequence.bind(this)
    MessageBus.i.subscribe('annotation/sequence/update', this._annotationSequence)

    this._saveGrade = this._saveGrade.bind(this)
    MessageBus.i.subscribe('control/grade/save', this._saveGrade)

    this._incorporateAutomatic = this._incorporateAutomatic.bind(this)
    MessageBus.i.subscribe(
      'control/automatic/incorporate', this._incorporateAutomatic)

    this._removeMemory = this._removeMemory.bind(this)
    MessageBus.i.subscribe('control/memory/remove', this._removeMemory)

    this._deleteAnnotation = this._deleteAnnotation.bind(this)
    MessageBus.i.subscribe('control/annotation/delete', this._deleteAnnotation)

    this._saveAnnotations = this._saveAnnotations.bind(this)
    MessageBus.i.subscribe('control/annotations/save', this._saveAnnotations)
  }

  async start () {
    this._message = document.querySelector('#status-message')

    this._roomId = (new URL(document.location)).searchParams.get('roomid')
    const caseId = (new URL(document.location)).searchParams.get('caseid')

    const cs = await MessageBus.i.request('case/source/get',
      {room_id: this._roomId, case_id: caseId})

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

      this._original = html
      this._document = html

      document.querySelector('#editor-space').innerHTML = this._document
      await this._loadAnnotations(caseId)
      if (this._organization != null && this._score != null &&
          this._year != null) {
        this._showGrades()
        await this._annotationsOrMemory(false)
      }
    } else
      this._message.innerHTML = 'document not found'
  }

  async _annotationsOrMemory (incorporated) {
    let memory = false
    if (!incorporated &&
        (this._annotations == null || this._annotations.length == 0)) {
      await this._loadMemory(this._questId)
      memory = this._memory != null && this._memory.length > 0
    }

    if (memory) {
      this._markAnnotations(this._memory)
      this._updateSummary(false)
      document.querySelector('#incorporate-automatic').style.display =
        'initial'
    } else {
      this._markAnnotations(this._annotations)
      this._updateSummary(true)
      this._buildEditor()
      document.querySelector('#remove-memory').style.display = 'initial'
      document.querySelector('#delete-annotation').style.display = 'initial'
      document.querySelector('#save-annotations').style.display = 'initial'
      document.querySelector('#memory-scores-title').innerHTML = 'Scores'
    }
  }

  async _loadAnnotations (caseId) {
    let caseAnn =
      await MessageBus.i.request('case/annotations/get',
        {room_id: this._roomId, case_id: caseId})

    if (caseAnn != null && caseAnn.message != null) {
      caseAnn = caseAnn.message
      const annotations = []
      const ifrag = {}
      for (const c of caseAnn) {
        switch (c.property_id) {
          case Annotator.category.organization:
            this._organization = c.property_value; break
          case Annotator.category.score:
            this._score = c.property_value; break
          case Annotator.category.year:
            this._year = c.property_value; break
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
                this._kmemory[this._kmemoryPrefix(fp)] = c.property_value[mem]
                mem++
                frag = frag.substr(size + 1)
              }
              slot = {fragments: fragments, categories: []}
              annotations.push(slot)
              ifrag[ifr] = slot
            }
            const cat = c.property_id.substring(4)
            slot.categories.push(cat)
            const key = this._kcatPrefix(slot) + cat
            this._ksource[key] = c.source
            this._ksaved[key] = 's' // saved
        }
      }
      this._annotations = annotations
    }
  }

  _showGrades () {
    document.querySelector('#organization-field').innerHTML =
      ': ' + this._organization
    document.querySelector('#score-field').innerHTML = ': ' + this._score
    document.querySelector('#year-field').innerHTML = ': ' + this._year
    document.querySelector('#submit-button').style.display = 'none'
  }

  async _loadMemory (questId) {
    const doc = this._document
    let questAnn =
      await MessageBus.i.request('quest/annotations/get',
        {room_id: this._roomId, quest_id: questId})

    if (questAnn != null && questAnn.message != null) {
      questAnn = questAnn.message
      const annotations = []
      const ifrag = {}
      for (const c of questAnn) {
        let slot = null
        if (ifrag[c.fragment])
          slot = ifrag[c.fragment]
        else {
          const pos = doc.indexOf(c.fragment)
          if (pos > -1) {
            slot = {
              fragments: [
                {fragment: c.fragment, start: pos, size: c.fragment.length}],
                 categories: []}
            annotations.push(slot)
            ifrag[c.fragment] = slot
          }
        }
        const cat = c.property_id.substring(4)
        if (slot != null) slot.categories.push(cat)
      }
      this._memory = annotations
    }
  }

  _markAnnotations (annotations) {
    // sort and merge overlapping annotations
    const ranges = []
    let grp = 1
    for (const a of annotations) {
      a.group = grp
      grp++
      for (const r of a.fragments)
        ranges.push({fragment: r, annot: [a]})
    }
    ranges.sort((a, b) => a.fragment.start - b.fragment.start)
    for (let r = 0; r < ranges.length - 1; r++) {
      if ((ranges[r].fragment.start == ranges[r + 1].fragment.start) &&
          (ranges[r].fragment.size == ranges[r + 1].fragment.size)) {
        ranges[r].annot.push(ranges[r + 1].annot[0])
        ranges.splice(r + 1, 1)
      }
    }
    
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
      let union = r.annot[0].categories
      for (let i = 1; i < r.annot.length; i++)
        union = [...new Set([...union, ...r.annot[i].categories])]
      doca += ' ' + union.join(' ')
      doca += ' categories="'
      let sep = ''
      for (const a of r.annot) {
        doca += sep + a.group + ':' + a.categories.join(',')
        sep = ';'
      }
      doca += '">'
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
    console.log('=== resulting document')
    console.log(doca)
    document.querySelector('#editor-space').innerHTML = doca
  }

  _incorporateAutomatic () {
    let pos = 0
    for (const an of this._memory) {
      const key = this._kmemoryPrefix(an.fragments[0])
      if (this._kmemory[key] == null)
        this._kmemory[key] = 'a'
      let transfer = false
      let i = 0
      const prefix = this._kcatPrefix(an)
      const selcat = []
      for (const c of an.categories) {
        if (document.querySelector('#auto' + pos).checked) {
          transfer = true
          this._ksource[prefix + c] = 2
          this._ksaved[prefix + c] = 'u' // unsaved
          selcat.push(c)
        }
        i++
        pos++
      }
      if (transfer) {
        an.categories = selcat
        this._annotations.push(an)
      }
    }
    this._memory = null
    document.querySelector('#memory-scores').innerHTML = ''
    document.querySelector('#memory-scores-title').innerHTML = 'Scores'
    this._document = this._original
    document.querySelector('#incorporate-automatic').style.display = 'none'
    this._annotationsOrMemory(true)
  }

  _buildEditor () {
    const presentation = document.querySelector('#editor-space')
    DecoupledEditor.create(presentation,
      {
        toolbar: {
          items: ['annotatePatho', 'annotateEpi',  'annotateEti', 'annotateHist',
                  'annotatePhys', 'annotateCompl',   'annotateDiff',
                  'annotateThera', '-', 'annotateSimple', 'annotateEncap',
                  'annotateJar', 'annotateRight', 'annotateWrong', 'annotateTypo',
                  'annotateLock', 'annotateAdd', 'annotateRemove', 'annotateReset'],
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

  _annotationSequence (topic, message) {
    console.log('=== annotation sequence')
    console.log(message)
    document.querySelector('#annotation-sequence').innerHTML = message
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
        this._kmemory[kf] = 'm'

      let groups = []
      
      const meta = doc.substring(pi + Annotator.tags.start.length + 1, pf)
        .matchAll(/([\w-]+)="([^"]*)"/g)
      for (const m of meta) {
        if (m[1] == 'categories') {
          const grp = m[2].split(';')
          for (const g of grp) {
            const gi = g.split(':')
            groups[gi[0]] = gi[1].split(',')
          }
        }
      }

      for (const g in groups) {
        if (anGroup[g])
          anGroup[g].fragments.push(an)
        else {
          anGroup[g] = {fragments: [an], categories: groups[g], group: g}
          annotations.push(anGroup[g])
        }
      }

      doc = doc.substring(0, pi) +
            doc.substring(pf + 1, ei) +
            doc.substring(ei + Annotator.tags.end.length + 2)
      pi = doc.indexOf(Annotator.tags.start)
    }

    // merge annotations in the same groups
    let current = this._annotationFragmentKey(annotations[0])
    for (let a = 0; a < annotations.length - 1; a++) {
      const next = this._annotationFragmentKey(annotations[a + 1])
      console.log('current: ' + current + ', next: ' + next)
      if (current == next) {
        annotations[a].categories = annotations[a].categories.concat(
          annotations[a + 1].categories)
        annotations.splice(a + 1, 1)
        a--
      }
      else
        current = next
    }

    for (const an of annotations) {
      const prefix = this._kcatPrefix(an)
      for (const c of an.categories) {
        const key = prefix + c
        if (this._ksaved[key] == null)
          this._ksaved[key] = 'u' // unsaved
        if (this._ksource[key] == null)
          this._ksource[key] = 1
      }
    }

    this._annotations = annotations
    this._updateSummary(true)
  }

  _annotationFragmentKey (annotation) {
    let key = ''
    for (const f of annotation.fragments)
      key += f.start + '-' + f.size + ';'
    return key
  }

  _updateSummary (isAnnotations) {
    const catList = ['pathophysiology', 'epidemiology', 'etiology',
                     'history', 'physical', 'exams', 'differential',
                     'therapeutic']

    let ctideas = 0, ctright = 0, ctinfright = 0
    let ctwrong = 0, ctrightencap = 0, ctwrongencap = 0
    const catIndex = {}

    const annotations = (isAnnotations) ? this._annotations : this._memory
    let html = '<table>'
    let ip = 0, dc = 0
    this._inputMemory = []
    this._deleteCandidate = []
    const anStatus = {
      'u': {mess: 'unsaved', color: 'red'},
      's': {mess: 'saved', color: 'green'},
      'd': {mess: 'deleted', color: 'purple'}
    }
    for (const an of annotations) {
      ctideas++
      html += '<tr><td><table><tr>'
      let sep = ''
      for (const f of an.fragments) {
        html += sep + '<td>' + f.fragment
        if (isAnnotations) {
          html += '</td><td>' +
                  ((this._kmemory[this._kmemoryPrefix(f)] == '-')
                    ? '<span style="color:purple">-</span>'
                    : '<span style="color:blue">M</span>') +
                  '</td><td><input type="checkbox" id="mem' + ip +
                    '" name="mem' + ip + '">'
          ip++
        }
        html += '</td>'
        this._inputMemory.push(this._kmemoryPrefix(f))
        sep = '</td><td>+'
      }
      html += '</tr></table></td><td><table>'
      const prefix = this._kcatPrefix(an)
      if (an.categories.includes('encapsulated'))
        if (an.categories.includes('wrong'))
          ctwrongencap++
        else
          ctrightencap++
      if (!an.categories.includes('wrong'))
        ctinfright++
      for (const c of an.categories) {
        if (c == 'right') ctright++
        else if (c == 'wrong') ctwrong++
        if (catList.includes(c))
          catIndex[c] = c
        this._deleteCandidate.push(prefix + c)
        html += '<tr><td>' + c + '</td><td>'
        if (isAnnotations) {
          // html +=  ((this._ksaved[prefix + c] == 's')
          //           ? '<span style="color:green">saved</span>'
          //           : '<span style="color:red">unsaved</span>')
          html += '<span style="color:' + anStatus[this._ksaved[prefix + c]].color +  
                  '">' + anStatus[this._ksaved[prefix + c]].mess + '</span>' +
                  '</td><td><input type="checkbox" id="del' + dc +
                  '" name="del' + dc + '">'
          dc++
        } else {
          html += '<input type="checkbox" id="auto' + ip +
                  '" name="auto' + ip + '">'
          ip++
        }
        html += '</td></tr>'
      }
      html += '</td></tr></table>'
    }
    html += '</table>'
    if (isAnnotations) {
      this._countMemory = ip
      this._countDelCandidates = dc
    }
    document.querySelector(
      '#' + ((isAnnotations) ? 'annotation-details' : 'memory-scores'))
      .innerHTML = html

    const ctcategories = Object.keys(catIndex).length
    if (isAnnotations) {
      document.querySelector('#memory-scores').innerHTML =
        `<ul>
          <li><b>used categories:</b> ${ctcategories}</li>
          <li><b>right:</b> ${ctright}</li>
          <li><b>right (inferred):</b> ${ctinfright}</li>
          <li><b>total ideas:</b> ${ctideas}</li>
          <li><b>right encapsulated:</b> ${ctrightencap}</li>
          <li><b>wrong:</b> ${ctwrong}</li>
          <li><b>wrong encapsulated:</b> ${ctwrongencap}</li>
          <br>
          <li><b>coverage score:</b> ${ctcategories * ctideas}</li>
          <li><b>accuracy score:</b> ${(ctideas == 0) ? '' : ctright / ctideas}</li>
          <li><b>accuracy score (inferred):</b> ${(ctideas == 0) ? '' : ctinfright / ctideas}</li>
          <li><b>encapsulated score:</b> ${(ctideas == 0) ? '' : (ctrightencap + ctwrongencap) / ctideas}</li>
        </ul>`
    }
  }

  _removeMemory () {
    for (let i = 0; i < this._countMemory; i++)
      if (document.querySelector('#mem' + i).checked)
        this._kmemory[this._inputMemory[i]] = '-'
    this._updateSummary(true)
  }

  _deleteAnnotation () {
    for (let d = 0; d < this._countDelCandidates; d++) {
      if (document.querySelector('#del' + d).checked &&
          this._ksaved[this._deleteCandidate[d]] != 's')
        this._ksaved[this._deleteCandidate[d]] = 'd'
      console.log(this._deleteCandidate[d] + ': ' + this._ksaved[this._deleteCandidate[d]])
    }
    this._updateSummary(true)
  }

  async _saveGrade () {
    const organization = document.querySelector('#organization').value
    const score = document.querySelector('#score').value
    const year = document.querySelector('#year').value

    if (organization == 'c')
      this._message.innerHTML = 'select the organization level'
    else if (score == 'c')
      this._message.innerHTML = 'select the global score'
    else if (year == 'c')
      this._message.innerHTML = 'select the student year'
    else {
      const ann = {
        room_id: this._roomId,
        case_id: this._case.id,
        property_id: Annotator.category.organization,
        range: 'complete',
        property_value: organization,
        source: 1
      }
      let result = await MessageBus.i.request('case/annotation/post', ann)
      if (result.message.error)
        this._message.innerHTML = 'error saving organization level'
      else {
        ann.property_id = Annotator.category.score
        ann.property_value = score
        result = await MessageBus.i.request('case/annotation/post', ann)
        if (result.message.error)
          this._message.innerHTML = 'error saving global score'
        else {
          ann.property_id = Annotator.category.year
          ann.property_value = year
          result = await MessageBus.i.request('case/annotation/post', ann)
          if (result.message.error)
            this._message.innerHTML = 'error saving student year'
          else {
            this._message.style = 'color:blue'
            this._message.innerHTML = 'organization/score/year submitted'
            this._organization = organization
            this._score = score
            this._year = year
            this._showGrades()
            await this._annotationsOrMemory(false)
          }
        }
      }
    }
  }

  async _saveAnnotations () {
    const amsg = {
      room_id: this._roomId,
      case_id: this._case.id
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
        amsg.property_value += this._kmemory[this._kmemoryPrefix(f)]
      }
      let success = true
      const prefix = this._kcatPrefix(an)
      for (const c of an.categories) {
        const key = prefix + c
        if (this._ksaved[key] == 'u') {
          amsg.property_id = 'isc:' + c
          amsg.source = this._ksource[key]
          const result =
            await MessageBus.i.request('case/annotation/post', amsg)
          if (result.message.error) {
            this._message.innerHTML = 'error saving annotations'
            success = false
            break
          }
          this._ksaved[key] = 's' // saved

          for (const f of an.fragments) {
            if (this._kmemory[this._kmemoryPrefix(f)] != '-') {
              const rquest =
                await MessageBus.i.request('quest/annotation/post',
                  {room_id: this._roomId,
                   property_id: amsg.property_id,
                   fragment: f.fragment})
            }
          }
        }
      }
      if (success) {
        this._message.style = 'color:blue'
        this._message.innerHTML = 'annotations saved'
        this._updateSummary(true)
      }
    }
  }

  _kcatPrefix (annotation) {
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
    score: 'isc:score',
    year: 'isc:student_year'
  }
})()

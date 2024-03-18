class ReportManager {
  start () {
    MessageBus.i.subscribe('report/download', this._downloadAnalysis.bind(this))
    MessageBus.i.subscribe('report/bio/#', this._downloadBIO.bind(this))
    MessageBus.i.subscribe('report/full', this._downloadFull.bind(this))
    this._roomId = new URL(document.location).searchParams.get('roomid')
  }

  async _requestCases () {
    const cases = await MessageBus.i.request('room/cases/get',
      {roomId: this._roomId})
    if (cases.message.error) {
      console.log('--- error')
      console.log(cases.message.error)
      return null
    } else
      return cases
  }

  // <TODO> Copy of the same method in annotator.js
  async _loadAnnotations (caseId) {
    let result = {
      organization: '',
      score: '',
      year: '',
      annotations: []
    }

    let caseAnn =
      await MessageBus.i.request('case/annotations/get',
        {room_id: this._roomId, case_id: caseId})

    if (caseAnn != null && caseAnn.message != null) {
      caseAnn = caseAnn.message
      const annotations = []
      const ifrag = {}
      for (const c of caseAnn) {
        switch (c.property_id) {
          case ReportManager.category.organization:
            result.organization = c.property_value; break
          case ReportManager.category.score:
            result.score = c.property_value; break
          case ReportManager.category.year:
            result.year = c.property_value; break
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
                mem++
                frag = frag.substr(size + 1)
              }
              slot = {fragments: fragments, categories: []}
              annotations.push(slot)
              ifrag[ifr] = slot
            }
            const cat = c.property_id.substring(4)
            slot.categories.push(cat)
        }
      }
      result.annotations = annotations
    }

    return result
  }

  _download (table, extension) {
    const element = document.createElement('a')
    element.setAttribute('href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(table))
    element.setAttribute('download', 'annotations.' + extension)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  /*
   * Export Analysis
  */

  _calculateMetrics (annotations) {
    let ctideas = 0, ctright = 0, ctinfright = 0
    let ctwrong = 0, ctrightencap = 0, ctinfrightencap = 0, ctwrongencap = 0
    const catIndex = {}
    const catOrder = []

    for (const an of annotations) {
      ctideas++
      let start = -1
      for (const f of an.fragments) {
        start = (start == -1) ? f.start : start
      }
      if (an.categories.includes('encapsulated'))
        if (an.categories.includes('wrong'))
          ctwrongencap++
        else {
          ctinfrightencap++
          if (an.categories.includes('right'))
            ctrightencap++
        }
      if (!an.categories.includes('wrong'))
        ctinfright++
      for (const c of an.categories) {
        if (c == 'right') ctright++
        else if (c == 'wrong') ctwrong++
        if (ReportManager.catList.includes(c)) {
          catIndex[c] = c
          catOrder.push([ReportManager.catList.indexOf(c)+1, start])
        }
      }
    }
    const selfOrder = AnnotationMetrics.i._selfOrderCount(catOrder)

    const clustering = AnnotationMetrics.i._clusteringFreeRecall(catOrder)

    const o1csv = this._groupsToCSV(selfOrder.groups)

    const o2csv = this._groupsToCSV(selfOrder.ordered)

    const ordered = {}
    for (const g of selfOrder.ordered)
      ordered[ReportManager.catList[g[0]-1]] = g[2]
    let countCat = ''
    for (const c of ReportManager.catList)
      countCat += ',' + (ordered[c] ? ordered[c] : 0)
    
    const ctcategories = Object.keys(catIndex).length

    const ctordernorm = (ctideas == 0) ? 0 : selfOrder.score / ctideas

    return {self_order_score: selfOrder.score,
            self_order_score_normalized: ctordernorm,
            clustering: clustering,
            self_order_groups: o1csv,
            self_order_ordered: o2csv,
            csv: `${ctcategories},${ctright},${ctinfright},${ctideas},${ctrightencap},${ctinfrightencap},${ctwrong},${ctwrongencap},` +
                 `${ctcategories * ctideas},${(ctideas == 0) ? 0 : ctright / ctideas},${(ctideas == 0) ? 0 : ctinfright / ctideas},` +
                 `${(ctideas == 0) ? 0 : (ctrightencap + ctwrongencap) / ctideas},${selfOrder.score},` +
                 `${ctordernorm},${clustering}${countCat},"${o1csv}","${o2csv}"`
           }
  }

  _groupsToCSV (groups) {
    let g2csv = ''
    let sep = ''
    for (const g of groups) {
      g2csv += sep + ReportManager.catList[g[0]-1] + ':' + g[2]
      sep = '; '
    }
    return g2csv
  }

  async _downloadAnalysis () {
    const tprefix = document.querySelector('#tprefix').value

    const cases = await this._requestCases()

    if (cases != null) {
      let table = '"user id","annotation id","organization level","global score","student year",' +
        '"used categories","right","right (inferred)","total ideas","right encapsulated",' +
        '"right encapsulated (inferred)","wrong","wrong encapsulated","coverage score",' +
        '"accuracy score","accuracy score (inferred)","encapsulated score","self order score",' +
        '"normalized self order score","clustering in free recall"'

      for (const m in ReportManager.catList)
        table += ',"' + ReportManager.catList[m] + '"'

      table += ',"self order groups","self order ordered"\n'

      for (const c of cases.message) {
        // remove prefix from title
        if (c.title.startsWith(tprefix))
          c.title = c.title.replace(tprefix, '')

        table += '"' + c.title + '","' + c.id + '",'

        const ant = await this._loadAnnotations(c.id)
        const metrics = this._calculateMetrics(ant.annotations).csv

        table += `"${ant.organization}","${ant.score}","${ant.year}",` + 
                 metrics + '\n'
      }

      this._download(table, 'csv')
    }
  }

  /*
   * Export BIO
  */

  async _buildBIO (caseId, annotations, multiple, composed) {
    const tt = await this._tokenize(caseId)
    let tokens = tt.tokens

    // plan all annotations in a single array
    let plan = []
    let annGroup = 1  // id for each annotation group
    for (const an of annotations) {
      let first = true
      for (const f of an.fragments) {
        if (composed || first)  // maintain only the first fragment for pruned
          plan.push([f, an.categories, annGroup])
        first = false
      }
      annGroup++
    }
    console.log('=== plan')
    console.log(plan)

    // order them by the last position
    plan = plan.sort((a, b) =>
      (a[0].start + a[0].size) - (b[0].start + b[0].size))

    // transform annotations by fragments in annotations by token
    const ranges = []
    for (const pl of plan) {
      // gather proper categories
      let cat = []
      for (const c of pl[1])
        if (ReportManager.catList.includes(c))
          cat.push(c)

      const an = pl[0]
      const group = pl[2]

      if (cat.length >0) {
        if (!this._rangesConflict(ranges, an)) {
          ranges.push([an.start, an.start + an.size - 1])
          let firstMatch = true
          // transfers annotations to tokens
          for (let t = 0; t < tokens.length; t++) {
            const tk = tokens[t]
            if (tk[1] >= an.start && tk[1] <= an.start + an.size - 1) {
              const bio = (firstMatch) ? 'B' : 'I'
              for (const c of cat) {
                if (tk[3][c] == null)
                  tk[3][c] = [bio, [group]]
                else
                  tk[3][c][1].push(group)
              }
              firstMatch = false
            }
          }
        }
      }
    }

    // merge together BIO in sequence of the same group
    for (let t = 1; t < tokens.length; t++) {
      const tk = tokens[t]
      const prev = tokens[t-1]
      for (const c in tk[3]) {
        if (prev[3][c]) {
          const intersection = tk[3][c][1].filter(x => prev[3][c][1].includes(x))
          if (intersection.length > 0)
            // merge together
            tk[3][c][0] = 'I'
        }
      }
    }

    console.log('=== tokens')
    console.log(tokens)

    // expand annotations to serialize
    let expanded = []
    let t = 0
    const catOrder = []  // to calculate metrics
    while (t < tokens.length) {
      const tk = tokens[t]
      const tCats = Object.keys(tk[3])
      let last = t
      if (tCats.length == 0)
        expanded.push([tk[0], tk[1], tk[2], 'O', null])
      else { // gather together BIO sequences
        const blocks = []
        for (const c of tCats) {
          let tk = tokens[t]
          const bl = [[tk[0], tk[1], tk[2], 'B', c, tk[3][c][1]]]
          let shift = t + 1
          while (shift < tokens.length && tokens[shift][3][c] &&
                 tokens[shift][3][c][0] == 'I') {
            tk = tokens[shift]
            bl.push([tk[0], tk[1], tk[2], 'I', c, tk[3][c][1]])
            shift++
          }
          last = Math.max(last, shift - 1)
          blocks.push(bl)
        }
        console.log('=== blocks')
        console.log(blocks)
        // if (multiple) {
        //   for (const bl of blocks) {
        //     expanded = expanded.concat(bl)
        //     catOrder.push([ReportManager.catList.indexOf(bl[0][4])+1, bl[0][1]])
        //   }
        // } else {
          // select the longest blocks
        const selected = []
        const biggest = last - t + 1
        for (const bl of blocks)
          if (bl.length == biggest)
            selected.push(bl)

        if (multiple) {
          // concentrate all categories and groups in a single annotation
          const cats = {}
          for (const s of selected) {
            if (cats[s[0][4]] == null)
              cats[s[0][4]] = s[0][5]
            else
              // union of the two arrays without repetition
              cats[s[0[4]]] = [...new Set([...cats[s[0][4]], ...s[0][5]])]
            catOrder.push([ReportManager.catList.indexOf(s[0][4])+1, s[0][5], s[0][1]])
          }
          for (const sel of selected[0]) {
            sel[4] = cats
            sel.pop()
          }
          expanded = expanded.concat(selected[0])
        } else {
          // select a random among biggest
          const sel = selected[Math.floor(Math.random() * selected.length)]
          expanded = expanded.concat(sel)
          catOrder.push([ReportManager.catList.indexOf(sel[0][4])+1, sel[0][5], sel[0][1]])
        }
      }
      t = last + 1
    }

    const selfOrder = AnnotationMetrics.i._selfOrderCount(catOrder)
  
    return {
      doc_id: caseId,
      text: tt.text,
      labels: expanded,
      self_order_score: selfOrder.score,
      self_order_score_normalized: (annotations.length == 0) ? 0 : selfOrder.score / annotations.length,
      clustering: AnnotationMetrics.i._clusteringFreeRecall(catOrder),
      self_order_groups: this._groupsToCSV(selfOrder.groups),
      self_order_ordered: this._groupsToCSV(selfOrder.ordered)
    }
  }

  async _loadCaseText (caseId) {
    const cs = await MessageBus.i.request('case/source/get',
                                          {room_id: this._roomId, case_id: caseId})

    let text = null
    if (cs != null && cs.message != null) {
      const compiled =
      await Translator.instance.compileMarkdown(
        cs.message.id, cs.message.source)

      text = ''
      for (const knot in compiled.knots) {
        const mkHTML =
          await Translator.instance.generateHTML(compiled.knots[knot])
        text += mkHTML
      }
  
      text = text.replace(/<[^>]+>/gm,'')
                 .replace(/<\/[^>]+>/gm, '')
                 .replace(/^[\r\n][\r\n]?/, '')
    }

    return text
  }

  async _tokenize (caseId) {
    const tokens = []
    let result = {}

    const text = await this._loadCaseText(caseId)
  
    if (text != null) {
      let c = 0
      let tk = ''
      let tks = -1
      while (c <= text.length) {
        if (c == text.length || ReportManager.separators.includes(text[c])) {
          if (tks != -1) {
            tokens.push([tk, tks, c-1, {}])
            tk = ''
            tks = -1
            if (c < text.length && ReportManager.septoken.includes(text[c]))
              tokens.push([text[c], c, c, {}])
          }
        } else {
          if (tks == -1)
            tks = c
          tk += text[c]
        }
        c++
      }

      result = {
        text: text,
        tokens: tokens
      }
    }
  
    return result
  }

  _rangesConflict (ranges, annotation) {
    const start = annotation.start
    const final = annotation.start + annotation.size - 1
    for (const r of ranges) {
      const rStart = r[0]
      const rFinal = r[1]
      // avoid breaking previous annotations in the middle
      // test contained or cross ranges - start or final inside one range
      if ((start > rStart && start <= rFinal) ||
          (final >= rStart && final < rFinal))
        return true
    }
    return false
  }

  async _downloadBIO (topic, message) {
    const multiple = (topic == 'report/bio/multiple')
    const composed = (multiple || topic == 'report/bio/single/composed')

    const tprefix = document.querySelector('#tprefix').value

    const cases = await this._requestCases()

    let table = ''

    if (cases != null) {
      for (const c of cases.message) {
        const ant = await this._loadAnnotations(c.id)
        console.log('=== case')
        console.log(c.id)
        const bio =
          await this._buildBIO(c.id, ant.annotations, multiple, composed)
        table += JSON.stringify(bio) + '\n'
      }

      this._download(table, 'jsonl')
    }
  }

  /*
   * Export JSON
  */

  async _buildFull (caseId, annotations) {
    const text = await this._loadCaseText(caseId)
    const annComp = []

    for (const an of annotations) {
      let frag = ''
      for (let f = 0; f < an.fragments.length; f++) 
        frag += (f > 0 ? ' + ' : '') + an.fragments[f].fragment
      const last = an.fragments.length - 1
      annComp.push([
        frag,
        an.fragments[0].start,
        an.fragments[last].start + an.fragments[last].size - 1,
        an.categories
      ])
    }

    const metrics = this._calculateMetrics(annotations)

    return {
      doc_id: caseId,
      text: text,
      annotations: annComp,
      self_order_score: metrics.self_order_score,
      self_order_score_normalized: metrics.self_order_score_normalized,
      clustering: metrics.clustering,
      self_order_groups: metrics.self_order_groups,
      self_order_ordered: metrics.self_order_ordered
    }
  }

  async _downloadFull () {
    const tprefix = document.querySelector('#tprefix').value

    const cases = await this._requestCases()

    let table = ''
    if (cases != null) {
      for (const c of cases.message) {
        const ant = await this._loadAnnotations(c.id)
        const annJson = await this._buildFull(c.id, ant.annotations)
        table += JSON.stringify(annJson) + '\n'
      }

      this._download(table, 'jsonl')
    }
  }
}

(function () {
  ReportManager.i = new ReportManager()

  ReportManager.separators = [
    ' ', '\n', '\r', '\t', '.', ',', ';', ':', '(', ')', '[', ']', '{', '}']
  ReportManager.septoken = [
    '.', ',', ';', ':', '(', ')', '[', ']', '{', '}']

  // <TODO> Copy of the same constants in annotator.js
  // isc: Illness Script Components
  ReportManager.category = {
    organization: 'isc:organization',
    score: 'isc:score',
    year: 'isc:student_year'
  }

  // <TODO> Copy of the same constants in annotator.js
  ReportManager.catList = ['pathophysiology', 'epidemiology', 'etiology',
    'history', 'physical', 'exams', 'differential',
    'therapeutic']
})()

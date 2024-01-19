class ReportManager {
  start () {
    MessageBus.i.subscribe('report/download', this._downloadAnalysis.bind(this))
    MessageBus.i.subscribe('report/bilou/single', this._downloadBILOU.bind(this))
    MessageBus.i.subscribe('report/bilou/multiple', this._downloadBILOU.bind(this))
    MessageBus.i.subscribe('report/json', this._downloadJSON.bind(this))
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

  _download (table) {
    const element = document.createElement('a')
    element.setAttribute('href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(table))
    element.setAttribute('download', 'annotations.csv')
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

    let o1csv = ''
    let sep = ''
    for (const g of selfOrder.groups) {
      o1csv += sep + ReportManager.catList[g[0]-1] + ':' + g[2]
      sep = '; '
    }

    let o2csv = ''
    sep = ''
    const ordered = {}
    for (const g of selfOrder.ordered) {
      ordered[ReportManager.catList[g[0]-1]] = g[2]
      o2csv += sep + ReportManager.catList[g[0]-1] + ':' + g[2]
      sep = '; '
    }

    let countCat = ''
    for (const c of ReportManager.catList)
      countCat += ',' + (ordered[c] ? ordered[c] : 0)
    
    const ctcategories = Object.keys(catIndex).length

    return `${ctcategories},${ctright},${ctinfright},${ctideas},${ctrightencap},${ctinfrightencap},${ctwrong},${ctwrongencap},` +
           `${ctcategories * ctideas},${(ctideas == 0) ? 0 : ctright / ctideas},${(ctideas == 0) ? 0 : ctinfright / ctideas},` +
           `${(ctideas == 0) ? 0 : (ctrightencap + ctwrongencap) / ctideas},${selfOrder.score},` +
           `${(ctideas == 0) ? 0 : selfOrder.score / ctideas},${clustering}${countCat},"${o1csv}","${o2csv}"`
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
        const metrics = this._calculateMetrics(ant.annotations)

        table += `"${ant.organization}","${ant.score}","${ant.year}",` + 
                 metrics + '\n'
      }

      this._download(table)
    }
  }

  /*
   * Export BILOU
  */

  async _buildBILOU (caseId, annotations, multiple) {
    console.log('=== multiple')
    console.log(multiple)
    const tt = await this._tokenize(caseId)
    let tokens = tt.tokens
  
    const ranges = []
    for (const an of annotations) {
      // gather proper categories
      let cat = []
      for (const c of an.categories)
        if (ReportManager.catList.includes(c))
          cat.push(c)

      if (cat.length >0) {
        if (!this._rangeConflict(ranges, an.fragments)) {
          this._addRanges(ranges, an.fragments)
          for (let f = 0; f < an.fragments.length; f++) {
            let firstMatch = true
            let firstToken = null
            let firstTokenPos = -1
            let prevLast = null
            let extraTokens = []
            for (let t = 0; t < tokens.length; t++) {
              const tk = tokens[t]
              if (tk[1] >= an.fragments[f].start &&
                  tk[1] <= an.fragments[f].start + an.fragments[f].size - 1) {
                tk[3] =
                  (an.fragments.length == 1 && firstMatch)
                    ? 'U'
                    : ((f == 0 && firstMatch)
                      ? 'B'
                      : ((f+1 < an.fragments.length) || (tk[2] < an.fragments[f].last))
                        ? 'I'
                        : 'L')
                tk[4] = cat[0]
                if (multiple && cat.length > 1) {
                  for (let c = 1; c < cat.length; c++) {
                    const tk2 = tk.slice()
                    tk2[4] = cat[c]
                    extraTokens.push(tk2)
                  }
                }
                if (firstMatch) {
                  firstToken = tk
                  firstTokenPos = t
                } else if (firstToken != -1) {
                  firstToken[3] = 'B'
                  firstToken = -1
                }
                firstMatch = false
                if (prevLast != null) {
                  prevLast[3] = 'I'
                  prevLast = null
                }
                if (tk[3] == 'L')
                  prevLast = tk
              }
            }
            console.log('=== tokens')
            console.log(JSON.stringify(tokens))
            console.log('=== extraTokens')
            console.log(JSON.stringify(extraTokens))
            if (firstTokenPos > -1 && extraTokens.length > 0) {
              extraTokens = extraTokens.sort((a, b) => (a[4] == b[4]) ? a[1] - b[1] : a[4].localeCompare(b[4]))
              tokens.splice(firstTokenPos, 0, ...extraTokens)
              console.log(JSON.stringify(tokens))
              console.log(JSON.stringify(extraTokens))
            }
          }
        }
      }
    }


    // reorganize tokens by position
    // if (multiple) {
    //   tokens = tokens.concat(extraTokens)
    //   tokens = tokens.sort((a, b) => a[1] - b[1])
    // }

    console.log('=== tokens NER')
    console.log(tokens)

    return {
      doc_id: caseId,
      text: tt.text,
      labels: tokens
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
            tokens.push([tk, tks, c-1, 'O', null])
            tk = ''
            tks = -1
            if (c < text.length && ReportManager.septoken.includes(text[c]))
              tokens.push([text[c], c, c, 'O', null])
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

  _rangeConflict (ranges, fragments) {
    const start = fragments[0].start
    const final = fragments[fragments.length-1].start + fragments[fragments.length-1].size - 1
    let r = 0
    while (r < ranges.length && start < ranges[r][1]) {
      if ((start >= ranges[r][0] && start <= ranges[r][1]) ||
          (final >= ranges[r][0] && final <= ranges[r][1]) ||
          (ranges[r][0] >= start && ranges[r][0] <= final) ||
          (ranges[r][1] >= start && ranges[r][1] <= final))
        return true
      r++
    }
    return false
  }

  _addRanges (ranges, fragments) {
    for (const f of fragments)
      ranges.push([f.start, f.start + f.size - 1])
  }

  async _downloadBILOU (topic, message) {
    const multiple = (topic == 'report/bilou/multiple')

    const tprefix = document.querySelector('#tprefix').value

    const cases = await this._requestCases()

    let table = ''

    if (cases != null) {
      for (const c of cases.message) {
        const ant = await this._loadAnnotations(c.id)
        const bilou =
          await this._buildBILOU(c.id, ant.annotations, multiple)
        table += JSON.stringify(bilou) + '\n'
      }

      this._download(table)
    }
  }

  /*
   * Export JSON
  */

  async _buildJSON (caseId, annotations) {
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

    return {
      doc_id: caseId,
      text: text,
      annotations: annComp
    }
  }

  async _downloadJSON () {
    const tprefix = document.querySelector('#tprefix').value

    const cases = await this._requestCases()

    let table = ''
    if (cases != null) {
      for (const c of cases.message) {
        const ant = await this._loadAnnotations(c.id)
        const annJson = await this._buildJSON(c.id, ant.annotations)
        table += JSON.stringify(annJson) + '\n'
      }

      this._download(table)
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

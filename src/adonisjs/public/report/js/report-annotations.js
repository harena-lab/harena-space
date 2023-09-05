class ReportManager {
  start () {
    this._download = this._download.bind(this)
    MessageBus.i.subscribe('report/download', this._download)
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

    return `${ctcategories},${ctright},${ctinfright},${ctideas},${ctrightencap},${ctinfrightencap},${ctwrong},${ctwrongencap},${ctcategories * ctideas},${(ctideas == 0) ? 0 : ctright / ctideas},${(ctideas == 0) ? 0 : ctinfright / ctideas},${(ctideas == 0) ? 0 : (ctrightencap + ctwrongencap) / ctideas},${selfOrder.score},${(ctideas == 0) ? 0 : selfOrder.score / ctideas}${countCat},"${o1csv}","${o2csv}"`
  }

  async _download () {
    const tprefix = document.querySelector('#tprefix').value

    const cases = await this._requestCases()

    if (cases != null) {
      let table = '"user id","annotation id","oranization level","global score","student year",' +
        '"used categories","right","right (inferred)","total ideas","right encapsulated",' +
        '"right encapsulated (inferred)","wrong","wrong encapsulated","coverage score",' +
        '"accuracy score","accuracy score (inferred)","encapsulated score","self order score",' +
        '"normalized self order score"'

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

      const element = document.createElement('a')
      element.setAttribute('href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(table))
      element.setAttribute('download', 'annotations.csv')
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
  }
}

(function () {
  ReportManager.i = new ReportManager()

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

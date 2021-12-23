class ReportUsersManager {
  start () {
    this._report = this._report.bind(this)
    MessageBus.i.subscribe('report/update', this._report)
  }

  async _report () {
    const reportArea = document.querySelector('#report-area')
    reportArea.innerHTML = '<h2>Processing...</h2>'

    let userCases = await MessageBus.i.request('user/cases/get',
      {clearance: '4', nItems: '9999'})

    console.log('=== user cases')
    console.log(userCases)

    if (userCases.message.error) {
      console.log('--- error')
      console.log(userCases.message.error)
    } else {
      const cs = {}
      for (const u of userCases.message.cases) {
        if (!cs[u.author_id])
          cs[u.author_id] = [u]
        else
          cs[u.author_id].push(u)
      }
      console.log(cs)

      // let csv = '"user", "case", "evaluation"'
      let html = '<table style="border: 2px solid darkgray"><tr>' +
                 '<th style="border: 2px solid darkgray">User</th>' +
                 '<th style="border: 2px solid darkgray">Title/hour</th>' +
                 '<th style="border: 2px solid darkgray">POCUS</th>' +
                 '</tr>'
      const checked = document.getElementsByClassName('form-check-input')
      let lastUser = null
      let countCases = 0
      console.log('=== cases')
      for (const c of checked) {
        if (c.checked && cs[c.value]) {
          const ki = {}
          let tu = {}
          let tua = 0
          const likert = {
            'likert_documentation_examination': {count: 0, sum: 0},
            'likert_examination': {count: 0, sum: 0},
            'likert_image_optimization': {count: 0, sum: 0},
            'likert_interpretation_images': {count: 0, sum: 0},
            'likert_knowledge_ultrasound_equipment': {count: 0, sum: 0},
            'likert_medical_decision_making': {count: 0, sum: 0},
            'likert_systematic_examination': {count: 0, sum: 0}
          }
          let hasLikert = false
          for (const csu of cs[c.value]) {
            countCases++
            reportArea.innerHTML = '<h2>Computing Case ' + countCases + '...</h2>'
            let caseMk = await MessageBus.i.request('case/markdown/get',
              {caseId: csu.id})
            console.log(caseMk)
            let compiledCase =
              await Translator.instance.compileMarkdown(
                csu.id, caseMk.message.source)

            // csv += '"' + ((c.value == lastUser) ? '' : csu.username) + '",' +
            //        '"' + csu.title + '",'
            html += '<tr><td style="border: 2px solid darkgray">' +
                    ((c.value == lastUser) ? '' : csu.username) +
                    '</td><td style="border: 2px solid darkgray">' +
                    csu.title + '</td>' +
                    '</td><td style="border: 2px solid darkgray">' +
                    '<table style="border: 2px solid darkgray">'
            lastUser = c.value

            const knots = compiledCase.knots
            for (const k in knots) {
              if (ReportUsersManager.ktypes.includes(knots[k].title))
                if (tu[knots[k].title])
                  tu[knots[k].title]++
                else
                  tu[knots[k].title] = 1
              if (knots[k].annotations != null) {
                let htmli = ''
                let sum = 0
                let count = 0
                for (const a of knots[k].annotations) {
                  if (a.context && a.formal && a.formal.media && a.formal.media.grade) {
                    htmli += '<tr><td style="border: 2px solid darkgray">' +
                             a.context +
                             '</td><td style="border: 2px solid darkgray">' +
                             a.formal.media.grade +
                             '</td></tr>'
                    sum += parseInt(a.formal.media.grade)
                    count++
                  }
                }
                if (htmli.length > 0) {
                  html += '<tr><td style="border: 2px solid darkgray" colspan="2">' +
                          '<b>' + knots[k].title + '</b></td></tr>' + htmli +
                          '<tr><td style="border: 2px solid darkgray">' +
                          '<b>average</b></td><td style="border: 2px solid darkgray">' +
                         (Math.round(sum * 10 / count) / 10) + '<td></tr>' +
                         '<tr><td></td></tr>'
                   tua++
                   if (!ki[knots[k].title])
                     ki[knots[k].title] = {sum: 0, count: 0}
                   ki[knots[k].title].sum += sum
                   ki[knots[k].title].count += count
                } else if (ReportUsersManager.ktypes.includes(knots[k].title))
                  html += '<tr><td style="border: 2px solid darkgray" colspan="2">' +
                          '<b>' + knots[k].title + '</b></td></tr>'
              }
              if (k == 'Conclusion') {
                console.log('=== conclusion')
                for (const c of knots[k].content) {
                  if (c.type == 'field' && c.field == 'conclusion') {
                    console.log('=== comments')
                    html += '<tr><td style="border: 2px solid darkgray">' +
                            '<b>likert</b></td><td style="border: 2px solid darkgray"><b>value</b></tr>'
                    for (const f in c.value) {
                      html += '<tr><td style="border: 2px solid darkgray">' +
                              f + '</td><td style="border: 2px solid darkgray">' +
                              c.value[f] + '</td></tr>'
                      if (likert[f]) {
                        likert[f].count++
                        likert[f].sum += parseInt(c.value[f])
                        hasLikert = true
                      }
                    }
                  }
                }
              }
            }
            html += '</table></td></tr>'
          }
          if (Object.keys(tu).length > 0) {
            html += '<tr><td>&nbsp</td></tr>' +
                    '<tr><td style="border: 2px solid darkgray"><b>Total Exams</b></td></tr>' +
                    '<tr><td style="border: 2px solid darkgray"><b>exam type</b></td>' +
                    '<td style="border: 2px solid darkgray"><b>count</b></td></tr>'
            let tt = 0
            for (const t in tu) {
              html += '<tr><td style="border: 2px solid darkgray">' +
                      t + '</td><td style="border: 2px solid darkgray">' +
                      tu[t] + '</td></tr>'
              tt += tu[t]
            }
            html += '</td></tr><tr><td></td></tr>' +
                    '<tr><td style="border: 2px solid darkgray"><b>' +
                    'Total exams</b></td><td style="border: 2px solid darkgray">' +
                    tt + '</td></tr>'
          }
          if (Object.keys(ki).length > 0) {
            html += '<tr><td>&nbsp</td></tr>' +
                    '<tr><td style="border: 2px solid darkgray"><b>Grades</b></td></tr>' +
                    '<tr><td style="border: 2px solid darkgray"><b>exam type</b></td>' +
                    '<td style="border: 2px solid darkgray"><b>grade average</b></td></tr>'
            for (const i in ki) {
              html += '<tr><td style="border: 2px solid darkgray">' +
                      i + '</td><td style="border: 2px solid darkgray">' +
                      (Math.round(ki[i].sum * 10 / ki[i].count) / 10) +
                      '</td></tr>'
            }
            html += '</td></tr><tr><td></td></tr>' +
                    '<tr><td style="border: 2px solid darkgray"><b>' +
                    'Total evaluated</b></td><td style="border: 2px solid darkgray">' +
                    tua + '</td></tr>'
          }
          if (hasLikert) {
            html += '<tr><td>&nbsp</td></tr>' +
                    '<tr><td style="border: 2px solid darkgray"><b>Likert</b></td></tr>' +
                    '<tr><td style="border: 2px solid darkgray"><b>item</b></td>' +
                    '<td style="border: 2px solid darkgray"><b>grade average</b></td></tr>'
            for (const l in likert) {
              html += '<tr><td style="border: 2px solid darkgray">' +
                      l + '</td><td style="border: 2px solid darkgray">' +
                      (Math.round(likert[l].sum * 10 / likert[l].count) / 10) +
                      '</td></tr>'
            }
          }
        }
    }
    html += '</table>'
    reportArea.innerHTML = html
  }
  }
}

(function () {
  ReportUsersManager.i = new ReportUsersManager()

  ReportUsersManager.ktypes = [
    'Lungs', 'Cava', 'Heart', 'Lower Limb Veins', 'Abdomen',
    'Aorta', 'Urinary', 'Vesicle and Portal Triad', 'E-FAST', 'Soft Parts',
    'Articulate', 'Ocular']
})()

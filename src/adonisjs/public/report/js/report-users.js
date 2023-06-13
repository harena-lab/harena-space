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
      let html = '<table class="report-table">'
      let htmls = html
      const checked = document.getElementsByClassName('form-check-input')
      let lastUser = null
      let countCases = 0
      console.log('=== cases')
      for (const c of checked) {
        if (c.checked) {
          const userId = c.value.split(':')[0]
          if (cs[userId]) {
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
            for (const csu of cs[userId]) {
              countCases++
              reportArea.innerHTML = '<h2>Computing Case ' + countCases + '...</h2>'
              let caseMk = await MessageBus.i.request('case/markdown/get',
                {caseId: csu.id})
              console.log(caseMk)
              let compiledCase =
                await Translator.instance.compileMarkdown(
                  csu.id, caseMk.message.source)

              if (userId != lastUser) {
                html += '<tr><td colspan="2"><h1>' +
                        csu.username +
                        '</h1></td></tr><tr>' +
                        '<th>Case</th>' +
                        '<th>POCUS</th>' +
                        '</tr>'
                htmls += '<tr><td colspan="6"><h1>' +
                          csu.username +
                          '</h1></td></tr>' +
                          '<tr><th>Exams</th><th>1st Quarter</th>' +
                          '<th>2nd Quarter</th><th>3rd Quarter</th>' +
                          '<th>4th Quarter</th><th>Grade Average</th></tr>'
              }

              // csv += '"' + ((userId == lastUser) ? '' : csu.username) + '",' +
              //        '"' + csu.title + '",'
              html += '<tr><td>' +
                      csu.title + '</td>' +
                      '</td><td>' +
                      '<table class="report-table">'
              lastUser = userId

              const knots = compiledCase.knots
              for (const k in knots) {
                if (ReportUsersManager.ktypes.includes(knots[k].title)) {
                  const factor = (ReportUsersManager.factor[knots[k].title])
                    ? ReportUsersManager.factor[knots[k].title] : 1
                  if (tu[knots[k].title])
                    tu[knots[k].title] += factor
                  else
                    tu[knots[k].title] = factor
                }
                if (knots[k].annotations != null) {
                  let htmli = ''
                  let sum = 0
                  let count = 0
                  for (const a of knots[k].annotations) {
                    if (a.context && a.formal && a.formal.media && a.formal.media.grade) {
                      htmli += '<tr><td>' +
                              a.context +
                              '</td><td>' +
                              a.formal.media.grade +
                              '</td></tr>'
                      sum += parseInt(a.formal.media.grade)
                      count++
                    }
                  }
                  if (htmli.length > 0) {
                    html += '<tr><td class="report-table" colspan="2">' +
                            '<b>' + knots[k].title + '</b></td></tr>' +
                          '<tr><td><b>' +
                          'take</b></td><td><b>' +
                          'grade</b></td></tr>' + htmli +
                            '<tr><td>' +
                            '<b>average</b></td><td>' +
                          (Math.round(sum * 10 / count) / 10) + '<td></tr>' +
                          '<tr><td></td></tr>'
                    tua++
                    if (!ki[knots[k].title])
                      ki[knots[k].title] = {sum: 0, count: 0}
                    ki[knots[k].title].sum += sum
                    ki[knots[k].title].count += count
                  } else if (ReportUsersManager.ktypes.includes(knots[k].title))
                    html += '<tr><td class="report-table" colspan="2">' +
                            '<b>' + knots[k].title + '</b></td></tr>'
                }
                if (k == 'Conclusion') {
                  console.log('=== conclusion')
                  for (const c of knots[k].content) {
                    if (c.type == 'field' && c.field == 'conclusion') {
                      console.log('=== comments')
                      html += '<tr><td>' +
                              '<b>likert</b></td><td><b>value</b></tr>'
                      for (const f in c.value) {
                        html += '<tr><td>' +
                                f + '</td><td>' +
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
                      '<tr><td><b>Total Exams</b></td></tr>' +
                      '<tr><td><b>exam type</b></td>' +
                      '<td><b>count</b></td></tr>'
              let tt = 0
              let qt = [0, 0, 0, 0]
              for (const t in tu) {
                html += '<tr><td>' +
                        t + '</td><td>' +
                        tu[t] + '</td></tr>'
                tt += tu[t]

                const q = [0, 0, 0, 0]
                let a = tu[t]
                for (let f = 4; f >= 1 && a > 0; f--) {
                  let s = Math.trunc(a / f)
                  a -= s * f
                  for (let ff = 0; ff < f; ff++) {
                    q[ff] += s
                    qt[ff] += s
                  }
                }
                htmls += '<tr><td><b>' + t + '</b></td>'
                for (let i = 0; i < 4; i++)
                  htmls += '<td>' + ((q[i] == 0) ? '' : q[i]) + '</td>'
                htmls += '<td>' +
                        ((ki[t])
                          ? (Math.round(ki[t].sum * 10 / ki[t].count) / 10) : '') +
                        '</td></tr>'
              }
              html += '</td></tr><tr><td></td></tr>' +
                      '<tr><td><b>' +
                      'Total exams</b></td><td>' +
                      tt + '</td></tr>'
              htmls += '<tr><td><b>Total of Exams</b></td>'
              for (let i = 0; i < 4; i++)
                htmls += '<td><b>' + ((qt[i] == 0) ? '' : qt[i]) + '</b></td>'
              htmls += '<td></td></tr>'
            }
            if (Object.keys(ki).length > 0) {
              html += '<tr><td>&nbsp</td></tr>' +
                      '<tr><td><b>Grades</b></td></tr>' +
                      '<tr><td><b>exam type</b></td>' +
                      '<td><b>grade average</b></td></tr>'
              for (const i in ki) {
                html += '<tr><td>' +
                        i + '</td><td>' +
                        (Math.round(ki[i].sum * 10 / ki[i].count) / 10) +
                        '</td></tr>'
              }
              html += '</td></tr><tr><td></td></tr>' +
                      '<tr><td><b>' +
                      'Total evaluated</b></td><td>' +
                      tua + '</td></tr>'
            }
            if (hasLikert) {
              html += '<tr><td>&nbsp</td></tr>' +
                      '<tr><td><b>Likert</b></td></tr>' +
                      '<tr><td><b>item</b></td>' +
                      '<td><b>grade average</b></td></tr>'
              for (const l in likert) {
                html += '<tr><td>' +
                        l + '</td><td>' +
                        (Math.round(likert[l].sum * 10 / likert[l].count) / 10) +
                        '</td></tr>'
              }
            }
          } else {
            html += '<table>' +
                    '<tr><td><h1>' + c.value.split(':')[1] + '</h1></td></tr>' +
                    '<tr><td><h2>No cases</h2></td></tr>' +
                    '</table>'
          }
        }
      }
      html += '</table>'
      htmls += '</table><br>'
      reportArea.innerHTML = html
      document.querySelector('#report-summary').innerHTML = htmls
    }
  }
}

(function () {
  ReportUsersManager.i = new ReportUsersManager()

  ReportUsersManager.ktypes = [
    'Lungs', 'Cava', 'Heart', 'Lower Limb Veins', 'Abdomen',
    'Aorta', 'Urinary', 'Vesicle and Portal Triad', 'E-FAST', 'Soft Parts',
    'Articulate', 'Ocular']

  ReportUsersManager.factor = {'Lower Limb Veins': 2}
})()

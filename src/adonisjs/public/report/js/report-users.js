class ReportUsersManager {
  start () {
    this._report = this._report.bind(this)
    MessageBus.i.subscribe('report/update', this._report)
  }

  async _report () {
    const reportArea = document.querySelector('#report-area')

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

      let csv = '"user", "case", "evaluation"'
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
          let tu = 0
          for (const csu of cs[c.value]) {
            countCases++
            reportArea.innerHTML = 'Computing Case ' + countCases + '...'
            let caseMk = await MessageBus.i.request('case/markdown/get',
              {caseId: csu.id})
            console.log(caseMk)
            let compiledCase =
              await Translator.instance.compileMarkdown(
                csu.id, caseMk.message.source)

            console.log('*** COMPILED CASE ***')
            console.log(compiledCase)

            csv += '"' + ((c.value == lastUser) ? '' : csu.username) + '",' +
                   '"' + csu.title + '",'
            html += '<tr><td style="border: 2px solid darkgray">' +
                    ((c.value == lastUser) ? '' : csu.username) +
                    '</td><td style="border: 2px solid darkgray">' +
                    csu.title + '</td>' +
                    '</td><td style="border: 2px solid darkgray">' +
                    '<table style="border: 2px solid darkgray">'
            lastUser = c.value

            const knots = compiledCase.knots
            for (const k in knots) {
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
                   tu++
                   if (!ki[knots[k].title])
                     ki[knots[k].title] = {sum: 0, count: 0}
                   ki[knots[k].title].sum += sum
                   ki[knots[k].title].count += count
                }
              }
            }
            html += '</table></td></tr>'
          }
          if (Object.keys(ki).length > 0) {
            html += '<tr><td>&nbsp</td></tr>' +
                    '<tr><td style="border: 2px solid darkgray"><b>Summary</b></td></tr>'
                    '<tr><td style="border: 2px solid darkgray">Units</td>' +
                    '<td style="border: 2px solid darkgray">'
            for (const i in ki) {
              html += '<tr><td style="border: 2px solid darkgray">' +
                      i + '</td><td style="border: 2px solid darkgray">' +
                      (Math.round(ki[i].sum * 10 / ki[i].count) / 10) +
                      '</td></tr>'
            }
            html += '</td></tr>' +
                    '<tr><td style="border: 2px solid darkgray"><b>' +
                    'Total units</b></td><td style="border: 2px solid darkgray">' +
                    tu + '</td></tr>'
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
})()

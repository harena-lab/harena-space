class ReportManager {
  start () {
    this._report = this._report.bind(this)
    MessageBus.i.subscribe('report/update', this._report)
  }

  async _report () {
    console.log('=== report')
    const reportArea = document.querySelector('#report-area')

    let logger = await MessageBus.i.request('logger/list/get',
      {caseId: new URL(document.location).searchParams.get('id')})

    if (logger.message.error) {
      console.log('--- error')
      console.log(logger.message.error)
    } else {
      const logs = {}
      for (const l of logger.message.logs)
        logs[l.id] = l
      const checked = document.getElementsByClassName('form-check-input')
      for (const c of checked) {
        if (c.checked) {
          const answers = JSON.parse(logs[c.value].log)
          MessageBus.i.publish('dcc-space-cellular/update/state', answers.state)
        }
      }
      /*
      const logs = {}
      for (const l of logger.message.logs)
        logs[l.id] = l

      let html = '<table style="border: 2px solid darkgray"><tr>' +
                 '<th style="border: 2px solid darkgray">user</th>' +
                 '<th style="border: 2px solid darkgray">date/hour</th>' +
                 '<th style="border: 2px solid darkgray">answers</th>' +
                 '</tr>'
      const checked = document.getElementsByClassName('form-check-input')
      for (const c of checked) {
        if (c.checked) {
          const answers = JSON.parse(logs[c.value].log)
          html += '<tr><td style="border: 2px solid darkgray">' +
                  logs[c.value].username +
                  '</td><td style="border: 2px solid darkgray">' +
                  logs[c.value].created_at +
                  '</td><td style="border: 2px solid darkgray">' +
                  '<table style="border: 2px solid darkgray">'

          for (const v in answers.variables)
            html += '<tr>' +
                    '<td style="border: 1px solid darkgray">' +
                    v +
                    '</td><td style="border: 1px solid darkgray">' +
                    answers.variables[v] +
                    '</td></tr>'
          html += '</table></td></tr>'
        }
        console.log(c.value)
        console.log(c.checked)

      }
            html += '</table>'
      console.log(logger.message)
      document.querySelector('#report-area').innerHTML = html
       */ 
    }
  }
}

(function () {
  ReportManager.i = new ReportManager()
})()
